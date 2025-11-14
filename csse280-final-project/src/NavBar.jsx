// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './NavBar.css'


function addAuthHeader(options) {
  if(localStorage["access_token"]){ // create function for this?
    if(!options["headers"]){
      options["headers"] = {}
    }
    options["headers"]["Authorization"] = "Bearer " + localStorage["access_token"]
  }
}

async function addNewEvent(){
  let event_name = document.getElementById("eventName")
  let group_name = document.getElementById("groupName")
  let start_time = document.getElementById("startTime")
  let end_time = document.getElementById("endTime")
  let tags = document.getElementById("tags")
  if (!(event_name && group_name && start_time && end_time && tags)){
    return false;
  }
  let body = JSON.stringify({
      "eventName": event_name.value,
      "groupName":group_name.value,
      "startTime":start_time.value,
      "endTime":end_time.value,
      "tags":tags.value
  })
  console.log(body)
  let options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  };
  addAuthHeader(options)
  let response = await fetch("/event", options);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }
}

function showDiv(){
  let e = document.getElementById("new-event-cont");
  // setSeeDiv(true)
  if(e){
    document.getElementById("new-event-cont").className="show"
  }
}

function hideDiv(){
  let e = document.getElementById("new-event-cont");
  // setSeeDiv(true)
  if(e){
    document.getElementById("new-event-cont").className="hide"
  }
}


function NavBar() {
  // const [seeDiv, setDiv] = useState(true)

  return (
    <>
     <nav className='navbar'>
      <ul>
        <li><a href="events.html">For You</a></li>
        <li><a href="explore.html">Explore</a></li>
        <li><a href="profile.html">Profile</a></li>
        <li onClick={showDiv}><a>Add Event</a></li>
      </ul>
     </nav>
     <div id="new-event-cont" className='hide'>
        <button onClick={hideDiv}>X</button>
        <label htmlFor='eventName'/>
        <input type="text" name='eventName' id ='eventName'/>
        <label htmlFor='groupName'/>
        <input type="text" name='groupName' id ='groupName'/>
        <label htmlFor='startTime'/>
        <input type='datetime-local' name='startTime' id='startTime'/>
        <label htmlFor='endTime'/>
        <input type='datetime-local' name='endTime' id='endTime'/>
        <label htmlFor='tags'/>
        <input type='text' name='tags' id='tags'/>
        <input type='submit' name='submit' id="submit" onClick={addNewEvent}/>
     </div>
     </>
  );
};

export default NavBar;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
  </StrictMode>,
)
