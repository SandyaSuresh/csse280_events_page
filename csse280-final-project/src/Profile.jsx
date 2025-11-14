import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Timeline from './Timeline'
import './Profile.css'

async function getBookmarkedEvents(bookmarks) {
  // get events
  try {
    let options = {
      method: "GET",
    }
    if(localStorage["access_token"]){
      if(!options["headers"]){
        options["headers"] = {}
      }
      options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
    }
    let dateRange = "01-01-2000 12-31-2099";
    let response = await fetch(`/events/${dateRange}`, options);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    let events_json = await response.json();

    let bookmarkedEvents = {};
    // for (let key of Object.keys(events_json)) {
    //   // console.log(events[i]);
    //   // for (let tag of events[i]["tags"]) {
    //   //   if (!(tags.includes(tag))) {
    //   //     tags.push(tag);
    //   //   }
    //   // }
    //   // console.log("events_json[i]: " + events_json[i]);
    //   // console.log("Object.keys(events_json): " + Object.keys(events_json));
    //   // console.log("Object.values(events_json): " + Object.values(events_json));
    //   // console.log("Object.keys(events_json)[i]: " + Object.keys(events_json)[i]);
    //   // console.log("Object.values(events_json)[i]: " + Object.values(events_json)[i]);
    //   bookmarked
    // }
    for (let bookmark of bookmarks) {
      bookmarkedEvents[bookmark] = events_json[bookmark];
    }

    return bookmarkedEvents;
  } 
  catch (ex) {
    console.error(ex);
  }
}

async function updateCalendarandTimeline(date, json_func){
  //MAKE GET REQUEST FOR EVENTS
  try {
      // get user bookmarks
      let options ={
        method: "GET",
      }
      if(localStorage["access_token"]){
        if(!options["headers"]){
          options["headers"] = {}
        }
        options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
      }
      let response = await fetch("/bookmarks/" + date, options);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      let bookmarks_json = await response.json();

      let events_json = await getBookmarkedEvents(bookmarks_json);

      json_func(events_json);
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

async function getTags() {
  let tagOptions = Array.from(document.getElementById("edit-tags").children);
  let selected = '{"tags":[';
  tagOptions.forEach((tag) => {
    if (tag.selected) {
      selected += `"${tag.value}",`;
    }
  });
  selected = selected.slice(0, -1);
  selected += "]}";
  try {
    let options = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: selected
    }
    if(localStorage["access_token"]){
      if(!options["headers"]){
        options["headers"] = {}
      }
      options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
    }
    let response = await fetch("/tags", options)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (ex) {
    console.error(ex);
  }
}

function TagEditor() {
  return <>
  {/* <form action="/tags" method="PATCH" encType="application/x-www-form-urlencoded"> */}
    <section class="edit-tags-container">
      <label for="edit-tags">Edit Tags:</label>
      <select id="edit-tags" name="edit-tags" multiple> {/*HARD CODED, NEED A WAY TO GET ALL TAGS?*/}
        <option name="computer science" value="computer science">computer science</option>
        <option name="csse" value="csse">csse</option>
        <option name="learning" value="learning">learning</option>
        <option name="puzzles" value="puzzles">puzzles</option>
        <option name="thinking" value="thinking">thinking</option>
        <option name="problem solving" value="problem solving">problem solving</option>
        <option name="school wide" value="school wide">school wide</option>
        <option name="all majors" value="all majors">all majors</option>
        <option name="hackathon"value="hackathon">hackathon</option>
      </select>
    </section>
    <button onClick={getTags}>Update Tags</button>
  {/* </form> */}
  </>
}

function Profile(){
  let dateobj = new Date(); 
  let format_day = dateobj.getDate() < 10 ? "0" + dateobj.getDate() : dateobj.getDate()
  let format_month = (dateobj.getMonth()+1) < 10 ? "0" + (dateobj.getMonth()+1) : (dateobj.getMonth()+1) 

  const [date, setDate] = useState(format_month + "-" + format_day + "-" + dateobj.getFullYear())
  const [json, setJSON] = useState("")

  useEffect(() => {
    updateCalendarandTimeline(date, setJSON)
  }, [date]);

  let comp = (
  <>
  <Calendar date={date} setDay={(i) => setDay(i, date, setDate)} changeMonth={(i) => {changeMonth(i, date, setDate)}} />
  <Timeline json={json} date={date}></Timeline>
  <div class="clear"></div>
  <TagEditor></TagEditor>
  </>
  );




  return comp
}

export default Profile;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Profile />
  </StrictMode>,
)
