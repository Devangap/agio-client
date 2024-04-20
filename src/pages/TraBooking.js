import React, { useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import "../TraForm.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDispatch ,useSelector} from 'react-redux';
import { showLoading ,hideLoading} from '../redux/empalerts';
import { setUser } from '../redux/userSlice';
import Layout from '../components/Layout';


function TraBooking() {

  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const [userData, setUserData] = useState({}); 

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  const onFinish = async (values) => {
    console.log('Received values of form', values);
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/employee/TraBooking', {...values, userid: user?.userid}, {
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
                  <Select className="Type" placeholder="Select Vehicle type">
                    <Option value="Bus">Bus</Option>
                    <Option value="Van">Van</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="bookitem">
                <Form.Item name="location" label="Select Location" rules={[{ required: true, message: 'Please select location' }]}>
                  <Select className="Type" placeholder="Select Location">
                    <Option value="Colombo">Colombo</Option>
                    <Option value="Ja-ela">Ja-ela</Option>
                    <Option value="Kollupitiya">Kollupitiya</Option>
                    <Option value="Negambo">Negambo</Option>
                    <Option value="Panadura">Panadura</Option>
                    <Option value="Kaduwela">Kaduwela</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item label="Booking Date" name="bookingdate" rules={[{ required: true, message: 'Please select booking date' }]}>
                  <DatePicker className="date" />
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
              <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBookingDisplay`)}>Viwe Details</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default TraBooking;
