import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../TraDriverBox.css';

function VehicleBox() {

    const navigate = useNavigate(); // Initialize the navigate function using useNavigate hook

  // Function to handle clicking on the "Driver Registry" button
  const handleVehicleRegistryClick = () => {
    // Navigate to the driver registry page
    navigate('/vregister'); 
  };

  // Function to handle clicking on the "Driver Details" button
  const handleVehicleDetailsClick = () => {
    // Navigate to the driver registers page
    navigate('/TraVehicleDetails'); 
  };

  return (
    <Layout>
      <div className="mybox">
        <div className="mybox1" onClick={handleVehicleRegistryClick}>
        <img className="images" src="/static/media/shuttle.3c55df9a0807cf05c4df.png"  />
          <span className='boxname'>Vehicle Register</span>
        </div>
        <div className="mybox1" onClick={handleVehicleDetailsClick}>
        <img className="images" src="/static/media/shuttle.3c55df9a0807cf05c4df.png"  />
          <span className='boxname'>Vehicle Details</span>
        </div>
        
      </div>
      </Layout>
  )
}

export default VehicleBox