import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import './Explore.css'

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

async function getEvents(json_func) {
  let tags = ["popular", "problem solving"];
  let todaysDate = getCurrentDateFormatted();
  let options = {
    method: "GET",
  }
  if(localStorage["access_token"]){ // create function for this?
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
  let response = await fetch("/day/" + todaysDate, options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  let json = await response.json();

  let relevant_events = getRelevantEvents(json, tags);

  json_func(relevant_events);
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
  if(localStorage["access_token"]){ // create function for this?
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
  let response = await fetch("/bookmark", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  document.getElementById("bookmark" + eventId).className = "hidden";
  document.getElementById("bookmarked" + eventId).className = "bookmarked";
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
  if(localStorage["access_token"]){ // create function for this?
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
  let response = await fetch("/bookmark", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  document.getElementById("bookmark" + eventId).className = "";
  document.getElementById("bookmarked" + eventId).className = "hidden bookmarked";
}

function BoxRow({tag, eventArray}) {
  let eventNames = [];
  let eventNamesToIds = {};
  for (let eventObject of eventArray) {
    let eventName = Object.values(eventObject)[0]["name"];
    let eventId = Object.keys(eventObject)[0];
    eventNames.push(eventName);
    eventNamesToIds[eventName] = eventId;
  }
  return (
    <div>
      <h2>{tag}</h2>
      <div className="container">
        {eventNames.map((eventName, i) => (
          <div key={i} className="box">
            <p>{eventName}</p>
            <p id={`bookmark${eventNamesToIds[eventName]}`} onClick={() => addBookmark(eventNamesToIds[eventName])}>Bookmark</p>
            <p id={`bookmarked${eventNamesToIds[eventName]}`} className="hidden bookmarked" onClick={() => deleteBookmark(eventNamesToIds[eventName])}>Bookmarked!</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Explore() {
  const [events, setEvents] = useState("")

  useEffect(() => {
    getEvents(setEvents);
  }, []);

  let boxRows = Object.keys(events).map(tag => (
    <BoxRow key={tag} tag={tag} eventArray={events[tag]} />
  ));

  return (
    <>
      <div className="top">
        <h1>Explore Page</h1> 
        <input type="text" placeholder="search"></input>
      </div>
      {boxRows}
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
