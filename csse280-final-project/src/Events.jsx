import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Timeline from './Timeline'
import './Events.css'



async function updateCalendarandTimeline(date, json_func){
  //MAKE GET REQUEST FOR EVENTS
  try {
      let options ={
        method: "GET",
      }
      if(localStorage["access_token"]){
        if(!options["headers"]){
          options["headers"] = {}
        }
        options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
      }
      let response = await fetch("/day/" + date, options)
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      let json = await response.json();
      // let json = {"users":{},"events":{"1":{"name":"hello world","group":"csse","start":"10/30/2025 17:55:30","end":"10/30/2025 19:00:30","tags":["computer science","csse","learning"]},"2":{"name":"puzzle","group":"problems","start":"10/22/2025 20:00:00","end":"11/17/2025 20:01:00","tags":["puzzles","thinking","problem solving"]},"3":{"name":"25th","group":"greatest floor","start":"12/25/2025 10:10:10","end":"12/26/2025 11:11:11","tags":["school wide","all majors","hackathon"]}}}
      json_func(JSON.stringify(json))
  }
  catch (ex) {
      console.error(ex);
  }
  //Prevent page reload
  return false;
}

function setDay(i, day, func){
  let parts = day.split("-"); 
  let format_day = i < 10 ? "0" + i : i;
  func(parts[0] + "-" + format_day + "-" + parts[2])
}

function changeMonth(diff, day, func) {
  let parts = day.split("-");
  let select = 1
  let monthIndex = parseInt(parts[0])
  let year = parseInt(parts[2])
  monthIndex += diff;

  if (monthIndex < 1) {

    monthIndex = 12;
    year--;
  } else if (monthIndex > 12) {
    monthIndex = 1;
    year++;
  }
   
  func(monthIndex + "-" + select + "-" + year)
}

function Events(){
  let dateobj = new Date(); 
  let format_day = dateobj.getDate() < 10 ? "0" + dateobj.getDate() : dateobj.getDate()
  let format_month = (dateobj.getMonth()+1) < 10 ? "0" + (dateobj.getMonth()+1) : (dateobj.getMonth()+1) 

  const [date, setDate] = useState(format_month + "-" + format_day + "-" + dateobj.getFullYear())
  const [json, setJSON] = useState("")

  let comp = (
  <>
  {/* <Calendar year={year} month={month} day={day} 
            changeYear={(i) => {setYear(i)}} changeMonth={(i) => {setMonth(i)}} changeDay={(i) => {setDay(i)}}></Calendar> */}
  <Calendar date={date} setDay={(i) => setDay(i, date, setDate)} changeMonth={(i) => {changeMonth(i, date, setDate)}} />
  <Timeline json={json}></Timeline>
  </>
  );

  useEffect(() => {
    updateCalendarandTimeline(date, setJSON)
  }, [date, setJSON]);

  return comp
}
export default Events;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Events />
  </StrictMode>,
)
