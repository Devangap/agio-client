import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fetch order details from backend using order ID or other identifier
    // Example fetch code:
    // fetch('/api/orderDetails?id=' + orderId)
    //   .then(response => response.json())
    //   .then(data => setOrder(data))
    //   .catch(error => console.error('Error fetching order details:', error));
    
    // Mock data for demonstration
    const mockOrder = {
      _id: '123456',
      employeeNumber: 'EMP123',
      position: 'Factory Worker',
      tshirtSize: 'Large',
      waistSize: '32',
      uniformCount: 2,
    };
    setOrder(mockOrder);
  }, []);

  const handleModifyOrder = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    // Handle form submission to update order details
    message.success('Order modified successfully');
    setVisible(false);
    // You can redirect to another page or update state as needed
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Employee Number:</strong> {order.employeeNumber}</p>
      <p><strong>Position:</strong> {order.position}</p>
      <p><strong>T-shirt Size:</strong> {order.tshirtSize}</p>
      {order.position === 'Factory Worker' && <p><strong>Waist Size:</strong> {order.waistSize}</p>}
      <p><strong>No. of Uniforms:</strong> {order.uniformCount}</p>
      <Button type="primary" onClick={handleModifyOrder}>Modify Order</Button>
      <Modal
        title="Modify Order"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Employee Number" name="employeeNumber" initialValue={order.employeeNumber}>
            <Input />
          </Form.Item>
          <Form.Item label="Position" name="position" initialValue={order.position}>
            <Select>
              <Option value="Executive">Executive</Option>
              <Option value="Factory Worker">Factory Worker</Option>
            </Select>
          </Form.Item>
          <Form.Item label="T-shirt Size" name="tshirtSize" initialValue={order.tshirtSize}>
            <Select>
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
              <Option value="XL">XL</Option>
            </Select>
          </Form.Item>
          {order.position === 'Factory Worker' && (
            <Form.Item label="Waist Size" name="waistSize" initialValue={order.waistSize}>
              <Input />
            </Form.Item>
          )}
          <Form.Item label="No. of Uniforms" name="uniformCount" initialValue={order.uniformCount}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default OrderDetails;
