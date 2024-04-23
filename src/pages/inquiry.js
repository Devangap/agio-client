import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';
import '../inquiry.css';
import Layout from '../components/Layout';
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

function Inquiry() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const onFinish = async (values) => {
    console.log('Received values of form:', values);
    try {
      
      const formattedDate = moment(values.inquirydate).format('YYYY-MM-DD');

      const response = await axios.post(
        '/api/employee/inquiry',
        {
          ...values,
          userid: user?.userid,
          username: user?.username,
          inquirydate: formattedDate, //date update here
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/MyInquiries', { state: { username: user?.username } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject('Please input your phone number!');
    }
    const phoneNumberRegex = /^\+94\d{9}$/; //phone no. val
    if (!phoneNumberRegex.test(value)) {
      return Promise.reject('Please enter a valid Sri Lankan phone number starting with +94 and containing 10 digits!');
    }
    return Promise.resolve();
  };

  const handleNavigate = () => {
    navigate('/MyInquiries', { state: { username: user?.username } });
  };

  return (
    <Layout>
      <div className="inquiry-container">
        
        <div className="iform-container">
          <div className="imain_form box p-3">
            <h3 className='ititle'>Enter Inquiry Form</h3>
            <Form layout='horizontal' onFinish={onFinish} initialValues={{ username: user?.username }}>
              <div className="iform-row">
                <div className="iitem">
                  <Form.Item label='Full Name' name='name' rules={[{ required: true, message: 'Please input your full name!' }]}>
                    <Input placeholder='Full name' />
                  </Form.Item>
                  <Form.Item label="Pick a date" name="inquirydate" rules={[{ required: true, message: 'Please select inquiry date!' }]}>
                    <DatePicker className="date" />
                  </Form.Item>
                  <Form.Item className="i-phone-input" label='Phone No' name='phoneNumber' rules={[{ validator: validatePhoneNumber,required: true, message: 'Please enter your phone number!' }]}>
                    <Input placeholder='+94XXXXXXXXX' />
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
