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

  return (
    <div>
      <h1>Uniform Totals</h1>
      <h2>Factory Worker Shirts</h2>
      <ul>
        {factoryWorkerShirtTotals.map((total, index) => (
          <li key={index}>{total._id}: {total.totalShirts}</li>
        ))}
      </ul>
      <h2>Factory Worker Skirts</h2>
      <ul>
        {factoryWorkerSkirtTotals.map((total, index) => (
          <li key={index}>{total._id}: {total.totalSkirts}</li>
        ))}
      </ul>
      <h2>Executive Shirts</h2>
      <ul>
        {executiveShirtTotals.map((total, index) => (
          <li key={index}>{total._id}: {total.totalShirts}</li>
        ))}
      </ul>
    </div>
  );
}

export default UniformTotals;
