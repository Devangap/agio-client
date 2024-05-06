import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import "../TraForm.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';
import { setUser } from '../redux/userSlice';
import moment from 'moment';
import Layout from '../components/Layout';

const { Option } = Select;

function TraBooking() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [vehicleType, setVehicleType] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.post('/api/employee/get-employee-info-by-id', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // date disable 
  const disabledDate = (current) => {
    return current && (current < moment().startOf('day') || current > moment().endOf('day'));
  };

  const onFinish = async (values) => {
    console.log('Received values of form', values);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/employee/TraBooking', { ...values, userid: user?.userid }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        navigate("/TraBookingDisplay");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const handleVehicleTypeChange = (value) => {
    setVehicleType(value);
  };

  // Customer email Validation
  const validateEmail = (rule, value, callback) => {
    if (!value) {
      callback('Please enter your email!');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      callback('Invalid email format!');
    } else {
      callback();
    }
  };

  return (
    <Layout>
      <div className="bookform">
        <div className="book_form box p-3">
          <h3 className='booktitle'>BOOKING TRANSPORT</h3>
          <Form layout='vertical' onFinish={onFinish}>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item label='Employee Name' name='EmpName' rules={[{ required: true, message: 'Please enter employee name' }]}>
                  <Input placeholder='Employee Name' />
                </Form.Item>
              </div>
            </div>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item label='Employee Email' name='EmpEmail' rules={[{ required: true, message: 'Please enter employee email' }, { validator: validateEmail }]}>
                  <Input placeholder='Employee Email' />
                </Form.Item>
              </div>
              <div className="bookitem">
                <Form.Item name="Type" label="Type" rules={[{ required: true, message: 'Please select vehicle type' }]}>
                  <Select className="Type" placeholder="Select Vehicle type" onChange={handleVehicleTypeChange}>
                    <Option value="Bus">Bus</Option>
                    <Option value="Van">Van</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="bookitem">
                {vehicleType === 'Bus' && (
                  <Form.Item name="location" label="Select Bus Location" rules={[{ required: true, message: 'Please select bus location' }]}>
                    <Select className="Type" placeholder="Select Bus Location">
                      <Option value="Kollupitiya">Kollupitiya</Option>
                      <Option value="Moratuwa">Moratuwa</Option>
                      <Option value="Panadura">Panadura</Option>
                    </Select>
                  </Form.Item>
                )}
                {vehicleType === 'Van' && (
                  <Form.Item name="location" label="Select Van Location" rules={[{ required: true, message: 'Please select van location' }]}>
                    <Select className="Type" placeholder="Select Van Location">
                      <Option value="Ja-Ela">Ja-Ela</Option>
                      <Option value="Katunayake">Katunayake</Option>
                      <Option value="Negambo">Negambo</Option>
                    </Select>
                  </Form.Item>
                )}
              </div>
            </div>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item label="Booking Date" name="bookingdate" rules={[{ required: true, message: 'Please select booking date' }]}>
                  <DatePicker className="date" disabledDate={disabledDate} defaultValue={moment()} />
                </Form.Item>
              </div>
            </div>
            <div className="bookitem">
              <Form.Item name="Details" label="Any Other Details">
                <Input.TextArea className='Description' />
              </Form.Item>
            </div>
            <div className="bookButton-cons">
              <Button className='bookprimary-button my-2' htmlType='submit'>Submit</Button>
              <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBookingDisplay`)}>View Details</Button>
              <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBookingdisplayAll`)}>View Available Seats</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default TraBooking;
