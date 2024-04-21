import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../TraDriverBox.css';

function TraDriverBox() {
  const navigate = useNavigate(); // Initialize the navigate function using useNavigate hook

  // Function to handle clicking on the "Driver Registry" button
  const handleDriverRegistryClick = () => {
    // Navigate to the driver registry page
    navigate('/dregister'); 
  };

  // Function to handle clicking on the "Driver Details" button
  const handleDriverDetailsClick = () => {
    // Navigate to the driver registers page
    navigate('/TraDriverDetailsDisplay'); 
  };

  return (
    <Layout>
      <div className="mybox">
        <div className="mybox1" onClick={handleDriverRegistryClick}>
        <img className="images" src="/static/media/shuttle.3c55df9a0807cf05c4df.png"  />
          <span className='boxname'>Driver Register</span>
        </div>
        <div className="mybox1" onClick={handleDriverDetailsClick}>
        <img className="images" src="/static/media/shuttle.3c55df9a0807cf05c4df.png"  />
          <span className='boxname'>Drivers Details</span>
        </div>
        
      </div>
      </Layout>
  );
}

export default TraDriverBox;