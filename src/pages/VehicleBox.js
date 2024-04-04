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
          <span className='boxname'>Vehicle Registry</span>
        </div>
        <div className="mybox1" onClick={handleVehicleDetailsClick}>
          <span className='boxname'>Vehicle Details</span>
        </div>
        
      </div>
      </Layout>
  )
}

export default VehicleBox