import React from 'react';
import { Link } from 'react-router-dom';


function UniformOrderConfirmation({ orderDetails }) {
  return (
    <div className="uniform-order-confirmation-container">
      <h2>Order Placed Successfully!</h2>
      <div className="order-details">
        <h3>Order Details:</h3>
        <p>Employee Number: {orderDetails.employeeNumber}</p>
        <p>Position: {orderDetails.position}</p>
        <p>Standard T-shirt Size: {orderDetails.tshirtSize}</p>
        {orderDetails.waistSize && <p>Waist Size: {orderDetails.waistSize}</p>}
        <p>No. of Uniforms: {orderDetails.uniformCount}</p>
      </div>
      <Link to="/">Go back to homepage</Link>
    </div>
  );
}

export default UniformOrderConfirmation;
