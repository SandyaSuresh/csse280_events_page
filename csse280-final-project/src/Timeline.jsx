import { useEffect} from 'react'
import './Timeline.css'

function generateDayBreakdown(json, date){
  let container = [];
  //24 *4 = 96 elements
  console.log(json)
  console.log(Object.keys(json))
  let date_parts = date.split("-")
  let dateStart = Date.parse(date_parts[2] + "-" + date_parts[0] + "-" + date_parts[1] + "T00:00:00.000")
  let fifteenMins = 900000;
  for(let i = 0; i < 96; i++){
    let time_div = document.createElement("div")
    time_div.key = i;
    time_div.className = "timespan"
    let timeStart = dateStart + i * (fifteenMins)
    let timeEnd = dateStart + (i + 1) * fifteenMins

    if(json != undefined){
      Object.keys(json).forEach(key => {
        // console.log(key);
        let eventStart = Date.parse(json[key]["start"])
        let eventEnd= Date.parse(json[key]["end"])
        if(!((eventEnd < timeStart) || (eventStart > timeEnd))){
          // console.log(timeStart.toString() + "   " + timeEnd.toString())
          let event_div = document.createElement("div")
          event_div.className = "eventspan"
          event_div.key = key + i +  json[key]["name"];
          // event_div.style.backgroundColor = "rgb(i*15, i*15, i*15)"
          time_div.appendChild(event_div)
        }});
      }
    container.push(time_div)
  }  
  return container;
}


function Timeline({json, date}) {
  // let json = {"users":{},"events":{"1":{"name":"hello world","group":"csse","start":"10/30/2025 17:55:30","end":"10/30/2025 19:00:30","tags":["computer science","csse","learning"]},"2":{"name":"puzzle","group":"problems","start":"10/22/2025 20:00:00","end":"11/17/2025 20:01:00","tags":["puzzles","thinking","problem solving"]},"3":{"name":"25th","group":"greatest floor","start":"12/25/2025 10:10:10","end":"12/26/2025 11:11:11","tags":["school wide","all majors","hackathon"]}}}
  // let date = "10-30-2025"
  
  // console.log(JSON.stringify(json) + "  " + date)
  useEffect(()=>{
    generateDayBreakdown(json, date)
  }, [json, date])
  console.log(json)
  let events=generateDayBreakdown(json, date);
  // console.log(events)
  return (
    <>
      <div id="container-div">{events.map((item) => (
        <div className={item.classList} key={item.key}>
          {[...item.childNodes].map((event) => (
            <div className={event.classList} key={event.key}>
              
            </div>
          ))}
        </div>
      ))}</div>
    </>
  );
};

export default Timeline;

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Timeline />
//   </StrictMode>,
// )
