import React from 'react'
import {Button, Form ,  Input} from 'antd'
import {Link, useNavigate }from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import Header from './Header';

function TraLogin() {
const navigate = useNavigate();
    const onFinish = async(values) =>{
        try {
            const response = await axios.post('/api/user/login', values);
            if(response.data.success){
                toast.success(response.data.message);
                toast("Redirecting to Home Page");
                localStorage.setItem("token",response.data.data);
                navigate("/home");
            }else{
                toast.error(response.data.message);

            }
            
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

  return (
    <div className='serch-header'>
        <Header />
    <div className='authentication'>
        <div className='authentication-form card p-3' >
            <h1 className='card-title'>Welcome Back</h1>

            <Form layout='vertical' onFinish={onFinish}>
                
                <Form.Item label="Email" name='email'>
                    <Input placeholder='email' />
                </Form.Item>
                <Form.Item label="Password" name='password'>
                    <Input placeholder='password' type='password'/>
                </Form.Item>

                 <Button className='primary-button my-2' htmlType='submit'>LOGIN</Button> 
                 <Link  to='/register' className='anchor mt-2'>CLICK HERE TO REGISTER</Link> 

            </Form>
        </div>

    </div>
    </div>
  )
}

export default TraLogin