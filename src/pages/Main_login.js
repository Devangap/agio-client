import React from 'react'
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import '../mainlogin.css';
import loginImage from '../Images/login.jpg';
import {Link, useNavigate }from 'react-router-dom'
import axios from "axios";
import toast from 'react-hot-toast';
import { useSelector,useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';

function Main_login() {
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const onFinish = async(values) =>{
    dispatch(showLoading());
    console.log('Recieved values of form', values);
   
    try {
        const response = await axios.post('/api/employee/Main_login', values);
        if(response.data.success){
            toast.success(response.data.message);
            toast("Redirecting to home page");
            localStorage.setItem("token", response.data.data);
            navigate("/")

           
            
        }else{
            toast.error(response.data.message);
  
        }
        
    } catch (error) {
      
        toast.error("Something went wrong");
    }
    finally{
      dispatch(hideLoading());
    }
       

  }
  
  
  return (
    <div className="mainlog">
  <div className="main_login_form_log box_log p-3">
  <div className="login_image">
          <img src={loginImage} alt="Login Image" />
        </div>
        
    <h3 className='title_log'>Login</h3>
    <Form layout='vertical' onFinish={onFinish}>
    <div className="content">
   
     
      <div className = 'login'>
      <div className = 'field'>
          <Form.Item label='Username' name='username_log'>
            <Input placeholder='Username' />
          </Form.Item>
          </div>
         
          <Form.Item label='Password' name='password_log'>
            <Input placeholder='Password' />
          </Form.Item>
          
          </div>
      
      <div className="Button-conslog">
        <Button className='primary-button my-2' htmlType='submit'>LOGIN</Button>
      </div>
      </div>
    </Form>
  </div>
</div>
  )
}

export default Main_login

