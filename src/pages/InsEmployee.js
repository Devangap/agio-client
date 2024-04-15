import React, { useState, useEffect } from 'react';

function InsEmployee() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsuranceData();
  }, []);

  const fetchInsuranceData = async () => {
    try {
      const response = await fetch("/api/insurance/getInsurance");
      if (!response.ok) {
        console.log(error);
        throw new Error('Failed to fetch insurance data');
      }
      const data = await response.json();
      setInsuranceData(data.insuranceData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Insurance Employee page</h2>
      <ul>
        {insuranceData.map(insurance => (
          <li key={insurance._id}>
            <p>Name: {insurance.name}</p>
            <p>ID: {insurance.id}</p>
            <p>Phone Number: {insurance.phoneNumber}</p>
            {/* Add more fields here as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsEmployee;
