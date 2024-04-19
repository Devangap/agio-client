import React from 'react';
import { Form, Input, DatePicker, Radio, Button } from 'antd';
import moment from 'moment';
import "../leaveEmpform.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AnnCalendarForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async(values) =>{
    console.log('Recieved values of form', values);

    try {
      const response = await axios.post('/api/employee/AnnCalNotice', values);
      if(response.data.success){
          toast.success(response.data.message);
          navigate('/AnnCalendar');
         
          
      }else{
          toast.error(response.data.message);

      }
      
  } catch (error) {
      toast.error("Something went wrong");
  }

  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{
        confirmation: 'yes',
        date: moment(), // Current date
      }}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input your title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        
      >
        <DatePicker
          format="MMMM D, YYYY"
          className="form-control"
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea />
      </Form.Item>

      

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AnnCalendarForm;
