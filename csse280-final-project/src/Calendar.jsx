import { useEffect, useState } from 'react'
import './Calendar.css'

function createDays(numDays, activeDay, func){
  let list = document.createElement("ul")
  list.className="days"
  for(let i = 1; i <= numDays; i++){
    let list_item = document.createElement("li");
    list_item.id = i;
    if(i == activeDay){
      list_item.innerHTML = `<span class="active">${i}</span>`;
    }else{
      list_item.innerHTML = i;
    }
    list_item.onclick = () => {func(i); createDays(numDays, i, func);}
    list.appendChild(list_item)
  }

  document.getElementById("days-list").replaceChildren(list)
}

function Calendar() {

  const [month, setMonth] = useState("")
  const [day, setDay] = useState(0)

  let dateobj = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let monthIndex = dateobj.getMonth();
  let year = dateobj.getYear();
  let monthString = months[monthIndex];
  let days  = new Date(year, monthIndex, 0).getDate();
  
  useEffect(() => {createDays(days, day, setDay)}, [day, days]);

  window.addEventListener("load", () => {
    setMonth(monthString);
    setDay(dateobj.getDate());
  })



  return (
    <>
       <div className="month">
        <ul>
          <li className="prev">Prev</li>
          <li className="next">Next</li>
          <li>{month}<br></br>
            <span>2021</span>
          </li>
        </ul>
      </div>

      <ul className="weekdays">
        <li>Mo</li>
        <li>Tu</li>
        <li>We</li>
        <li>Th</li>
        <li>Fr</li>
        <li>Sa</li>
        <li>Su</li>
      </ul>
      <div id="days-list">
        
      </div>
     </>
  );

};

export default Calendar;