// UniformTotals.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../UniformTotals.css';
import shirtImage from '../Images/shirt.png';
import shirtImage2 from '../Images/shirt3.png'
import skirtImage from '../Images/skirt3.png';
import Layout from '../components/Layout';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument'; // Import the PDFDocument component

function UniformTotals() {
  const [factoryWorkerShirtTotals, setFactoryWorkerShirtTotals] = useState([]);
  const [factoryWorkerSkirtTotals, setFactoryWorkerSkirtTotals] = useState([]);
  const [executiveShirtTotals, setExecutiveShirtTotals] = useState([]);

  useEffect(() => {
    fetchUniformTotals();
  }, []);

  const fetchUniformTotals = async () => {
    try {
      const response = await axios.get('/api/UniformTotals/totals');
      setFactoryWorkerShirtTotals(response.data.factoryWorkerShirtTotals);
      setFactoryWorkerSkirtTotals(response.data.factoryWorkerSkirtTotals);
      setExecutiveShirtTotals(response.data.executiveShirtTotals);
    } catch (error) {
      console.error('Error fetching uniform totals:', error);
    }
  };

  const sortByTShirtSize = (data) => {
    return data.sort((a, b) => {
      const sizesOrder = ['Small', 'Medium', 'Large', 'XL'];
      return sizesOrder.indexOf(a._id) - sizesOrder.indexOf(b._id);
    });
  };

  const sortByWaistSize = (data) => {
    return data.sort((a, b) => parseInt(a._id) - parseInt(b._id));
  };

  return (
    <Layout>
      <div>
        <h1>Total Uniform Orders</h1>
        <div className="scroll-container">
          <div className="form">
            <FoamContainer title="Executive T-Shirts" imageSrc={shirtImage2}>
              <ul>
                {sortByTShirtSize(executiveShirtTotals).map((total, index) => (
                  <li key={index}>
                    {total._id}: {total.totalShirts}
                  </li>
                ))}
              </ul>
            </FoamContainer>
          </div>

          <div className="form">
            <FoamContainer title="Factory Worker T-Shirts" imageSrc={shirtImage}>
              <ul>
                {sortByTShirtSize(factoryWorkerShirtTotals).map((total, index) => (
                  <li key={index}>
                    {total._id}: {total.totalShirts}
                  </li>
                ))}
              </ul>
            </FoamContainer>
          </div>

          <div className="form">
            <FoamContainer title="Factory Worker Skirts" imageSrc={skirtImage}>
              <div>
                <ul>
                  {sortByWaistSize(factoryWorkerSkirtTotals).map((total, index) => (
                    <li key={index}>
                      {total._id}: {total.totalSkirts}
                    </li>
                  ))}
                </ul>
              </div>
            </FoamContainer>

            
          </div>
        </div>
      </div>
      <div className="buttons-container">
                  <button className="history-button">View History</button>
                  <PDFDownloadLink
    document={<PDFDocument executiveShirtTotals={executiveShirtTotals} factoryWorkerShirtTotals={factoryWorkerShirtTotals} factoryWorkerSkirtTotals={factoryWorkerSkirtTotals} />}
    fileName="uniform_report.pdf"
  >
    {({ blob, url, loading, error }) => (
      <button className="report-button">
        {loading ? 'Generating Report...' : 'Download Report'}
      </button>
    )}
  </PDFDownloadLink>
      </div>
    </Layout>
  );
}

const FoamContainer = ({ title, children, imageSrc }) => (
  <div className="container">
    <div className="form-container">
      <h2 className="title">{title}</h2>
      <div className="image-container">
        <img className="image" src={imageSrc} alt={`${title} Mockup`} />
      </div>
      {children}
    </div>
  </div>
);

export default UniformTotals;
