import React from 'react'
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import '../mainreg.css';
import axios from "axios";
import toast from 'react-hot-toast';
import { useSelector,useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts.js';
import Layout from '../components/Layout.js';
import moment from 'moment';



function Main_register() {
  const { Option } = Select;
  const dispatch = useDispatch();
  const { TextArea } = Input;


  const onFinish = async(values) => {
    console.log('Recieved values of form', values);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/employee/Main_register', values);
      dispatch(hideLoading());
      if(response.data.success){
          toast.success(response.data.message);
         
          
      }else{
          toast.error(response.data.message);

      }
      
  } catch (error) {
    dispatch(hideLoading());
      toast.error("Something went wrong");
  }
     
  };
  const disabledDate = current => {
    return current && current > moment().endOf('day');
  };

  return (
    <Layout>
    <div className="mainreg mt-10" >
      <div className="main_login_form box p-3">
        <h3 className='title'>Employee Registration Form</h3>
        <Form layout='vertical' onFinish={onFinish}>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label='Full Name'
                name='fname'
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input placeholder='Full name' />
              </Form.Item>
            </div>
            <div className="item">
              <Form.Item
                label="Employee ID"
                name="empid"
                rules={[{ required: true, message: 'Please input your employee ID!' }]}
              >
                <Input placeholder='Employee ID' />
              </Form.Item>
            </div>
          </div>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label='Username'
                name='username_log'
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder='Username' />
              </Form.Item>
            </div>
            <div className="item">
              <Form.Item
                label='Password'
                name='password_log'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder='Password' />
              </Form.Item>
            </div>
          </div>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label='Job Title'
                name='jobRole'
                rules={[{ required: true, message: 'Please input your job title!' }]}
              >
                <Input placeholder='Job Title' />
              </Form.Item>
            </div>
            <div className="item">
              <Form.Item
                name="shift"
                label="Shift"
                rules={[{ required: true, message: 'Please select a shift!' }]}
              >
                <Select className="shift" placeholder="Select a shift">
                  <Option value="morning">08:00 - 14:00</Option>
                  <Option value="evening">14:00 - 20:00</Option>
                  <Option value="other">No specific shift</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label="Date Joined"
                name="dateJoined"
                rules={[{ required: true, message: 'Please select the date joined!' }]}
              >
                <DatePicker className="date" disabledDate={disabledDate} />
              </Form.Item>
            </div>
            <div className="item">
              <Form.Item
                label='Phone Number'
                name='phoneNumber'
                rules={[
                  { required: true, message: 'Please input your phone number!' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                ]}
              >
                <Input placeholder='Phone Number' />
              </Form.Item>
            </div>
          </div>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker className="date" disabledDate={disabledDate} />
              </Form.Item>
            </div>
            <div className="item">
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select a department!' }]}
              >
                <Select className="department" placeholder="Select a department">
                  <Option value="HR">HR</Option>
                  <Option value="Logistics">Logistics</Option>
                  <Option value="Procurement Department">Procurement Department</Option>
                  <Option value="Quality Assurance">Quality Assurance</Option>
                  <Option value="Production Department">Production Department</Option>
                  <Option value="Sales and Marketing">Sales and Marketing</Option>
                  <Option value="Finance and Accounting ">Finance and Accounting </Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="form-row">
            <div className="item">
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <Input.TextArea rows={4} className='address' />
              </Form.Item>
            </div>
          </div>
          <div className="Button-cons">
            <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
          </div>
        </Form>
      </div>
    </div>
  </Layout>
  )
}

export default Main_register
