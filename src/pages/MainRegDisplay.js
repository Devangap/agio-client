import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import Layout from '../components/Layout';

function MainRegDisplay() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employee/employees');
      if (response.data.success) {
        setEmployees(response.data.data);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fname',
      key: 'fname',
    },
    {
      title: 'Employee ID',
      dataIndex: 'empid',
      key: 'empid',
    },
    {
      title: 'User Name',
      dataIndex: 'username_log',
      key: 'empiusername_logd',
    },
    {
      title: 'Password',
      dataIndex: 'password_log',
      key: 'password_log',
    },
    {
      title: 'Job Role',
      dataIndex: 'jobRole',
      key: 'jobRole',
    },
    {
      title: 'shift',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Joind',
      dataIndex: 'dateJoined',
      key: 'dateJoined',
    },
    {
      title: 'Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Birth',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    // Add more columns as needed
  ];

  return (
    <Layout>
    
    <div>
      <h2>Main Register Display</h2>
      <Table dataSource={employees} columns={columns} />
    </div>
    </Layout>
  );
}

export default MainRegDisplay;
