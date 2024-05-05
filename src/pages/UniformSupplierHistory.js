import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, Input, message, Modal, Form, InputNumber } from 'antd';
import Layout from '../components/Layout';
import '../OrderHistory.css';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('/api/supplierDetails/supplierDetails');
      setOrderHistory(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      message.error('Failed to fetch order history. Please try again later.');
    }
  };

  const handleUpdate = (record) => {
    setUpdateRecord(record);
    setUpdateModalVisible(true);
    form.setFieldsValue({
      orderId: record.orderId,
      supplierName: record.supplierName,
      type: record.type,
      numberOfUnits: record.numberOfUnits,
      cost: record.cost,
    });
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this order?',
      onOk: async () => {
        try {
          await axios.delete(`/api/supplierDetails/supplierDetails/${record._id}`);
          fetchOrderHistory();
          message.success('Order deleted successfully');
        } catch (error) {
          console.error('Error deleting order:', error);
          message.error('Failed to delete order. Please try again later.');
        }
      },
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB');
  };

  const handleSearch = () => {
    if (searchId.trim() === "") {
      message.warning("Please enter a valid ID");
      return;
    }

    const foundOrder = orderHistory.find(order => order.orderId === searchId);
    if (!foundOrder) {
      message.info("No order found with that ID");
      return;
    }

    setOrderHistory([foundOrder]);
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    
    if (e.target.value.trim() === "") {
      fetchOrderHistory();
    }
  };

  const handleStatusButtonClick = () => {
    window.location.href = '/UniformSupplier'; 
  };

  const handleStatusButtonClick2 = () => {
    window.location.href = '/UniformSupplierInput'; 
  };

  const handleUpdateModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const updatedRecord = {
          ...updateRecord,
          numberOfUnits: values.numberOfUnits,
          cost: values.cost,
        };
        await axios.patch(`/api/supplierDetails/supplierDetails/${updateRecord._id}`, updatedRecord);
        fetchOrderHistory();
        message.success('Order updated successfully');
        setUpdateModalVisible(false);
      } catch (error) {
        console.error('Error updating order:', error);
        message.error('Failed to update order. Please try again later.');
      }
    }).catch((errorInfo) => {
      console.error('Validation error:', errorInfo);
      message.error('Please fill all required fields correctly.');
    });
  };

  const handleUpdateModalCancel = () => {
    setUpdateModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: 'Units',
      dataIndex: 'numberOfUnits',
      key: 'numberOfUnits',
      width: 120,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 200,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button className="order-history-action-buttons" type="primary" onClick={() => handleUpdate(record)}>Update</Button>
          <Button className="order-history-action-buttons" type="danger" onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="order-history-container">
        <h1>Order History</h1>
        <div className="order-history-search-container">
          <Input
            className="order-history-search-input" 
            value={searchId}
            onChange={handleSearchChange}
            placeholder="Search by Order ID"
          />
          <Button className="custom-search-button" onClick={handleSearch}>Search</Button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick2}>New Order</Button>
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick}>Suppliers</Button>
        </div>
        <div className="order-history-table-container">
          <Table dataSource={orderHistory} columns={columns} scroll={{ y: 400 }} />
        </div>
        <Modal
          title="Update Order Details"
          visible={updateModalVisible}
          onOk={handleUpdateModalOk}
          onCancel={handleUpdateModalCancel}
          okText="Update"
          cancelText="Cancel"
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item label="Order ID" name="orderId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Supplier Name" name="supplierName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Type" name="type">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Number of Units" name="numberOfUnits" rules={[{ required: true, message: 'Please enter number of units' }]}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item label="Cost" name="cost">
              <InputNumber min={0} disabled />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default OrderHistory;
