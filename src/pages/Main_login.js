import React from 'react'
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import '../mainlogin.css';

import {Link, useNavigate }from 'react-router-dom'
import axios from "axios";
import toast from 'react-hot-toast';
import { useSelector,useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';

function Main_login() {
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const onFinish = async (values) => {
    dispatch(showLoading());
    console.log('Received values of form', values);

    try {
      const response = await axios.post('/api/employee/Main_login', values);
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting ...");

        console.log(response.data);

        const name = values.username_log;
        console.log(name);
        if (name === "Devanga") {
          navigate("/leaveoverview");
          
        }
        else if (name === "Shenal") {
          navigate('/TraBookingDisplayAdmin');
          
        }else if (name === "Dulara") {
          navigate("/");
          
        }else if (name === "Dinura") {
          navigate("/medical-overview");
          
        }else if (name === "Dushan") {
          navigate("/UniformManagerView");
          
        }else if (name === "Banuka") {
          navigate("/");
          
        }else if (name === "Minuk") {
          navigate("/inquiryAdmin");
          
        }else if (name === "Thinal") {
          navigate("/AnnDisplay");
          
        }
        
        else{
          navigate("/");

        }
        localStorage.setItem("token", response.data.data);
        console.log(response.data.data);
        console.log(values.username_log)

        // Check if username_log is "Devanaga"
       
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      dispatch(hideLoading());
    }
  }

  
  
  return (
    <div className="mainlog">
    <div className="main_login_form_log boxx_log p-3">
      <div className = "logindata">
      <div className='logoforlogin'>
                        <img src='logos.png' className='logo'></img>
                        
                    </div>
                    <div className = "logindataform">
        <Form layout='vertical' onFinish={onFinish}>
            <div className="content">
                <div className='login'>
                    <div className='field'>
                    <Form.Item
    label='Username'
    name='username_log'
    style={{ marginLeft: '450px' }} // Add left margin of 200px
>
    <Input placeholder='Username' />
</Form.Item>
                    </div>
                    <Form.Item label='Password' name='password_log'
                    style={{ marginLeft: '450px' }}>
                        <Input placeholder='Password'
                        />
                        
                    </Form.Item>
                </div>
                <div className="Button-conslog">
                    <Button className='primary-button my-2' htmlType='submit'>LOG IN</Button>
                </div>
            </div>
        </Form>
    </div>
</div>
</div>
</div>
  )
}

export default Main_login

