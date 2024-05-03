// UniformOrdersChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Layout from '../components/Layout';

const UniformOrdersChart = () => {
  const [executiveData, setExecutiveData] = useState(null);
  const [factoryWorkerShirtData, setFactoryWorkerShirtData] = useState(null);
  const [factoryWorkerSkirtData, setFactoryWorkerSkirtData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/UniformTotals/totals');
        const executiveShirtData = prepareChartData(response.data.executiveShirtTotals);
        const factoryWorkerShirtData = prepareChartData(response.data.factoryWorkerShirtTotals);
        const factoryWorkerSkirtData = prepareChartData(response.data.factoryWorkerSkirtTotals);
        setExecutiveData(executiveShirtData);
        setFactoryWorkerShirtData(factoryWorkerShirtData);
        setFactoryWorkerSkirtData(factoryWorkerSkirtData);
      } catch (error) {
        console.error('Error fetching uniform totals:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (executiveData) {
      renderChart('executiveChart', 'Executive T-shirts', executiveData);
    }
    if (factoryWorkerShirtData) {
      renderChart('factoryWorkerShirtChart', 'Factory Worker T-shirts', factoryWorkerShirtData);
    }
    if (factoryWorkerSkirtData) {
      renderChart('factoryWorkerSkirtChart', 'Factory Worker Skirts', factoryWorkerSkirtData);
    }
  }, [executiveData, factoryWorkerShirtData, factoryWorkerSkirtData]);

  const prepareChartData = (data) => {
    const labels = data.map(item => item._id);
    const counts = data.map(item => item.totalShirts || item.totalSkirts);
    return { labels, counts };
  };

  const renderChart = (chartId, label, data) => {
    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: label,
          data: data.counts,
          backgroundColor: '#F7B05B', // Brand background color
          borderColor: '#1F1300', // Brand border color
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
        <h2>Executive T-shirts</h2>
        <canvas id="executiveChart" style={{ width: '100%', height: '400px' }} />

        <h2>Factory Worker T-shirts</h2>
        <canvas id="factoryWorkerShirtChart" style={{ width: '100%', height: '400px' }} />

        <h2>Factory Worker Skirts</h2>
        <canvas id="factoryWorkerSkirtChart" style={{ width: '100%', height: '400px' }} />
      </div>
    </Layout>
  );
};

export default UniformOrdersChart;
