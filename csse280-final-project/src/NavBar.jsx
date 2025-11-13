import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './NavBar.css'

function showPopup(func){
  func(        
    <form method="POST" action="/event">
        <label htmlFor='eventName'/>
        <input type="text" id ='eventName'/>
        <label htmlFor='groupName'/>
        <input type="text" id ='groupName'/>
        <label htmlFor='startTime'/>
        <input type='time' id='startTime'/>
        <label htmlFor='endTime'/>
        <input type='time' id='endTime'/>
        <label htmlFor='tags'/>
        <input type='text' id='tags'/>
    </form>
  )

}

function NavBar() {
  const [div, setDiv] = useState(<> </>)

  useEffect(() =>{
    showPopup(setDiv)
  }, [])

  return (
    <>
     <nav className='navbar'>
      <ul>
        <li><a href="events.html">For You</a></li>
        <li><a href="explore.html">Explore</a></li>
        <li><a href="profile.html">Profile</a></li>
        <li>Add Event</li>
      </ul>
     </nav>
     <div id="new-event-cont" className='hide'>{div}</div>
     </>
  );
};

export default NavBar;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
  </StrictMode>,
)
