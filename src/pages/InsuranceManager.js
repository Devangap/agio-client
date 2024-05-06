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
        <div className="insmybox1" onClick={handleManagerDisplayClick}>
          <span className='insboxname'>Insurance Display</span>
        </div>
        <div className="insmybox1" onClick={handleStatusClick}>
          <span className='insboxname'>Insurance Overview</span>
        </div>
        
      </div>
      </Layout>
  )
}

export default InsuranceManager
