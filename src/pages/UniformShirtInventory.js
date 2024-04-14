import React, { useState, useEffect } from 'react';
import Layout from './AnnLayout'; // Import the Layout component
import axios from 'axios';
import '../UniformInventory.css'; // Import CSS file for styling

const InventoryPage = () => {
  const [shirtInventory, setShirtInventory] = useState([]);
  const [skirtInventory, setSkirtInventory] = useState([]);

  // Fetch shirt inventory data
  useEffect(() => {
    const fetchShirtInventory = async () => {
      try {
        const response = await axios.get('/api/UniformShirt'); // Update with your actual backend route
        setShirtInventory(response.data);
      } catch (error) {
        console.error('Error fetching shirt inventory:', error);
      }
    };

    fetchShirtInventory();
  }, []);

  // Fetch skirt inventory data
  useEffect(() => {
    const fetchSkirtInventory = async () => {
      try {
        const response = await axios.get('/api/UniformSkirt'); // Update with your actual backend route
        setSkirtInventory(response.data);
      } catch (error) {
        console.error('Error fetching skirt inventory:', error);
      }
    };

    fetchSkirtInventory();
  }, []);

  // Update shirt inventory
  const handleShirtUpdate = async (id, quantity) => {
    try {
      // Send a request to update the shirt inventory with the new quantity
      const response = await axios.put(`/api/UniformShirt/${id}`, { quantity });
      if (response.status === 200) {
        // If the update is successful, update the local state with the new quantity
        setShirtInventory(prevState =>
          prevState.map(item => (item._id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error('Error updating shirt inventory:', error);
    }
  };

  // Update skirt inventory
  const handleSkirtUpdate = async (id, quantity) => {
    try {
      // Send a request to update the skirt inventory with the new quantity
      const response = await axios.put(`/api/UniformSkirt/${id}`, { quantity });
      if (response.status === 200) {
        // If the update is successful, update the local state with the new quantity
        setSkirtInventory(prevState =>
          prevState.map(item => (item._id === id ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error('Error updating skirt inventory:', error);
    }
  };

  return (
    <Layout> {/* Wrap the content with the Layout component */}
      <div className="inventory-container"> {/* Use a parent container to style both forms */}
        <form className="form-container">
          <h2>Shirt Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shirtInventory.map(shirt => (
                <tr key={shirt._id}>
                  <td>{shirt.size}</td>
                  <td>
                    <input
                      type="number"
                      value={shirt.quantity}
                      onChange={e => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          handleShirtUpdate(shirt._id, newQuantity);
                        }
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleShirtUpdate(shirt._id, shirt.quantity)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <form className="form-container">
          <h2>Skirt Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Waist Size</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {skirtInventory.map(skirt => (
                <tr key={skirt._id}>
                  <td>{skirt.waistSize}</td>
                  <td>
                    <input
                      type="number"
                      value={skirt.quantity}
                      onChange={e => {
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          handleSkirtUpdate(skirt._id, newQuantity);
                        }
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSkirtUpdate(skirt._id, skirt.quantity)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </Layout>
  );
};

export default InventoryPage;
