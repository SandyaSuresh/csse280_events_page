import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import './Explore.css'

function addAuthHeader(options) {
  if(localStorage["access_token"]){ // create function for this?
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
}

function getCurrentDateFormatted() { // this code is somewhere else, replace with function?
  let date = new Date();
  let format_day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let format_month = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) ;
  let formatted_date = format_month + "-" + format_day + "-" + date.getFullYear();
  return formatted_date;
}

function getRelevantEvents(json, tags) { // code could be a lot simpler i think!!!!!!!!!!!!!!!!!!
  let events_by_tags = {}
  for (let i=0; i<tags.length; i++) {
    events_by_tags[tags[i]] = [];
  }
  for (let i=0; i<tags.length; i++) {
    let tag = tags[i];
    for (let event in json) {
      for (let j=0; j<json[event]["tags"].length; j++) {
        if (tag == json[event]["tags"][j]) {
          events_by_tags[tag].push({[event]: json[event]});
          //break???????????????????? here?????????
        }
      }
    }
  }
  return events_by_tags;
}

async function getEvents(eventSetterFunc) {
  let startDate = document.getElementById("start").value;
  let endDate = document.getElementById("end").value;
  let pattern = /^\d\d-\d\d-\d\d\d\d$/;
  if (!pattern.test(startDate) || !pattern.test(endDate)) {
    alert("Dates must be in MM-DD-YYYY format.")
  }
  let dateRange = startDate + " " + endDate;

  return await getEventsInRange(eventSetterFunc, dateRange);
}

function getTagsListFromEventList(events) {
  let tags = [];
  for (let i = 1; i <= Object.keys(events).length; i++) {
    console.log(events[i]);
    for (let tag of events[i]["tags"]) {
      if (!(tags.includes(tag))) {
        tags.push(tag);
      }
    }
  }
  return tags;
}

async function getEventsInRange(eventSetterFunc, dateRange) {
  //let tags = ["popular", "problem solving", "computer science", "hackathon", "all majors", "thinking", "csse"];
  let options = {
    method: "GET",
  }
  addAuthHeader(options);
  let response = await fetch("/events/" + dateRange, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  let json = await response.json();
  console.log(Object.values(json));

  let tags = getTagsListFromEventList(json);

  let relevant_events = getRelevantEvents(json, tags);

  eventSetterFunc(relevant_events);
}

async function addBookmark(eventId) {
  let options = {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "event-id": eventId
    })
  }
  addAuthHeader(options);
  let response = await fetch("/bookmark", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  for (let element of document.getElementsByClassName("bookmark" + eventId)) {
    element.classList.remove("clickable");
    element.classList.add("hidden");
  }
  for (let element of document.getElementsByClassName("bookmarked" + eventId)) {
    element.classList.remove("hidden");
    element.classList.add("clickable");
  }
}

async function deleteBookmark(eventId) {
  let options = {
    method: "DELETE",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "event-id": eventId
    })
  }
  addAuthHeader(options);
  let response = await fetch("/bookmark", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  for (let element of document.getElementsByClassName("bookmark" + eventId)) {
    element.classList.remove("hidden");
    element.classList.add("clickable")
  }
  for (let element of document.getElementsByClassName("bookmarked" + eventId)) {
    element.classList.remove("clickable");
    element.classList.add("hidden");
  }
}

