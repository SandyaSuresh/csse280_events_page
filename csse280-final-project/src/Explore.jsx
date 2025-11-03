import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import NavBar from './NavBar'
import './Explore.css'

function Explore() {
  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} classNameName="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} classNameName="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div classNameName="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p classNameName="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
  <div className="top">
    <h1>Explore Page</h1> 
    <input type="text" placeholder="search"></input>
  </div>
  <h2>Popular Today!</h2>
  <div className="container">
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
  </div>
  <h2>Sporting Events</h2>
  <div className="container">
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
  </div>
  <h2>Multi-Day</h2>
  <div className="container">
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
  </div>
  <h2>General Meetings</h2>
  <div className="container">
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
    <div className="box"></div>
  </div>
    </>
  )
}
export default Explore;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <Explore />
  </StrictMode>,
)
