import React from 'react';
import AnnCal from '../pages/AnnCal'; // Ensure this path is correct
import Layout from '../components/Layout';
//import '../AnnCalc.css'; // Assuming this is the correct CSS file
import '../ACal.css'; // Ensure this CSS is correctly named and used

function AnnCalHead() {
  const [dt, setDate] = React.useState(new Date());

  function handlePrev() {
    setDate(new Date(dt.getFullYear(), dt.getMonth() - 1, 1));
  }

  function handleNext() {
    setDate(new Date(dt.getFullYear(), dt.getMonth() + 1, 1));
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const presentMonth = months[dt.getMonth()];
  const presentYear = dt.getFullYear();
  const presentDay = dt.getDate();
  const daysInMonth = new Date(presentYear, dt.getMonth() + 1, 0).getDate();

  const startingDay = new Date(presentYear, dt.getMonth(), 1).getDay();
  const endDay = new Date(presentYear, dt.getMonth() + 1, 0).getDay();

  let emptyCells = [];
  for (let j = 0; j < startingDay; j++) {
    emptyCells.push(j);
  }

  let cells = [];
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(i);
  }

  let endCells = [];
  for (let j = 1; j < 7 - endDay; j++) {
    endCells.push(j);
  }

  return (
    <Layout>
      <div id="container">
        <div id="header">
          <div id="monthDisplay">{presentMonth} {presentYear}</div>
          <div>
            <button id="backButton" onClick={handlePrev}>Back</button>
            <button id="nextButton" onClick={handleNext}>Next</button>
          </div>
        </div>

        <div id="weekdays" className='weekdays'>
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
        </div>
        <AnnCal cells={cells} emptyCells={emptyCells} endCells={endCells} month={dt.getMonth()} year={presentYear} presentDay={presentDay} />
      </div>
    </Layout>
  );
}

export default AnnCalHead;
