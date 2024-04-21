import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import '../UniformInventory.css'; // Import CSS file for styling
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import { PDFDownloadLink } from '@react-pdf/renderer'; // Import PDFDownloadLink component
import InventoryPDFDocument from './InventoryPDFDocument'; // Import the InventoryPDFDocument component

 const InventoryPage = () => {
//   const [shirtInventory, setShirtInventory] = useState([]);
//   const [skirtInventory, setSkirtInventory] = useState([]);

//   // Fetch shirt inventory data
//   useEffect(() => {
//     const fetchShirtInventory = async () => {
//       try {
//         const response = await axios.get('/api/UniformShirt'); // Update with your actual backend route
//         setShirtInventory(response.data);
//       } catch (error) {
//         console.error('Error fetching shirt inventory:', error);
//       }
//     };

//     fetchShirtInventory();
//   }, []);

//   // Fetch skirt inventory data
//   useEffect(() => {
//     const fetchSkirtInventory = async () => {
//       try {
//         const response = await axios.get('/api/UniformSkirt'); // Update with your actual backend route
//         setSkirtInventory(response.data);
//       } catch (error) {
//         console.error('Error fetching skirt inventory:', error);
//       }
//     };

//     fetchSkirtInventory();
//   }, []);

//   // Update shirt inventory
//   const handleShirtUpdate = async (id, quantity) => {
//     try {
//       // Send a request to update the shirt inventory with the new quantity
//       const response = await axios.put(`/api/UniformShirt/${id}`, { quantity });
//       if (response.status === 200) {
//         // If the update is successful, update the local state with the new quantity
//         setShirtInventory(prevState =>
//           prevState.map(item => (item._id === id ? { ...item, quantity } : item))
//         );
//         // Show toast message for successful update
//         toast.success('T-Shirt inventory modified successfully!');
//       }
//     } catch (error) {
//       console.error('Error updating shirt inventory:', error);
//       // Show toast message for error
//       toast.error('Failed to modify shirt inventory.');
//     }
//   };

//   // Update skirt inventory
//   const handleSkirtUpdate = async (id, quantity) => {
//     try {
//       // Send a request to update the skirt inventory with the new quantity
//       const response = await axios.put(`/api/UniformSkirt/${id}`, { quantity });
//       if (response.status === 200) {
//         // If the update is successful, update the local state with the new quantity
//         setSkirtInventory(prevState =>
//           prevState.map(item => (item._id === id ? { ...item, quantity } : item))
//         );
//         // Show toast message for successful update
//         toast.success('Skirt inventory modified successfully!');
//       }
//     } catch (error) {
//       console.error('Error updating skirt inventory:', error);
//       // Show toast message for error
//       toast.error('Failed to modify skirt inventory.');
//     }
//   };

  // Function to handle downloading inventory report
  const handleDownloadReport = () => {
    // Your code to download the inventory report
    // For now, let's just log the button click event
    console.log('Downloading report...');
  };

  return (
    <div className="inventory-page"> 
    
    <Layout> {/* Wrap the content with the Layout component */}
    <h1>Uniform Inventory</h1>
      <div className="inventory-container"> {/* Use a parent container to style both forms */}
        <form className="form-container">
          <h2>T-Shirt Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Total Quantity Available</th>
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
                        // Handle quantity change
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          setShirtInventory(prevState =>
                            prevState.map(item => (item._id === shirt._id ? { ...item, quantity: newQuantity } : item))
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleShirtUpdate(shirt._id, shirt.quantity)}>Update</button>
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
                <th>Total Quantity Available</th>
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
                        // Handle quantity change
                        const newQuantity = parseInt(e.target.value);
                        if (!isNaN(newQuantity)) {
                          setSkirtInventory(prevState =>
                            prevState.map(item => (item._id === skirt._id ? { ...item, quantity: newQuantity } : item))
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => handleSkirtUpdate(skirt._id, skirt.quantity)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
      <div className="buttons-container">
        <button >View Graphically</button>
        {/* PDF Download Link to download the inventory report */}
        <PDFDownloadLink
          document={<InventoryPDFDocument shirtInventory={shirtInventory} skirtInventory={skirtInventory} />}
          fileName="inventory_report.pdf"
        >
          {({ blob, url, loading, error }) => (
            <button className="report-button" onClick={handleDownloadReport}>
              {loading ? 'Generating Report...' : 'Download Report'}
            </button>
          )}
        </PDFDownloadLink>
      </div>
      <ToastContainer /> {/* Render the ToastContainer to show toast messages */}
      
    </Layout>
    </div>
  );
};

// export default InventoryPage;