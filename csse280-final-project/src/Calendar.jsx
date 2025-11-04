import {useEffect} from 'react'
import './Calendar.css'

function createDays(numDays, activeDay, weekdayOfFirst, func){
  let list = document.createElement("ul")
  list.className="days"
  for (let i = 1; i <= weekdayOfFirst; i++) {
    let list_item = document.createElement("li");
    list_item.innerHTML = ""; // creates blank nodes for empty days
    list.appendChild(list_item);
  }
  for(let i = 1; i <= numDays; i++){
    let list_item = document.createElement("li");
    list_item.id = i;
    if(i == activeDay){
      list_item.innerHTML = `<span class="active">${i}</span>`;
    }else{
      list_item.innerHTML = i;
    }
    list_item.onclick = () => {func(i); createDays(numDays, i, weekdayOfFirst, func);}
    list.appendChild(list_item);
  }
  if(document.getElementById("days-list")){
    document.getElementById("days-list").replaceChildren(list)
  }
}

function loadMonth(monthIndex, year, func) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let month = months[monthIndex];
  let weekdayOfFirst = new Date(year, monthIndex, 1).getDay();
  let numDays  = new Date(year, monthIndex + 1, 0).getDate();

  document.getElementById("current-month").innerHTML = `${month}<br></br>
            <span>${year}</span>`; // MAYBE JUST {month} IDK
  createDays(numDays, numDays/*should be active day, this is a placeholder*/, weekdayOfFirst, func);
          {/* <li>{month}<br></br>
            <span>2021</span>
          </li> */}

  //const [month, setMonth] = useState(monthString);
}

function Calendar({setDay}) {
  let dateobj = new Date();
  let monthIndex = dateobj.getMonth();
  let year = dateobj.getFullYear();

  // useEffect(() => {createDays(days, day, setDay)}, [day, days]); // replace with loadMonth?????????
  
  useEffect(() => {loadMonth(monthIndex, year, setDay)}, [monthIndex, year]);

  const changeMonth = (change) => {
    monthIndex += change;
    if (monthIndex < 0) {
      monthIndex = 11;
      year--;
    } else if (monthIndex > 11) {
      monthIndex = 0;
      year++;
    }
    loadMonth(monthIndex, year, setDay)
  }

  return (
    <>
      <div className="month">
        <ul>
          <li className="prev" onClick={() => {
            changeMonth(-1);
          }}>Prev</li>
          <li className="next" onClick={() => {
            changeMonth(1);
          }}>Next</li>
          <li id="current-month"><br></br>
            <span></span>
          </li>
        </ul>
      </div>

      <ul className="weekdays">
        <li>Su</li>
        <li>Mo</li>
        <li>Tu</li>
        <li>We</li>
        <li>Th</li>
        <li>Fr</li>
        <li>Sa</li>
      </ul>
      <div id="days-list">
        
      </div>
     </>
  );

};
export default Calendar;