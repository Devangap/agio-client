import React, { useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import '../uniformOrder.css';

const { Option } = Select;

function UniformOrderForm() {
  const [position, setPosition] = useState('');
  const [showWaistSizeInput, setShowWaistSizeInput] = useState(false);
  const [uniformCount, setUniformCount] = useState(1);

  const handlePositionChange = value => {
    setPosition(value);
    setShowWaistSizeInput(value === 'Factory Worker');
  };

  const handleUniformCountChange = value => {
    setUniformCount(value);
  };

  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  const renderAdditionalChargesMessage = () => {
    if (uniformCount > 1) {
      return <p className="additional-charges-message">Additional Charges May Apply</p>;
    }
    return null;
  };

  return (
    <div className="uniform-order-container">
      <div className="uniform-order-form-container">
        <div className="uniform-order-form-box p-3">
          <h3 className="uniform-order-title">Uniform Order Form</h3>
          <Form layout="horizontal" onFinish={onFinish}>
            <div className="uniform-order-form-row">
              <div className="uniform-order-item">
                <Form.Item label="Position" name="position">
                  <Select onChange={handlePositionChange} placeholder="Select Position">
                    <Option value="Executive">Executive</Option>
                    <Option value="Factory Worker">Factory Worker</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Standard T-shirt Size" name="tshirtSize">
                  <Select placeholder="Select Size">
                    <Option value="Small">Small</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Large">Large</Option>
                    <Option value="XL">XL</Option>
                  </Select>
                </Form.Item>
                {showWaistSizeInput && (
                  <Form.Item label="Waist Size" name="waistSize">
                    <Input placeholder="Enter Waist Size" />
                  </Form.Item>
                )}
                <Form.Item label="No. of Uniforms" name="uniformCount">
                  <Select onChange={handleUniformCountChange} placeholder="Select No. of Uniforms">
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                  </Select>
                </Form.Item>
                {renderAdditionalChargesMessage()}
              </div>
            </div>
            <div className="uniform-order-button-container">
              <Button className="uniform-order-submit-button" htmlType="submit">
                Place Order
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default UniformOrderForm;
