import React from 'react'
import {Button, Form ,  Input,Select, DatePicker,message,Upload } from 'antd'
import "../leaveEmpform.css"

import axios from "axios";
import toast from 'react-hot-toast';

function LeaveEmpform() {
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
        const response = await axios.post('/api/leave/leaveEmpform', values);
        if(response.data.success){
            toast.success(response.data.message);
           
            
        }else{
            toast.error(response.data.message);
  
        }
        
    } catch (error) {
        toast.error("Something went wrong");
    }
       


  };


  



  return (
  <div className="leaveform">
  <div className="leave_formbox p-3">
    <h3 className='leave_title'>Leave Submission Form</h3>
    <Form layout='vertical' onFinish={onFinish}>
      <div className="leave_form-row">
      <div className="leave_item">
          <Form.Item label='Employee Name' name='name'>
            <Input placeholder='Employee name' />
          </Form.Item>
          <Form.Item label='Department' name='department'>
            <Input placeholder='Department' />
          </Form.Item>
        </div>
        
      </div>
      
      <div className="leave_form-row">
      <div className="leave_item">
      <Form.Item
      label="Leave Duration"
      name="RangePicker"
      rules={[{ required: false, message: 'Please input!' }]}
    >
      <RangePicker  /> 
    </Form.Item>
        </div>
       
      </div>
      <div className="leave_form-row">
        <div className="leave_item">
        <div className="leave_item">
          <Form.Item name="Type" label="Select leave type">
            <Select className="leave_Type" placeholder="Select leave type">
              <Option value="General">General</Option>
              <Option value="Specific">Annual </Option>
              <Option value="Medical">Medical </Option>
            </Select>
          </Form.Item>
        </div>
       
            </div>
      </div>
      <div className="leave_item">
        <Form.Item name="Description" label="Description">
          <Input.TextArea className='leave_Description' />
        </Form.Item>
      </div>
      <div className="leave_Button-cons">
        <Button className='leave_primary-button my-2' htmlType='submit'>Submit</Button>
      </div>
    </Form>
  </div>
</div>
  )
} 

export default LeaveEmpform 