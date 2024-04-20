import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Tradisplay.css'
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function TraDriverDetailsDisplay() {
  const navigate = useNavigate();

  const [Dregister, setDregister] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDregister, setCurrentDregister] = useState(null);
  const [searchText, setSearchText] = useState('');
  

  const fetchDregister = async () => {
    try {
      const response = await axios.get('/api/employee/getdrivers');
      const dataWithKey = response.data.drivers.map(item => ({ ...item, key: item._id }));
      setDregister(dataWithKey);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch Drivers');
    }
  };

  useEffect(() => {
    fetchDregister();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/employee/deletedrivers/${id}`);
      setDregister(prevDrivers => prevDrivers.filter(driver => driver._id !== id));
      message.success('Driver deleted successfully');
    } catch (error) {
      console.error('Failed to delete Driver:', error);
      message.error('Failed to delete Driver');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`/api/employee/updatedrivers/${currentDregister._id}`, values);
      if (response.data.success) {
        message.success('Driver updated successfully');
        setIsModalVisible(false);
        fetchDregister();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Failed to update Driver');
    }
  };

  /*const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredDriver = Dregister.filter((driver) =>
    driver.driName.toLowerCase().includes(searchText.toLowerCase())
  );*/

  const filteredDriver = Dregister.filter((driver) =>
  driver.driName.toLowerCase().includes(searchText.toLowerCase())
  
   || driver.driName.toLowerCase().includes(searchText.toLowerCase())
);

  const columns = [
    {
      title: 'Driver Name',
      dataIndex: 'driName',
      key: 'driName',
    },
    {
      title: 'Driver Email',
      dataIndex: 'driEmail',
      key: 'driEmail',
    },
    {
      title: 'Work Experience',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Register Date',
      dataIndex: 'regdate',
      key: 'regdate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Driver Phone Number',
      dataIndex: 'driPnum',
      key: 'driPnum',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" className="update" onClick={() => navigate(`/TraDriverDetailsUpdate/${record._id}`)}>
            Update
          </Button>
          <Button type="primary" className="update" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout>
        
        <div className="booktable-header">
        <h3>ALL DRIVER DETAILS</h3>
        <div className="booksearch-container">
            <Input
                placeholder="Search Drivers"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 200 }}
            />
        </div>
    </div>

            <Table dataSource={filteredDriver} columns={columns} />

      <Button classNames="bookdetails"
        type="primary"
        className="bookdetails"
        danger
        onClick={() => navigate(`/TraDriverViwe`)}
        
      >
        VIEW DRIVER DETAILS
      </Button>

      <Modal
        title="Update Driver"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{ ...currentDregister }}
          onFinish={handleUpdate}
        >
          <Form.Item
            name="driName"
            label="Driver Name"
            rules={[{ required: true, message: 'Please input the Driver Name!' }]}
          >
            <Input />
          </Form.Item>
          {/* Repeat for other fields as necessary */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default TraDriverDetailsDisplay;
