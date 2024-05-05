import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, Input, message } from 'antd';
import Layout from '../components/Layout';
import '../OrderHistory.css'; // Import the CSS file

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('/api/supplierDetails/supplierDetails');
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const handleUpdate = (record) => {
    console.log('Update clicked for record:', record);
  };

  const handleDelete = (record) => {
    console.log('Delete clicked for record:', record);
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    return formattedDate;
  };

  const handleSearch = () => {
    if (searchId.trim() === "") {
      message.warning("Please enter a valid ID"); // Validation to ensure a valid ID is entered
      return;
    }

    const foundOrder = orderHistory.find(order => order.orderId === searchId);
    if (!foundOrder) {
      message.info("No order found with that ID");
      return;
    }

    setOrderHistory([foundOrder]);
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    
    if (e.target.value.trim() === "") {
      fetchOrderHistory();
    }
  };

  const handleStatusButtonClick = () => {
    // Redirect to the UniformStatus page
    window.location.href = '/UniformSupplier'; 
  };

  const handleStatusButtonClick2 = () => {
    // Redirect to the UniformStatus page
    window.location.href = '/UniformSupplierInput'; 
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: 'Units',
      dataIndex: 'numberOfUnits',
      key: 'numberOfUnits',
      width: 120,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 200,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
      width: 120,
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Button className="order-history-action-buttons" type="primary" onClick={() => handleUpdate(record)}>Update</Button>
            <Button className="order-history-action-buttons" type="danger" onClick={() => handleDelete(record)}>Delete</Button>
          </Space>
        ),
      },
  ];

  return (
    <Layout>
      <div className="order-history-container">
        <h1>Order History</h1>
        <div className="order-history-search-container">
          <Input
            className="order-history-search-input" 
            value={searchId}
            onChange={handleSearchChange}
            placeholder="Search by Order ID"
          />
          <Button className="custom-search-button" onClick={handleSearch}>Search</Button> {/* Apply custom search button class */}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick2}>New Order</Button>
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick}>Suppliers</Button>
        </div>
        <div className="order-history-table-container">
          <Table dataSource={orderHistory} columns={columns} scroll={{ y: 400 }} /> {/* Apply vertical scroll */}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
