import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import '../UniformManagerView.css';


function UniformOrders() {
  const [uniformOrders, setUniformOrders] = useState([]);

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
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <div>
      <h1>Uniform Orders</h1>
      <Table dataSource={uniformOrders} columns={columns} />
    </div>
  );
}

export default UniformOrders;
