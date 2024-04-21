import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import "../Insurance.css";

function InsuranceManager() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleManagerDisplayClick = () => {
    navigate('/InsuranceManagerDisplay'); 
    };

    const handleStatusClick = () => {
    navigate('/InsuranceStatus'); 
    };

  return (
      <Layout>
      <div className="insmybox">
        <div className="mybox1" onClick={handleManagerDisplayClick}>
          <span className='boxname'>Insurance Display</span>
        </div>
        <div className="mybox1" onClick={handleStatusClick}>
          <span className='boxname'>Insurance Details</span>
        </div>
        
      </div>
      </Layout>
  )
}

export default InsuranceManager
