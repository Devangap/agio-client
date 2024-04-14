import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const ShirtInventory = () => {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ShirtInventory, setShirtInventory] = useState([]);

  // Function to fetch shirt inventory data from the backend
  const fetchShirtInventory = async () => {
    try {
      const response = await fetch('/api/UniformShirt');
      const data = await response.json();
      setShirtInventory(data);
    } catch (error) {
      console.error('Error fetching shirt inventory:', error);
    }
  };

  useEffect(() => {
    fetchShirtInventory();
  }, []); // Fetch data on component mount

  // Columns configuration for the table
  const columns = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <div>
      <div className="shirt-inventory-container">
        <div className="shirt-inventory-form-container">
          <div className="shirt-inventory-form-box p-3">
            <h3 className="shirt-inventory-title">Shirt Inventory Management</h3>
            <Form layout="horizontal">
              {/* Form inputs */}
            </Form>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Shirt Inventory</h3>
        <Table dataSource={ShirtInventory} columns={columns} />
      </div>
    </div>
  );
};

export default ShirtInventory;
