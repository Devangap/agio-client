import React from 'react';
import Layout from '../components/Layout';
import apparel from '../Images/oneclick.png';
import runway from '../Images/runway.png'; // Import Runway logo
import '../supplierdetails.css';

const SupplierDetails = () => {
  const openWhatsApp = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const openGmail = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const openGoogleMaps = (address) => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
  };

  const openWebsite = (website) => {
    window.open(website, '_blank');
  };

  const handleStatusButtonClick = () => {
    // Redirect to the UniformStatus page
    window.location.href = '/UniformSupplierHistory'; 
  };

  return (
    <Layout>
      <h1>Uniform Suppliers</h1>
      <div className="container">
        <div className="supplier-form">
          <div className="supplier">
            <div className="header">
              <img className="apparellogo" src={apparel} alt="OneClick Apparel Logo" />
            </div>
            <div className="details">
              <p>Company Name: OneClick<button onClick={() => openWebsite('https://www.oneclickapparel.com')}>Open Website</button></p>
              <p>Phone Number: 0783610320 <button onClick={() => openWhatsApp('94783610320')}>Send Message</button></p>
              <p>Email: oneclickapparel@gmail.com <button onClick={() => openGmail('oneclickapparel@gmail.com')}>Send Email</button></p>
              <p>Address: 803/1, Negombo, Sri Lanka <button onClick={() => openGoogleMaps('803/1, Negombo, Sri Lanka')}>View in Map</button></p>
              
            </div>
          </div>
        </div>
        <div className="supplier-form">
          <div className="supplier">
            <div className="header">
              <img className="apparellogo" src={runway} alt="Runway Apparel Logo" />
            </div>
            <div className="details">
              <p>Company Name: Runway<button onClick={() => openWebsite('https://www.runwayapparel.com')}>Open Website</button></p>
              <p>Phone Number: 0778475697 <button onClick={() => openWhatsApp('94778475697')}>Send Message</button></p>
              <p>Email: runwayapparel@gmail.com <button onClick={() => openGmail('runwayapparel@gmail.com')}>Send Email</button></p>
              <p>Address: 34/2, Panadura, Sri Lanka <button onClick={() => openGoogleMaps('34/2, Panadura, Sri Lanka')}>View in Map</button></p>
              
            </div>
          </div>
        </div>
        
      </div>
      <p><button className="historybutton" onClick={handleStatusButtonClick}>Order History</button></p>
      
    </Layout>
  );
};

export default SupplierDetails;
