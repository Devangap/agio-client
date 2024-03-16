import React from 'react'
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import '../mainlogin.css';
import loginImage from '/Users/dev/Documents/GitHub/agio-client/src/Images/login.jpg';




function Main_login() {
  const { Option } = Select;

  const onFinish = values =>{
    console.log('Recieved values of form', values);

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
          <Form.Item label='Username' name='username'>
            <Input placeholder='Username' />
          </Form.Item>
          </div>
         
          <Form.Item label='Password' name='password'>
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

