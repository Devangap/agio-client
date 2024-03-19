import React from 'react'
import {Button, Form ,  Input} from 'antd'
import {Link, useNavigate }from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import loginImage from './image/Cigars.jpg';
import "../TraRegister.css"


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
    
    <div className="mainlog">
  <div className="main_login_form_log box_log p-3">
  <div className="login_image">
          <img src={loginImage} alt="Login Image" />
        </div>
        
    <h3 className='title_log'>Transport Login</h3>
    <Form layout='vertical' onFinish={onFinish}>
    <div className="content">
   
     
      <div className = 'login'>
      <div className = 'field'>
      <Form.Item label="Email" name='email'>
                    <Input placeholder='email' />
                </Form.Item>
          </div>
         
          <Form.Item label="Password" name='password'>
                    <Input placeholder='password' type='password'/>
                </Form.Item>
          
          </div>
      
      <div className="Button-conslog">
        <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
        <div className='anchor mt-2'>
        <Link  to='/register' className='anchor mt-2'>CLICK HERE TO LOGIN</Link> 
        </div>
      </div>
      
      </div>
    </Form>
  </div>
</div>
    
  )
}

export default TraLogin