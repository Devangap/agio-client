import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Button, Select, Modal, Form, message } from 'antd';
import moment from 'moment';
import { Document, Page, Text, PDFDownloadLink, Image, StyleSheet, View } from '@react-pdf/renderer';
import Layout from '../components/Layout';
import '../UniformManagerView.css'; 
import logoImage from '../Images/logo.png';

const { Option } = Select;

function UniformOrders() {
  const [uniformOrders, setUniformOrders] = useState([]);
  const [filters, setFilters] = useState({
    employeeNumber: null,
    waistSize: null,
    position: null,
    orderDate: null
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [waistSizeDisabled, setWaistSizeDisabled] = useState(false);
  const [searchId, setSearchId] = useState(""); 

  const fetchUniformOrders = async () => {
    try {
      const response = await axios.get('/api/uniformOrder');
      const ordersWithStatus = response.data.map(order => ({ ...order, status: 'Pending' }));
      setUniformOrders(ordersWithStatus);
    } catch (error) {
      console.error('Error fetching uniform orders:', error);
    }
  };

  useEffect(() => {
    fetchUniformOrders();
  }, []);

  const handleUpdate = (record) => {
    setUpdateRecord(record);
    if (record.position === "Executive") {
      setWaistSizeDisabled(true);
    } else {
      setWaistSizeDisabled(false);
    }
    setModalVisible(true);
  };
  const handleStatusButtonClick = () => {
    // Redirect to the UniformStatus page
    window.location.href = '/UniformManagerView'; 
  };

  const handleUpdateSubmit = async (values) => {
    try {
      await axios.put(`/api/uniformOrder/${updateRecord._id}`, values);
      message.success('Uniform order updated successfully');
      fetchUniformOrders();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating uniform order:', error);
      message.error('Failed to update uniform order');
    }
  };

  const handleStatusToggle = (record) => {
    const updatedOrders = uniformOrders.map(order => {
      if (order._id === record._id) {
        return { ...order, status: order.status === 'Pending' ? 'Delivered' : 'Pending' };
      }
      return order;
    });
    setUniformOrders(updatedOrders);
    message.success('Status updated successfully');
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/api/uniformOrder/${key}`);
      message.success('Uniform order deleted successfully');
      fetchUniformOrders();
    } catch (error) {
      console.error('Error deleting uniform order:', error);
      message.error('Failed to delete uniform order');
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSearch = () => {
    if (searchId.trim() === "") {
      message.warning("Please enter a valid ID"); //Validation to ensure a valid ID is entered
      return;
    }

    const foundOrder = uniformOrders.find(order => order.employeeNumber === searchId);
    if (!foundOrder) {
      message.info("No order found with that ID");
      return;
    }

    setUniformOrders([foundOrder]);
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    
    if (e.target.value.trim() === "") {
      fetchUniformOrders();
    }
  };
  
  const columns = [
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'T-shirt Size',
      dataIndex: 'tshirtSize',
      key: 'tshirtSize',
    },
    {
      title: 'Waist Size',
      dataIndex: 'waistSize',
      key: 'waistSize',
    },
    {
      title: 'Uniform Count',
      dataIndex: 'uniformCount',
      key: 'uniformCount',
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Button className="custom-search-button" onClick={() => handleStatusToggle(record)}>{status}</Button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="uniform-manager-view-container">
        <h1>Uniform Orders</h1>
        <div className="uniform-manager-view-search-container" style={{ marginBottom: '10px' }}>
          <Input
            className="uniform-manager-view-search-input"
            value={searchId}
            onChange={handleSearchChange}
            placeholder="Search by Employee Number"
          />
          <Button className="custom-search-button" type="primary" onClick={handleSearch}>Search</Button>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick}>Uniform Orders</Button>
        </div>
  
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <Table dataSource={uniformOrders} columns={columns} />
        </div>
      </div>
    </Layout>
  );
}

export default UniformOrders;
