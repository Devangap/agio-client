import React from 'react'
import {Button, Form ,  Input,Select, DatePicker,message,Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import Layout from './leaveLayout';
import axios from "axios";
import toast from 'react-hot-toast';

function LeaveHRsup() {
    const { RangePicker } = DatePicker;
    const { Option } = Select;

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };

  const onFinish = async(values) =>{
    console.log('Recieved values of form', values);
    try {
        const response = await axios.post('/api/leave/leaveHRsup', values);
        if(response.data.success){
            toast.success(response.data.message);
           
            
        }else{
            toast.error(response.data.message);
  
        }
        
    } catch (error) {
        toast.error("Something went wrong");
    }
       


  };


  



  return <Layout>
  <div className="annform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>Leave Submission Form</h3>
    <Form layout='vertical' onFinish={onFinish}>
      <div className="form-row">
      <div className="item">
          <Form.Item label='Employee Name' name='name'>
            <Input placeholder='Employee name' />
          </Form.Item>
        </div>
        
      </div>
      
      <div className="form-row">
      <div className="item">
      <Form.Item
      label="Leave Duration"
      name="RangePicker"
      rules={[{ required: true, message: 'Please input!' }]}
    >
      <RangePicker />
    </Form.Item>
        </div>
        <div className="item">
          <Form.Item name="Type" label="Select leave type">
            <Select className="Type" placeholder="Select leave type">
              <Option value="General">General</Option>
              <Option value="Specific">Annual </Option>
              <Option value="Specific">Medical </Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="form-row">
        <div className="item">
        <Form.Item label='Department' name='department'>
            <Input placeholder='Department' />
          </Form.Item>
       
            </div>
      </div>
      <div className="item">
        <Form.Item name="Description" label="Description">
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

export default LeaveHRsup