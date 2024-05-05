import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import '../uniforminput.css';
import oneclicklogo from '../Images/oneclick.png';
import runwaylogo from '../Images/runway.png';
import mergelogo from '../Images/mergelogo.png';

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    orderId: '',
    type: '',
    numberOfUnits: '',
    cost: '',
    date: new Date()
  });

  const handleSupplierChange = e => {
    const supplierName = e.target.value;
    const type = supplierName === 'Oneclick' ? 'Shirt' : 'Skirt';
    setFormData({ ...formData, supplierName, type });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = date => {
    setFormData({ ...formData, date });
  };

  const calculateCost = () => {
    const unitPrice = formData.type === 'Shirt' ? 1250 : 1500;
    const numberOfUnits = parseInt(formData.numberOfUnits);
    return unitPrice * numberOfUnits;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const cost = calculateCost();
      const res = await axios.post('/api/supplierDetails/supplierDetails', { ...formData, cost });
      console.log(res.data); // Handle response as needed
      // Show confirmation toast message
      toast.success('Supplier detail submitted successfully!', {
        position: "top-center", // Adjusted position to top-center
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error.response.data); // Handle error response
      // Show error message
      toast.error('Error submitting supplier detail. Please try again.');
    }
  };

  // Define the image source based on the selected company
  let companyLogo = mergelogo;
  if (formData.supplierName === 'Oneclick') {
    companyLogo = oneclicklogo;
  } else if (formData.supplierName === 'Runway') {
    companyLogo = runwaylogo;
  }

  return (
    <Layout>
      <ToastContainer position="top-center" /> {/* Include ToastContainer component and set position to top-center */}
      <h1>Supplier Details Form</h1>
      <div className="supplier-form-container">
        <form onSubmit={handleSubmit} className="supplier-form">
          <div className="form-group">
            <label htmlFor="supplierName">Supplier Name:</label>
            <select name="supplierName" id="supplierName" onChange={handleSupplierChange} value={formData.supplierName}>
              <option value="">Select Supplier Name</option>
              <option value="Oneclick">Oneclick</option>
              <option value="Runway">Runway</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="orderId">Order ID:</label>
            <input type="text" id="orderId" name="orderId" value={formData.orderId} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="numberOfUnits">Number of Units:</label>
            <input type="number" id="numberOfUnits" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Cost:</label>
            <input type="number" id="cost" name="cost" value={calculateCost()} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <DatePicker id="date" selected={formData.date} onChange={handleDateChange} />
          </div>
          {/* Conditionally render the image based on selected company */}
          {(formData.supplierName || formData.supplierName === '') && <img src={companyLogo} alt="Company Logo" className="company-logo" />}
          <button type="submit" className="supplier-submit-button">Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default SupplierForm;
