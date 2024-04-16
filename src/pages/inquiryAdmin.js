import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const { TextArea } = Input;

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get('/api/employee/all-inquiries');
        setInquiries(response.data);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id) => {
    setConfirmVisible(true);
    setSelectedId(id);
  };

  const confirmStatusUpdate = async () => {
    try {
      const updatedInquiries = inquiries.map((inquiry) => {
        if (inquiry._id === selectedId) {
          // Change status to "Done"
          inquiry.status = 'Done';
        }
        return inquiry;
      });
      setInquiries(updatedInquiries);
      setConfirmVisible(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = async (id) => {
    // Open modal to write reply
    setVisible(true);
    // Find selected inquiry
    const selected = inquiries.find((inquiry) => inquiry._id === id);
    setSelectedInquiry(selected);
  };

  const onFinishReply = async (values) => {
    try {
      const response = await axios.post(`/api/inquiries/${selectedInquiry._id}/reply`, {
        reply: values.reply,
        username: selectedInquiry.username,
      });
      message.success('Reply sent successfully');
      setVisible(false);
      // Assuming you want to update the inquiries state with the updated data from the backend
      const updatedInquiries = inquiries.map((inquiry) => {
        if (inquiry._id === selectedInquiry._id) {
          inquiry.reply = values.reply; // Update the reply in the frontend state
          // You may update other fields as well if needed
        }
        return inquiry;
      });
      setInquiries(updatedInquiries); // Update the state with the updated inquiries data
    } catch (error) {
      console.error('Error sending reply:', error);
      console.error('Error response:', error.response); // Log detailed error response
      message.error('Failed to send reply');
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
          <Button type="primary" onClick={() => handleStatusUpdate(record._id)} danger={record.status === 'Done'}>
            {record.status === 'Pending' ? 'Pending' : 'Done'}
          </Button>
          <Button onClick={() => handleReply(record._id)}>Reply</Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div>
        <h1>All Inquiries</h1>
        <Table dataSource={inquiries} columns={columns} />

        <Modal
          title="Write Reply"
          visible={visible} 
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={onFinishReply} layout="vertical">
            <Form.Item label="Reply" name="reply" rules={[{ required: true, message: 'Please input your reply!' }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Send Reply
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Confirmation"
          visible={confirmVisible} 
          onCancel={() => setConfirmVisible(false)}
          onOk={confirmStatusUpdate}
        >
          <p>Are you sure you want to change the status to Done?</p>
        </Modal>
      </div>
    </Layout>
  );
}

export default AdminInquiries;
