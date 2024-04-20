import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const { TextArea } = Input;

// Existing imports...

function MyInquiries() {
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [fullInquiry, setFullInquiry] = useState('');
  const [fullReply, setFullReply] = useState(''); // New state for full reply
  const username = location.state ? location.state.username : null;

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`/api/employee/my-inquiries/${username}`);
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    if (username) {
      fetchInquiries();
    }
  }, [username]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employee/deleteinquiry/${id}`);
      setInquiries(prev => prev.filter(item => item._id !== id));
      message.success('Inquiry deleted successfully');
    } catch (error) {
      message.error('Failed to delete inquiry');
    }
  };

  const handleUpdate = (record) => {
    setSelectedInquiry(record);
    form.setFieldsValue({
      name: record.name,
      username: record.username,
      inquirydate: record.inquirydate,
      phoneNumber: record.phoneNumber,
      describe: record.describe,
    });
    setUpdateModalVisible(true);
  };

  const handleShowMore = (text) => {
    setFullInquiry(text);
    setDetailModalVisible(true);
  };

  const handleShowReplyMore = (reply) => {
    setFullReply(reply);
    setDetailModalVisible(true);
  };

  const onFinish = async (values) => {
    try {
      const updatedInquiry = { ...selectedInquiry, ...values };
      await axios.put(`/api/employee/updateinquiry/${selectedInquiry._id}`, updatedInquiry);
      const updatedInquiries = inquiries.map(item =>
        item._id === selectedInquiry._id ? updatedInquiry : item
      );
      setInquiries(updatedInquiries);
      message.success('Inquiry updated successfully');
      setUpdateModalVisible(false);
    } catch (error) {
      message.error('Failed to update inquiry');
    }
  };

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
      render: (text) => (
        <>
          {text.length > 10 ? `${text.slice(0, 10)}...` : text}
          {text.length > 10 && (
            <Button type="link" onClick={() => handleShowMore(text)}>
              See More
            </Button>
          )}
        </>
      ),
    },
    {
      title: 'Reply',
      dataIndex: 'reply',
      key: 'reply',
      render: (text) => (
        <>
          {text && text.length > 10 ? `${text.slice(0, 10)}...` : text}
          {text && text.length > 10 && (
            <Button type="link" onClick={() => handleShowReplyMore(text)}>
              See More
            </Button>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" className="update" onClick={() => handleUpdate(record)}>Update</Button>
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div>
        <h1>My Inquiries</h1>
        <Table dataSource={inquiries} columns={columns} />

        <Modal
          title="Inquiry Details"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
        >
          <p>{fullInquiry}</p>
          <p>{fullReply}</p>
        </Modal>

        <Modal
          title="Update Inquiry"
          visible={updateModalVisible}
          onCancel={() => setUpdateModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Full Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Username" name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Inquiry Date" name="inquirydate">
              <Input />
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input />
            </Form.Item>
            <Form.Item label="Inquiry" name="describe">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}

export default MyInquiries;
