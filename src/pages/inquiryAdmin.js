import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import '../inquiry.css';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { TextArea } = Input;

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    try {
      const updatedInquiries = inquiries.map((inquiry) => {
        if (inquiry._id === id) {
          inquiry.status = 'Done';
          axios
            .put(`/api/employee/inquiry/${id}/update-status`, {
              status: 'Done',
            })
            .then((response) => {
              setInquiries((prevInquiries) =>
                prevInquiries.map((prevInquiry) =>
                  prevInquiry._id === id
                    ? { ...prevInquiry, status: 'Done' }
                    : prevInquiry
                )
              );
              message.success('Status updated successfully');
            })
            .catch((error) => {
              console.error('Error updating status:', error);
            });
        }
        return inquiry;
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleReply = async (id) => {
    setVisible(true);
    const selected = inquiries.find((inquiry) => inquiry._id === id);
    setSelectedInquiry(selected);
  };

  const onFinishReply = async (values) => {
    try {
      const reply = values.reply;
      const updatedInquiries = inquiries.map((inquiry) => {
        if (inquiry._id === selectedInquiry._id) {
          inquiry.status = 'Done';
          inquiry.reply = reply;
          axios
            .put(`/api/employee/inquiry/${selectedInquiry._id}/reply`, {
              reply,
            })
            .then((response) => {
              setInquiries((prevInquiries) =>
                prevInquiries.map((prevInquiry) =>
                  prevInquiry._id === selectedInquiry._id
                    ? { ...prevInquiry, reply, status: 'Done' }
                    : prevInquiry
                )
              );
              message.success('Reply sent successfully');
            })
            .catch((error) => {
              console.error('Error sending reply:', error);
              message.error('Failed to send reply');
            });
        }
        return inquiry;
      });
      setInquiries(updatedInquiries);
      setVisible(false);
    } catch (error) {
      console.error('Error sending reply:', error);
      message.error('Failed to send reply');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquiryID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowMore = (text) => {
    Modal.info({
      title: 'Inquiry Details',
      content: (
        <div>
          <p>{text}</p>
        </div>
      ),
      onOk() {},
    });
  };
  const handleDownload = (record) => {
    // Create a new jsPDF instance with A4 dimensions
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  
    // Set padding
    const padding = 10;
    const usableWidth = doc.internal.pageSize.width - (padding * 2);
  
    // Format the content for the selected inquiry
    const content = `
  Inquiry ID: ${record.inquiryID}
  
  Full Name: ${record.name}
  
  Username: ${record.username}
  
  Inquiry Date: ${record.inquirydate}
  
  Phone Number: ${record.phoneNumber}
  
  Inquiry: ${record.describe}
  
  Reply: ${record.reply || 'No reply'}
  
  Status: ${record.status}
  `;
  
    // Calculate height of text
    const lines = doc.splitTextToSize(content, usableWidth);
    const textHeight = lines.length * 6; // Assuming font size is 12 and line height is 6
  
    // Calculate Y position to center text vertically
    const startY = (doc.internal.pageSize.height - textHeight) / 2;
  
    // Add content to the PDF
    doc.text(padding, startY, lines);
  
    // Save the PDF
    doc.save('inquiry_details.pdf');
  };

  const columns = [
    {
      title: 'Inquiry ID',
      dataIndex: 'inquiryID',
      key: 'inquiryID',
      width: 100,
    },
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: 'Inquiry Date',
      dataIndex: 'inquirydate',
      key: 'inquirydate',
      width: 100,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 100,
    },
    {
      title: 'Inquiry',
      dataIndex: 'describe',
      key: 'describe',
      className: 'i-inquiry-column',
      render: (text) => (
        <>
          {text.length > 10 ? (
            <span>
              {text.substr(0, 10)}...
              <Button type="link" className="i-show-more-button" onClick={() => handleShowMore(text)}>
                Show More
              </Button>
            </span>
          ) : (
            text
          )}
        </>
      ),
    },
    {
      title: 'Reply',
      dataIndex: 'reply',
      key: 'reply',
      width: 200,
      render: (text) => (
        <>
          {text && text.length > 10 ? (
            <span>
              {text.substr(0, 10)}...
              <Button type="link" className="i-show-more-button" onClick={() => handleShowMore(text)}>
                Show More
              </Button>
            </span>
          ) : (
            text
          )}
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleStatusUpdate(record._id)}
            danger={record.status === 'Done'}
          >
            {record.status === 'Pending' ? 'Pending' : 'Done'}
          </Button>
          <Button className="reply-button" onClick={() => handleReply(record._id)}>Reply</Button>
          <Button type="link" onClick={() => handleDownload(record)}>Download</Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="i-container">
        <h1 className="i-title">All Inquiries</h1>
        <Input
          className="i-search-input"
          placeholder="Search by username or inquiry ID"
          value={searchQuery}
          onChange={handleSearch}
        />
        <Table dataSource={filteredInquiries} columns={columns} scroll={{ x: true, y: 400 }} />

        <Modal
          title="Write Reply"
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          className="i-modal"
        >
          <Form form={form} onFinish={onFinishReply} layout="vertical" className="i-form">
            <Form.Item
              label="Reply"
              name="reply"
              rules={[
                { required: true, message: 'Please input your reply!' },
              ]}
            >
              <TextArea rows={4} className="i-reply-textarea" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="i-send-reply-button">
                Send Reply
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}

export default AdminInquiries;
