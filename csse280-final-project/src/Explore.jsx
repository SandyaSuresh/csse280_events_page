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

function getRelevantEvents(json, tags) {
  let events_by_tags = {}
  for (let i=0; i<tags.length; i++) {
    events_by_tags[tags[i]] = [];
  }
  for (let i=0; i<tags.length; i++) {
    let tag = tags[i];
    for (let event in json) {
      // if (tag in json[event]["tags"]) {
      //   console.log("true")
      //   events_by_tags[tag].push(event);
      // }
      for (let j=0; j<json[event]["tags"].length; j++) {
        if (tag == json[event]["tags"][j]) {
          events_by_tags[tag].push(event);
          //break;
        }
      }
    }
  }
  return events_by_tags;
}

async function getEvents(json_func) {
  let tags = ["popular", "problem solving"];
  // let events_by_tags = new Map();
  // tags.forEach((tag) => {
  //   events_by_tags.set(tag, []);
  // })
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

function BoxRow({tag, eventNames}) {
  // let title = document.createElement("h2");
  // title.textContent = `${tag}`;
  // let container = document.createElement("div")
  // container.className = "container";
  // eventNames.forEach((eventName) => {
  //   let event = document.createElement("div");
  //   event.className = "box";
  //   let eventText = document.createElement("p");
  //   eventText.textContent = `${eventName}`
  //   event.appendChild(eventText);
  //   container.appendChild(event);
  // });
  return (
    <div>
      <h2>{tag}</h2>
      <div className="container">
        {eventNames.map((eventName, i) => (
          <div key={i} className="box">
            <p>{eventName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Explore() {
  // let events = None;
  // const [json, setJSON] = useState("");
  // useEffect(() => {
  //   events = getEvents(setJSON);
  // }, [setJSON]); // ???????????????????????
  const [events, setEvents] = useState("")


  // let boxRows=[]; //!!!!!!!!!!
  useEffect(() => {
    getEvents(setEvents);

    // boxRows = []; // declared before useEffect()
    // let tags = events;

    // for (let tag in tags) {
    //   console.log(tag);
    //   boxRows.push(<BoxRow tag={tag} eventNames={events[tag]}></BoxRow>);
    // }
    // boxRows = boxRows.map(boxRow => {boxRow});
  }, [events, setEvents]);
  let boxRows = Object.keys(events).map(tag => (
    <BoxRow key={tag} tag={tag} eventNames={events[tag]} />
  ));

  return (
    <>
      <div className="top">
        <h1>Explore Page</h1> 
        <input type="text" placeholder="search"></input>
      </div>
      {boxRows}
      {/* <h2>Popular Today!</h2>
      <div className="container">
        <div className="box"><p>Test</p></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <h2>Sporting Events</h2>
      <div className="container">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <h2>Multi-Day</h2>
      <div className="container">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      <h2>General Meetings</h2>
      <div className="container">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div> */}
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
