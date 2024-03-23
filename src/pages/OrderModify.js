import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import '../orderModify.css';

const { Option } = Select;

const OrderModify = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    empId: 'EMP001',
    empName: 'John Doe',
    tshirtSize: 'Large',
    waistSize: '32',
    orderDate: '2024-03-20',
    status: 'Processing',
  });

  const onFinish = values => {
    console.log('Modified values:', values);
    // Here you can implement logic to submit the modified order details
  };

  return (
    <div className="order-modify-container">
      <h2 className="order-modify-title">Modify Order Details</h2>
      <Form
        form={form}
        name="modifyOrderForm"
        initialValues={initialValues}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item label="Emp ID" name="empId">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Employee Name" name="empName">
          <Input disabled />
        </Form.Item>
        <Form.Item label="T-shirt Size" name="tshirtSize">
          <Select>
            <Option value="Small">Small</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Large">Large</Option>
            <Option value="XL">XL</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Waist Size" name="waistSize">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Modify & Resubmit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderModify;
