import { useEffect, useState} from 'react'
import './Timeline.css'

function generateDayBreakdown(json, date){
  if(date == undefined || json == ""){
    return [];
  }
  let container = [];
  let seen = [];
  //24 *4 = 96 elements
  let colors = getColorsForKeys(json)
  let date_parts = date.split("-")
  let dateStart = Date.parse(date_parts[2] + "-" + date_parts[0] + "-" + date_parts[1] + "T00:00:00.000")
  let fifteenMins = 900000;
  for(let i = 0; i < 96; i++){
    let time_div = document.createElement("div")
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
        let eventStart = Date.parse(json[key]["start"])
        let eventEnd= Date.parse(json[key]["end"])
        if(!((eventEnd < timeStart) || (eventStart > timeEnd))){

          let event_div = document.createElement("div");
          event_div.classList.add("eventspan");
          event_div.classList.add(`${key}`);

          if(!seen.includes(key)){
            event_div.classList.add("event-first-div");
            let eventName = document.createElement("p");
            eventName.textContent = json[key]["name"];
            eventName.classList.add("eventNameText");
            event_div.appendChild(eventName);   

            seen.push(key);
          }
          
          if(seen.includes(key) && eventEnd <= timeEnd + fifteenMins){
            event_div.classList.add("last-event-div");           
          }
          event_div.style = "background-color: " + colors[key]

          time_div.appendChild(event_div)
        }
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

function renderViewedEvent(eventId, eventsData, setViewedEventFunc) {
  let eventName, eventTags, eventStart, eventEnd, eventGroup = "";
  if (eventId == -1) {
    return <></>;
  } else {
    for (let id of Object.keys(eventsData)) {
      if (id == eventId) {
        let event = eventsData[id];
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
    return (
    <section id="event-info" className="">
      <button onClick={() => {setViewedEventFunc(-1); renderViewedEvent(-1, eventsData, setViewedEventFunc)}}>x</button>
      <strong>{eventName}</strong>
      <p>Time: {eventStart} to {eventEnd}</p>
      <p>Group: {eventGroup}</p>
      <p>Tags: {eventTags}</p>
    </section>
    )
  }
}

function Timeline({json, date}) {
  const [viewedEvent, setViewedEvent] = useState(-1);
  const [viewedEventBox, setViewedEventBox] = useState(<></>);

  useEffect(()=>{
    generateDayBreakdown(json, date)
  }, [json, date, setViewedEventBox]);

  let events=generateDayBreakdown(json, date, setViewedEvent);

  useEffect(() => {
    setViewedEventBox(renderViewedEvent(viewedEvent, json, setViewedEvent));
  }, [viewedEvent, json])

  return (
    <>
      <div id="container-div">{events.map((item) => (
        <div className={item.classList}>
          {[...item.childNodes].map((event) => (
            <div className={event.classList} style={getBGColor(event)} onClick={() => {
              event.onClick;
              for (let id of event.classList) {
                if (Object.keys(json).includes(id)) {
                  setViewedEvent(id);
                }
              }
            }}>
              {[...event.childNodes].map((eventFirst) => (
                <p>{eventFirst.textContent}</p>

              ))}
            </div>
          ))}
        </div>
      ))}
      {viewedEventBox}
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