import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import '../inquiry.css';
import Layout from '../components/Layout';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Inquiry() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form:', values,);
    try {
      const response = await axios.post('/api/inquiry/inquiry', values);
      if(response.data.success){
          toast.success(response.data.message);
          navigate('/MyInquiries', { state: { username: values.username } });
      } else {
          toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  

  const handleNavigate = () => {
    navigate('/MyInquiries');
    
  };

  return (
    <Layout>
      <div className="inquiry-container">
        <div className="image-container"></div>
        <div className="iform-container">
          <div className="imain_form box p-3">
            <h3 className='ititle'>Enter Inquiry Form</h3>
            <Form layout='horizontal' onFinish={onFinish}>
              <div className="iform-row">
                <div className="iitem">
                  <Form.Item label='Full Name' name='name' rules={[{ required: true, message: 'Please input your full name!' }]}>
                    <Input placeholder='Full name' />
                  </Form.Item>
                  <Form.Item label='Username' name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input placeholder='Username' />
                  </Form.Item>
                  <Form.Item label="Pick a date" name="inquirydate" rules={[{ required: true, message: 'Please select inquiry date!' }]}>
                    <DatePicker className="date" />
                  </Form.Item>
                  <Form.Item label='Phone Number' name='phoneNumber' rules={[{ required: true, message: 'Please input your phone number!' }]}>
                    <Input placeholder='Phone Number' />
                  </Form.Item>
                  <Form.Item name="describe" label="Enter Inquiry" rules={[{ required: true, message: 'Please enter your inquiry!' }]}>
                    <Input.TextArea className='idescribe' />
                  </Form.Item>
                </div>
              </div>
              <div className="iButton-cons">
                <Button className='iprimary-button my-2' htmlType='submit'>SUBMIT</Button>
                <Button className='isecondary-button my-2' onClick={handleNavigate}>My Inquiries</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Inquiry;
