import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Button, Select, DatePicker, Modal, Form, message } from 'antd';
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
  const [updateRecord, setUpdateRecord] = useState(null);
  const [waistSizeDisabled, setWaistSizeDisabled] = useState(false);

  const fetchUniformOrders = async () => {
    try {
      const response = await axios.get('/api/uniformOrder');
      setUniformOrders(response.data);
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

  const handleUpdateSubmit = async (values) => {
    try {
      // Send a request to update the record in the database
      await axios.put(`/api/uniformOrder/${updateRecord._id}`, values);
      message.success('Uniform order updated successfully');
      // Fetch the updated uniform orders
      fetchUniformOrders();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating uniform order:', error);
      message.error('Failed to update uniform order');
    }
  };

  const handleDelete = async (key) => {
    try {
      // Send a request to delete the record from the database
      await axios.delete(`/api/uniformOrder/${key}`);
      message.success('Uniform order deleted successfully');
      // Fetch the updated uniform orders
      fetchUniformOrders();
    } catch (error) {
      console.error('Error deleting uniform order:', error);
      message.error('Failed to delete uniform order');
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const handleFilterClick = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const filteredUniformOrders = uniformOrders.filter(order => {
    for (let key in filters) {
      if (key === 'position' && filters[key] === 'Any') {
        continue;
      }
      if (filters[key] && filters[key] !== order[key]) {
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
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleUpdate(record)}>Update</Button>
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h1>Uniform Orders</h1>
      <Button type="primary" onClick={handleFilterClick}>Filter</Button>
      <Modal
        title="Update Uniform Order"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSubmit}
          initialValues={{
            position: updateRecord?.position,
            tshirtSize: updateRecord?.tshirtSize,
            waistSize: updateRecord?.waistSize,
            uniformCount: updateRecord?.uniformCount,
          }}
        >
          <Form.Item label="Position">
            <Input value={updateRecord?.position} disabled />
          </Form.Item>
          <Form.Item label="T-shirt Size" name="tshirtSize" rules={[{ required: true, message: 'Please select the t-shirt size!' }]}>
            <Select>
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
              <Option value="XL">XL</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Waist Size" name="waistSize" rules={[{ required: true, message: 'Please input the waist size!' }]}>
            <Select disabled={waistSizeDisabled}>
              <Option value={28}>28</Option>
              <Option value={30}>30</Option>
              <Option value={32}>32</Option>
              <Option value={34}>34</Option>
              <Option value={36}>36</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Uniform Count" name="uniformCount" rules={[{ required: true, message: 'Please select the uniform count!' }]}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={filteredUniformOrders} columns={columns} />
    </div>
  );
}

export default UniformOrders;