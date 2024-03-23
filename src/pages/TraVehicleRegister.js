import React from 'react'
import axios from 'axios';
import {Button, Form ,  Input,Select, DatePicker } from 'antd'
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function TraVehicleRegister() {
 
    const navigate = useNavigate();

    const{Option} = Select;
  
    const onFinish = async(values) =>{
      console.log('Recieved values of form', values);
  
      try {
        const response = await axios.post('/api/TransportRoute/TraBooking', values);
        if(response.data.success){
            toast.success(response.data.message);
            navigate('/TraBookingDisplay');
           
            
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
      <h3 className='title'>CREATE VEHICLE ACCOUNT</h3>
      <Form layout='vertical' onFinish={onFinish}>
        <div className="form-row">
        <div className="item">
        <Form.Item name="Type" label="Type">
              <Select className="Type" placeholder="Select Vehicle type">
                <Option value="General">Bus</Option>
                <Option value="Specific">Van</Option>
              </Select>
            </Form.Item>
          </div>
          
        </div>
        
        <div className="form-row">
        <div className="item">
        <Form.Item label='Vehicle Number' name='vehicleNum'>
              <Input placeholder='Vehicle Number' />
            </Form.Item>
          </div>
          <div className="item">
          <Form.Item name="ECDetails" label="Emissions Certificate Details ">
            <Input.TextArea className='Description' />
          </Form.Item>
          </div>
        </div>
        <div className="form-row">
          <div className="item">
          <Form.Item name="Licence Details" label="Licence Details">
            <Input.TextArea className='Description' />
          </Form.Item>
          </div>
        </div>
        <div className="item">
          <Form.Item name="Owner Details" label="Owner Details">
            <Input.TextArea className='Description' />
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

export default TraVehicleRegister