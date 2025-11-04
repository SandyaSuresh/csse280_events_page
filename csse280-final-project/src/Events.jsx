import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Timeline from './Timeline'
import './Events.css'



async function updateCalendarandTimeline(year, month, day){
  //MAKE GET REQUEST FOR EVENTS
  try {
      let format_day = day < 10 ? "0" + day : day
      let response = await fetch("/events/" + month + "-" + format_day + "-" + year)
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      let json = await response.json();
      // let calendar = document.getElementById("calendar");
      // calendar.json = json;
      let timeline = document.getElementById("timeline"); 
      if(timeline){ 
       timeline.json = json;
      }
  }
  catch (ex) {
      console.error(ex);
  }
  //Prevent page reload
  return false;
}

function Events(){
  let dateobj = new Date();

  const [year, setYear] = useState(1900+dateobj.getYear())
  const [month, setMonth] = useState(dateobj.getMonth())
  const [day, setDay] = useState(dateobj.getDate())
  


  let comp = (
  <>
  {/* <Calendar year={year} month={month} day={day} 
            changeYear={(i) => {setYear(i)}} changeMonth={(i) => {setMonth(i)}} changeDay={(i) => {setDay(i)}}></Calendar> */}
  <Calendar setDay={(i) => setDay(i)} />
  <Timeline id="timeline"></Timeline>
  </>
  );

  useEffect(() => {
    updateCalendarandTimeline(year, month, day)
  }, [year, month, day]);

  return comp
}
export default Events;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Events />
  </StrictMode>,
)
