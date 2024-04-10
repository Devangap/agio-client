import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Button, Select, DatePicker, Modal } from 'antd';
import moment from 'moment'; // Import moment library
import '../UniformManagerView.css';

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

  useEffect(() => {
    const fetchUniformOrders = async () => {
      try {
        const response = await axios.get('/api/uniformOrder');
        setUniformOrders(response.data);
      } catch (error) {
        console.error('Error fetching uniform orders:', error);
      }
    };

    fetchUniformOrders();
  }, []);

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const handleFilterClick = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const filteredUniformOrders = uniformOrders.filter(order => {
    for (let key in filters) {
      if (key === 'position' && filters[key] === 'Any') {
        continue;
      }
      if (key === 'orderDate' && filters[key]) {
        // Apply date filter
        const orderDate = moment(order[key]).startOf('day'); // Normalize to start of day
        const selectedDate = moment(filters[key]).startOf('day');
        
        console.log('Order Date:', orderDate.format('YYYY-MM-DD'));
        console.log('Selected Date:', selectedDate.format('YYYY-MM-DD'));
        
        if (!orderDate.isSame(selectedDate, 'day')) { // Ensure date comparison is done at the day level
          return false;
        }
      } else if (filters[key] && filters[key] !== order[key]) {
        return false;
      }
    }
    return true;
  });
  

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
  ];

  return (
    <div>
      <h1>Uniform Orders</h1>
      <Button type="primary" onClick={handleFilterClick}>Filter</Button>
      <Modal
        title="Filter Uniform Orders"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Employee Number" onChange={(e) => handleFilterChange('employeeNumber', e.target.value)} />
        <Input placeholder="Waist Size" onChange={(e) => handleFilterChange('waistSize', e.target.value)} />
        <Select
          placeholder="Position"
          style={{ width: 120 }}
          onChange={(value) => handleFilterChange('position', value)}
          allowClear
        >
          <Option value="Factory Worker">Factory Worker</Option>
          <Option value="Executive">Executive</Option>
          <Option value="Any">Any</Option>
        </Select>
        <DatePicker
          placeholder="Order Date"
          onChange={(date, dateString) => handleFilterChange('orderDate', dateString ? moment(dateString) : null)} // Convert to moment object
        />
      </Modal>
      <Table dataSource={filteredUniformOrders} columns={columns} />
    </div>
  );
}

export default UniformOrders;
