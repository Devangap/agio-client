import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const { TextArea } = Input;

function MyInquiries() {
  const location = useLocation();
  const [inquiries, setInquiries] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const username = location.state ? location.state.username : null; // Get username from location state

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
    setVisible(true);
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
      setVisible(false);
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
          title="Update Inquiry"
          visible={visible}
          onCancel={() => setVisible(false)}
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
