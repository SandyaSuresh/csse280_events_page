import { useEffect, useState} from 'react'
import './Timeline.css'

function generateDayBreakdown(json, date, func){
  if(date == undefined || json == ""){
    return [];
  }
  let container = [];
  let seen = [];
  //24 *4 = 96 elements
  let colors = getColorsForKeys(json)
  // console.log(json)
  // console.log(Object.keys(json))
  let date_parts = date.split("-")
  let dateStart = Date.parse(date_parts[2] + "-" + date_parts[0] + "-" + date_parts[1] + "T00:00:00.000")
  let fifteenMins = 900000;
  for(let i = 0; i < 96; i++){
    let time_div = document.createElement("div")
    time_div.key = i;
    time_div.classList.add("timespan")
    if (i % 4 == 0){
      time_div.classList.add("show-hour");
    }else if (i % 2 == 0){
      time_div.classList.add("show-half-hour");
    }
    let timeStart = dateStart + i * (fifteenMins)
    let timeEnd = dateStart + (i + 1) * fifteenMins

    if(json != undefined){
      Object.keys(json).forEach(key => {
        // console.log(key);
        let eventStart = Date.parse(json[key]["start"])
        let eventEnd= Date.parse(json[key]["end"])
        if(!((eventEnd < timeStart) || (eventStart > timeEnd))){

          let event_div = document.createElement("div");
          event_div.classList.add("eventspan");
          event_div.key = key + i +  json[key]["name"];
          if(!seen.includes(key)){
            event_div.classList.add("first-event-div");
            let eventName = document.createElement("h3")
            eventName.textContent = json[key]["name"];
            event_div.appendChild(eventName);   
            // console.log(event_div)
            seen.push(key);
          }
          
          if(seen.includes(key) && eventEnd <= timeEnd + fifteenMins){
            event_div.classList.add("last-event-div");           
          }
          event_div.style = "background-color: " + colors[key]
          event_div.onclick = (e) => {
            func(renderViewedEvent(key, json[key]));
            e.preventDefault;
          };
          // console.log(event_div.style)

          // console.log(timeStart.toString() + "   " + timeEnd.toString())
          // event_div.style.backgroundColor = "rgb(i*15, i*15, i*15)"
          time_div.appendChild(event_div)
        }
        console.log(seen)
      });
      }
    container.push(time_div)
  }  
  
  return container;
}

function getColorsForKeys(json){
  if(json == undefined){
    return {};
  }
  let dict= {}
  Object.keys(json).forEach(key => {
    let color = getRandomColor()
    dict[key] = color
  })
  return dict
}

function getRandomColor(){
  let color = "#"
  let opt = "0123456789ABCDEF"
  for(let i = 0; i < 6; i++){
    color += opt.charAt(Math.floor(Math.random() * opt.length))
  }
  color += "88"
  return color
}

function getBGColor(event){
  let style = {}
  style["backgroundColor"] = event.style.backgroundColor;
  return style
}

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

function renderViewedEvent(eventId, eventsData) {
  let eventName, eventTags, eventStart, eventEnd, eventGroup = "";

  if (eventId == -1) {
    return <></>; // ???????????????????????????????????
  } else {
    for (let eventsInCategory of Object.values(eventsData)) {
      for (let eventObj of eventsInCategory) {
        // console.log(eventObj);
        // console.log(Object.keys(eventObj));
        // console.log(Object.values(eventObj));
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
      <button onClick={() => {renderViewedEvent(-1, eventsData)}}>x</button>
      <strong>{eventName}</strong>
      <p>Time: {eventStart} to {eventEnd}</p>
      <p>Group: {eventGroup}</p>
      <p>Tags: {eventTags}</p>
    </section>
    )
  }
}

function Timeline({json, date}) {
  // let json = {"1":{"name":"hello world","group":"csse","start":"10/30/2025 17:55:30","end":"10/30/2025 19:00:30","tags":["computer science","csse","learning"]},"2":{"name":"puzzle","group":"problems","start":"10/22/2025 20:00:00","end":"11/17/2025 20:01:00","tags":["puzzles","thinking","problem solving"]},"3":{"name":"25th","group":"greatest floor","start":"12/25/2025 10:10:10","end":"12/26/2025 11:11:11","tags":["school wide","all majors","hackathon"]}}
  // let date = "10-30-2025"
  
  // console.log(JSON.stringify(json) + "  " + date)

  // useEffect(()=>{
  //   generateDayBreakdown(json, date)
  // }, [json, date])

  const [viewEvent, setEventDiv] = useState(<></>);

  useEffect(()=>{
    generateDayBreakdown(json, date)
  }, [json, date, setEventDiv]);
  // useEffect(() => {
  //   setEventDive(renderViewedEvent(viewedEvent, events, setViewedEvent));
  // }, [viewedEvent, events])
  // console.log(json)
  let events=generateDayBreakdown(json, date, setEventDiv);
  // console.log(events)
  return (
    <>
      <div id="container-div">{events.map((item) => (
        <div className={item.classList} key={item.key}>
          {[...item.childNodes].map((event) => (
            <div className={event.classList} key={event.key} style={getBGColor(event)} onClick={() => {event.onclick}}>
              {[...event.childNodes].map((firstevent) => (
                <h3>{firstevent.textContent}</h3>
              ))}
            </div>
          ))}
        </div>
      ))}
      {viewEvent}
      </div>
    </>
  );
};

export default Timeline;

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Timeline />
//   </StrictMode>,
// )
