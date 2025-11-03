// import { useState } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import Calendar from './Calendar'

function Events() {
  ( <>
    
    </>
  );

};

export default Events;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Calendar />
  </StrictMode>,
)
