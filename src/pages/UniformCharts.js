/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const InventoryPage = () => {
  const [shirtInventory, setShirtInventory] = useState([]);
  const [skirtInventory, setSkirtInventory] = useState([]);

  useEffect(() => {
    const fetchShirtInventory = async () => {
      try {
        const response = await axios.get('/api/uniformShirt');
        setShirtInventory(response.data);
      } catch (error) {
        console.error('Error fetching shirt inventory:', error);
      }
    };

    const fetchSkirtInventory = async () => {
      try {
        const response = await axios.get('/api/uniformSkirt');
        setSkirtInventory(response.data);
      } catch (error) {
        console.error('Error fetching skirt inventory:', error);
      }
    };

    fetchShirtInventory();
    fetchSkirtInventory();
  }, []);

  // Process inventory data for Chart.js
  const getInventoryChartData = (inventory) => {
    const labels = inventory.map(item => item.size || item.waistSize).map(String);
    const data = inventory.map(item => item.quantity);
  
    return {
      labels,
      datasets: [{
        label: 'Quantity',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    };
  };
  

  return (
    <div>
      <h2>Shirt Inventory</h2>
      <Bar
        data={getInventoryChartData(shirtInventory)}
        options={{
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        }}
      />

      <h2>Skirt Inventory</h2>
      <Bar
        data={getInventoryChartData(skirtInventory)}
        options={{
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              },
            }],
          },
        }}
      />
    </div>
  );
};

export default InventoryPage;*/
