
import React, { useEffect, useState } from 'react';
    import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
    import format from 'date-fns/format';
    import parse from 'date-fns/parse';
    import startOfWeek from 'date-fns/startOfWeek';
    import getDay from 'date-fns/getDay';
    import enUS from 'date-fns/locale/en-US';
    import 'react-big-calendar/lib/css/react-big-calendar.css';
    import Layout from '../components/Layout';
    import { useNavigate } from 'react-router-dom';


function AnnCalendar() {
    const navigate = useNavigate();
    const locales = {
        'en-US': enUS,
      };
      
      const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
      });

      const handleAddNotice = () => {
        // Placeholder for whatever action you want to perform when adding a notice
        console.log("Add Notice Clicked!");
        // You could navigate to another route, open a modal, etc.
        navigate('/AnnCalendarForm');
    };
      
  
  return (
    <Layout>
       
        <div>
          
          <Calendar
            localizer={localizer}
            
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: 50, fontFamily: 'Patrick Hand' }}
           
          />
          
        </div>
        
                <button onClick={handleAddNotice} className="btn btn-primary" >
                    Add Notice
                </button>
        </Layout>

  )
}

export default AnnCalendar