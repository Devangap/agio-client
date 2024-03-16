import React from 'react'
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import '../mainreg.css';




function Main_login() {
  const { Option } = Select;

  const onFinish = values =>{
    console.log('Recieved values of form', values);

  }
  
  return (
    <div className="mainreg">
  <div className="main_login_form box p-3">
    <h3 className='title'>Login</h3>
    <Form layout='vertical' onFinish={onFinish}>
<<<<<<< Updated upstream
      <div className="form-row">
        <div className="item">
          <Form.Item label='Full Name' name='name'>
            <Input placeholder='Full name' />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item label="Date of Birth" name="dob">
            <DatePicker className="date" />
          </Form.Item>
        </div>
      </div>
=======
      
>>>>>>> Stashed changes
      <div className="form-row">
        <div className="item">
          <Form.Item label='Username' name='username'>
            <Input placeholder='Username' />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item label='Password' name='password'>
            <Input placeholder='Password' />
          </Form.Item>
        </div>
      </div>
<<<<<<< Updated upstream
      <div className="form-row">
        <div className="item">
          <Form.Item label='Job Title' name='jobRole'>
            <Input placeholder='Job Title' />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item name="shift" label="Shift">
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
          <Form.Item label="Date Joined" name="dateJoined">
            <DatePicker className="date" />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item label='Phone Number' name='phoneNumber'>
            <Input placeholder='Phone Number' />
          </Form.Item>
        </div>
      </div>
      <div className="item">
        <Form.Item name="address" label="Address">
          <Input.TextArea className='address' />
        </Form.Item>
      </div>
      <div className="Button-cons">
        <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
      </div>
=======
    
>>>>>>> Stashed changes
    </Form>
  </div>
</div>
  )
}

export default Main_login

