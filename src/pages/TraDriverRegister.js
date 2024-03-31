import React from 'react'
import axios from 'axios';
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TraDriverRegister() {

  const navigate = useNavigate();

  const{Option} = Select;

  const onFinish = async(values) =>{
    console.log('Recieved values of form', values);

    try {
      const response = await axios.post('/api/TransportRoute/Driveregister', values);
      if(response.data.success){
          toast.success(response.data.message);
          navigate('/TraDriverDetailsDisplay');
         
          
      }else{
          toast.error(response.data.message);

      }
      
  } catch (error) {
      toast.error("Something went wrong");
  }

  }

  return <Layout>
    <div className="annform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>CREATE DRIVER ACCOUNT</h3>
    <Form layout='vertical' onFinish={onFinish}>
      <div className="form-row">
      <div className="item">
          <Form.Item label='Driver Name' name='driName'>
            <Input placeholder='Driver Name' />
          </Form.Item>
        </div>
        
      </div>
      
      <div className="form-row">
      <div className="item">
      <Form.Item label='Driver Email' name='driEmail'>
            <Input placeholder='Driver Email' />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item name="WorkExpereance" label="Work Expereance">
            <Select className="Type" placeholder="Select Work Expereance">
              <Option value="year0-5">0-5 years</Option>
              <Option value="year6-10">6-10 years</Option>
              <Option value="year10above">above 10 years</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="form-row">
        <div className="item">
          <Form.Item label="select Register Date" name="regdate">
            <DatePicker className="date" />
          </Form.Item>
        </div>
      </div>
      <div className="item">
      <Form.Item label='Driver PhoneNumber' name='driPnum'>
            <Input placeholder='Phone Number' />
          </Form.Item>
      </div>
      <div className="Button-cons">
        <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
      </div>
    </Form>
  </div>
</div>
  </Layout>
}

export default TraDriverRegister
