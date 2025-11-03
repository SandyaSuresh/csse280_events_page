// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './NavBar.css'

function NavBar() {
  // const [count, setCount] = useState(0)
  return (
    <>
     <nav className='navbar'>
      <ul>
        <li><a href="events.html">For You</a></li>
        <li><a href="explore.html">Explore</a></li>
        <li><a href = "">Profile</a></li>
      </ul>
     </nav>
     </>
  );
};

export default NavBar;
