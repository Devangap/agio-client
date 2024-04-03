import React from 'react';
import { Link } from 'react-router-dom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import '../UniformOrderConfirmation.css';

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
      <Link to="/modify-order" className="modify-order-button">Modify Order</Link>
      <div className="countdown-timer">
        <CountdownCircleTimer
          isPlaying
          duration={600}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [<Link to="/modify-order" key="modify">Modify Order</Link>]}
        />
      </div>
    </div>
  );
}

export default UniformOrderConfirmation;
