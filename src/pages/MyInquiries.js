import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import { useLocation } from 'react-router-dom';

function MyInquiries() {
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`/api/inquiry/my-inquiries`);
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    if (location.state && location.state.username) {
      fetchInquiries();
    }
  }, [location.state]);

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Inquiry Date',
      dataIndex: 'inquirydate',
      key: 'inquirydate',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Inquiry',
      dataIndex: 'describe',
      key: 'describe',
    },
  ];

  return (
    <div>
      <h1>My Inquiries</h1>
      <Table dataSource={inquiries} columns={columns} />
    </div>
  );
}

export default MyInquiries;