async function renderBookmarks(events) {
  let options = {
    method: "GET",
  }
  addAuthHeader(options);
  let response = await fetch("/bookmarks", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  let bookmarkedEventIds = await response.json();

  for (let tag of Object.keys(events)) {
    for (let event of events[tag]) {
      let eventId = Object.keys(event)[0];
      if (bookmarkedEventIds.indexOf(eventId) > -1) { // checks if eventId is in bookmarkedEventIds
        for (let element of document.getElementsByClassName("bookmark" + eventId)) {
          element.classList.remove("clickable");
          element.classList.add("hidden");
        }
        for (let element of document.getElementsByClassName("bookmarked" + eventId)) {
          element.classList.remove("hidden");
          element.classList.add("clickable");
        }
      }
    }
  }
  return bookmarkedEventIds
}

function BoxRow({tag, eventArray, viewEventFunc}) {
  let eventNames = [];
  let namesToIds = {};
  for (let eventObject of eventArray) {
    let eventName = Object.values(eventObject)[0]["name"];
    let eventId = Object.keys(eventObject)[0];
    eventNames.push(eventName);
    namesToIds[eventName] = eventId;
  }
  return (
    <>
      <h2>{tag}</h2>
      <section className="container">
        {eventNames.map((eventName, i) => (
          <div key={i} className="box">
            <p className={`nameOfEventId${namesToIds[eventName]} clickable`} onClick={() => viewEventFunc(namesToIds[eventName])}>{eventName}</p>
            <p className={`bookmark${namesToIds[eventName]} clickable`} onClick={() => addBookmark(namesToIds[eventName])}>Bookmark</p> {/*better notation?????*/}
            <p className={`hidden bookmarked bookmarked${namesToIds[eventName]}`} onClick={() => deleteBookmark(namesToIds[eventName])}>Bookmarked!</p>
          </div>
        ))}
      </section>
    </>
  );
}

// function EventView() {
//   return <p>Test</p>
// }
function militaryTo12HourTime(date) {
  let hour = parseInt(date.slice(11, 13));
  let minute = parseInt(date.slice(14, 16));
  if (minute < 10) {
    minute = "0" + minute;
  }
  let extension = "";
  if (hour >= 12) {
    extension = " p.m."
    hour -= 12;
    if (hour < 10) {
      hour = parseInt("0" + hour);
    }
  } else {
    extension = " a.m."
  }
  let newDate = date.slice(0, 11) + hour + ":" + minute + extension;
  return newDate;
}

function renderViewedEvent(eventId, eventsData, updateViewedEventFunc) {
  let eventName, eventTags, eventStart, eventEnd, eventGroup = "";

  if (eventId == -1) {
    return <></>; // ???????????????????????????????????
  } else {
    for (let eventsInCategory of Object.values(eventsData)) {
      for (let eventObj of eventsInCategory) {
        console.log(eventObj);
        console.log(Object.keys(eventObj));
        console.log(Object.values(eventObj));
        // console.log(Object.keys(Object.values(eventObj)));
        // console.log(Object.values(Object.keys(eventObj)));
        if (Object.keys(eventObj)[0] == eventId) {
          let event = Object.values(eventObj)[0];
          eventName = event["name"]
          eventTags = event["tags"].join(", ")
          eventStart = militaryTo12HourTime(event["start"])
          if (event["start"].slice(0, 10) == event["end"].slice(0, 10)) {
            eventEnd = militaryTo12HourTime(event["end"]).slice(11);
          } else {
            eventEnd = militaryTo12HourTime(event["end"]);
          }
          eventGroup = event["group"];
        }
      }
    }
    return (
    <section id="event-info" className="">
      <button onClick={() => {updateViewedEventFunc(-1); renderViewedEvent(-1, eventsData)}}>x</button>
      <strong>{eventName}</strong>
      <p>Time: {eventStart} to {eventEnd}</p>
      <p>Group: {eventGroup}</p>
      <p>Tags: {eventTags}</p>
    </section>
    )
  }
}

function Explore() {
  const [events, setEvents] = useState("")
  const [viewedEvent, setViewedEvent] = useState(-1)
  const [viewedEventBox, setViewedEventBox] = useState(<></>);
  // const [startDate, setStartDate] = useState(""); // happens every time, causing problems, maybe remove and start from scratch
  // const [endDate, setEndDate] = useState("");

  // useEffect(() => {
  //   if (startDate == "" && endDate == "") {
  //     setStartDate(getCurrentDateFormatted());
  //     setEndDate("12-31-2099");
  //   } else {
  //     setStartDate(document.getElementById("start").value);
  //     setEndDate(document.getElementById("end").value);
  //   }
  // }, []);

  useEffect(() => {
    getEventsInRange(setEvents, `${getCurrentDateFormatted()}` + " 12-31-2099");
  }, []);

  useEffect(() => {
    renderBookmarks(events);
  }, [events])

  useEffect(() => {
    setViewedEventBox(renderViewedEvent(viewedEvent, events, setViewedEvent));
  }, [viewedEvent, events])

  let boxRows = Object.keys(events).map(tag => (
    <BoxRow key={tag} tag={tag} eventArray={events[tag]} viewEventFunc={setViewedEvent} />
  ));



  return (
    <>
      <section id="top">
        <h1>Explore Page</h1>
        <form>
          <input type="text" id="start" pattern="\d\d-\d\d-\d\d\d\d" placeholder="Start date: (MM-DD-YYYY)"></input>
          <input type="text" id="end" pattern="\d\d-\d\d-\d\d\d\d" placeholder="End date: (MM-DD-YYYY)"></input>
          <button type="submit" onClick={(e) => {
            e.preventDefault();
            getEvents(setEvents); 
            // setStartDate(document.getElementById("start").value); 
            // setEndDate(document.getElementById("end").value)
          }}>Find events!</button>
        </form>
      </section>
      {boxRows}
      {viewedEventBox}
    </>
  )
}
export default Explore;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Explore />
  </StrictMode>,
)
