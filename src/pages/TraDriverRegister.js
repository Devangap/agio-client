import React from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TraDriverRegister() {
  const navigate = useNavigate();
  const { Option } = Select;

  // Custom validator function for phone number
  const validatePhoneNumber = (_, value) => {
    const phoneNumber = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (phoneNumber.length !== 10) {
      return Promise.reject('Please enter a 10-digit phone number');
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    console.log('Received values of form', values);

    try {
      const response = await axios.post('/api/employee/Driveregister', values);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/TraDriverDetailsDisplay');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Layout>
      <div className="bookform">
        <div className="book_form box p-3">
          <h3 className='booktitle'>CREATE DRIVER ACCOUNT</h3>
          <Form layout='vertical' onFinish={onFinish}>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item
                  label='Driver Name'
                  name='driName'
                  rules={[
                    { required: true, message: 'Please enter Driver Name' }
                  ]}
                >
                  <Input placeholder='Driver Name' />
                </Form.Item>
              </div>
            </div>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item
                  label='Driver Email'
                  name='driEmail'
                  rules={[
                    { type: 'email', message: 'Please enter a valid email' },
                    { required: true, message: 'Please enter Driver Email' }
                  ]}
                >
                  <Input placeholder='Driver Email' />
                </Form.Item>
              </div>
              <div className="bookitem">
                <Form.Item
                  name="Type"
                  label="Work Experience"
                  rules={[{ required: true, message: 'Please select Work Experience' }]}
                >
                  <Select placeholder="Select Work Experience">
                    <Option value="year0-5">0-5 years</Option>
                    <Option value="year6-10">6-10 years</Option>
                    <Option value="year10above">above 10 years</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item
                  label="Select Register Date"
                  name="regdate"
                  rules={[{ required: true, message: 'Please select Register Date' }]}
                >
                  <DatePicker className="date" />
                </Form.Item>
              </div>
            </div>
            <div className="bookitem">
              <Form.Item
                label='Driver Phone Number'
                name='driPnum'
                rules={[
                  { required: true, message: 'Please enter Phone Number' },
                  { pattern: /^[0-9]+$/, message: 'Please enter a valid Phone Number' },
                  { validator: validatePhoneNumber } // Custom validator for 10-digit number
                ]}
              >
                <Input placeholder='Phone Number' />
              </Form.Item>
            </div>
            <div className="bookButton-cons">
              <Button className='bookprimary-button my-2' htmlType='submit'>Submit</Button>
              <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraDriverDetailsDisplay`)}>View Details</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default TraDriverRegister;
