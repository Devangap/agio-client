import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Total Uniform Orders</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <FoamContainer title="Factory Worker T-Shirts">
            <ul>
              {sortByTShirtSize(factoryWorkerShirtTotals).map((total, index) => (
                <li key={index}>
                  {total._id}: {total.totalShirts}
                </li>
              ))}
            </ul>
          </FoamContainer>
        </div>
        <div style={{ flex: 1 }}>
          <FoamContainer title="Factory Worker Skirts">
            <ul>
              {sortByWaistSize(factoryWorkerSkirtTotals).map((total, index) => (
                <li key={index}>
                  {total._id}: {total.totalSkirts}
                </li>
              ))}
            </ul>
          </FoamContainer>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          <FoamContainer title="Executive Shirts">
            <ul>
              {sortByTShirtSize(executiveShirtTotals).map((total, index) => (
                <li key={index}>
                  {total._id}: {total.totalShirts}
                </li>
              ))}
            </ul>
          </FoamContainer>
        </div>
      </div>
    </div>
  );
}

const FoamContainer = ({ title, children }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
    <h2 style={{ textAlign: 'center' }}>{title}</h2>
    {children}
  </div>
);

export default UniformTotals;
