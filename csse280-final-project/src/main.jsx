import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Calendar from './Calendar'
import NavBar from './NavBar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <App />
    <Calendar />

  </StrictMode>,
)
