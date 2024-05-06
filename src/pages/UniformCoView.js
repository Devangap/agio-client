import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Layout from '../components/Layout';

const UniformInventoryChart = () => {
  const [shirtData, setShirtData] = useState(null);
  const [skirtData, setSkirtData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shirtResponse = await axios.get('/api/UniformShirt');
        const skirtResponse = await axios.get('/api/UniformSkirt');
        const shirtChartData = prepareChartData(shirtResponse.data);
        const skirtChartData = prepareChartData(skirtResponse.data);
        setShirtData(shirtChartData);
        setSkirtData(skirtChartData);
      } catch (error) {
        console.error('Error fetching uniform inventory:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (shirtData) {
      renderChart('shirtChart', 'Shirt Inventory', shirtData);
    }
    if (skirtData) {
      renderChart('skirtChart', 'Skirt Inventory', skirtData);
    }
  }, [shirtData, skirtData]);

  const prepareChartData = (data) => {
    const labels = data.map(item => item.size || item.waistSize);
    const quantities = data.map(item => item.quantity);
    return { labels, quantities };
  };

  const renderChart = (chartId, label, data) => {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: label,
          data: data.quantities,
          backgroundColor: '#F7B05B', 
          borderColor: '#1F1300', 
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <Layout>
      <div style={{ height: '500px', overflowY: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2>Shirt Inventory</h2>
        <canvas id="shirtChart" style={{ width: '100%', height: '400px' }} />

        <h2>Skirt Inventory</h2>
        <canvas id="skirtChart" style={{ width: '100%', height: '400px' }} />
      </div>
    </Layout>
  );
};

export default UniformInventoryChart;
