import { useEffect, useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import Calendar from './Calendar'
import Timeline from './Timeline'
import './Profile.css'

function addAuthHeader(options) {
  if(localStorage["access_token"]){
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
}

async function updateCalendarandTimeline(date, json_func){
  //MAKE GET REQUEST FOR EVENTS
  try {
      // get user bookmarks
      let options ={
        method: "GET",
      }
      addAuthHeader(options);
      let response = await fetch("/bookmarks/" + date, options);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }
      let bookmarks_json = await response.json();
      console.log("bookmarks_json: " + bookmarks_json);

      let events_json = await bookmarks_json;
      console.log("events_json: " + events_json);

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

async function updateTags() {
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
    addAuthHeader(options);
    let response = await fetch("/tags", options)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (ex) {
    console.error(ex);
  }
}

async function getAllTags(setAllTagsFunc) {
  let options = {
    method: "GET",
  }
  addAuthHeader(options);
  let response = await fetch("/events/" + "01-01-2000 12-31-2099", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
  let json = await response.json();

  let tags = getTagsListFromEventList(json);

  setAllTagsFunc(tags);
}

function getTagsListFromEventList(events) {
  console.log("events: " + events);
  if (events == "") {
    return [];
  }
  let tags = [];
  let keys = Object.keys(events)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    console.log("key: " + key)
    for (let tag of events[key]["tags"]) {
      console.log("tags: " + tags);
      console.log("tag: " + tag);
      if (!(tags.includes(tag))) {
        tags.push(tag);
      }
    }
  }
  return tags;
}

function TagEditor(tags) {
  console.log(tags);
  console.log(Object.values(tags));
  console.log(Object.values(tags)[0]);
  let tagsList = Object.values(tags)[0];
  return <>
    <section class="edit-tags-container">
      <label for="edit-tags">Edit Tags:</label>
      <select id="edit-tags" name="edit-tags" multiple>
        {[...tagsList].map((tag) => (
          <option name={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </section>
    <button onClick={updateTags}>Update Tags</button>
  </>
}

function Profile(){
  let dateobj = new Date(); 
  let format_day = dateobj.getDate() < 10 ? "0" + dateobj.getDate() : dateobj.getDate()
  let format_month = (dateobj.getMonth()+1) < 10 ? "0" + (dateobj.getMonth()+1) : (dateobj.getMonth()+1) 

  const [date, setDate] = useState(format_month + "-" + format_day + "-" + dateobj.getFullYear());
  const [json, setJSON] = useState("");
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    updateCalendarandTimeline(date, setJSON)
  }, [date]);

  useEffect(() => {
    getAllTags(setAllTags);
  }, []);

  console.log(getTagsListFromEventList(json));
  let comp = (
  <>
  <Calendar date={date} setDay={(i) => setDay(i, date, setDate)} changeMonth={(i) => {changeMonth(i, date, setDate)}} />
  <Timeline json={json} date={date}></Timeline>
  <div class="clear"></div>
  <TagEditor tags={allTags}></TagEditor>
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