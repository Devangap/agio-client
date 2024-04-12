import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../TraDriverBox.css';

function TraBookingBox() {

    
    const navigate = useNavigate(); // Initialize the navigate function using useNavigate hook

  // Function to handle clicking on the "Driver Registry" button
  const handleBookingClick = () => {
    // Navigate to the driver registry page
    navigate('/TraBooking'); 
  };

  // Function to handle clicking on the "Driver Details" button
  const handleBookingDetailsClick = () => {
    // Navigate to the driver registers page
    navigate('/TraBookingDisplay'); 
  };

  return (
    <Layout>
      <div className="mybox">
        <div className="mybox1" onClick={handleBookingClick}>
          <span className='boxname'>Transport Booking</span>
        </div>
        <div className="mybox1" onClick={handleBookingDetailsClick}>
          <span className='boxname'>Booking Details</span>
        </div>
        
      </div>
      </Layout>
  )
}

export default TraBookingBox