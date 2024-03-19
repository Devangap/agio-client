import React from 'react';
import { Button, Form, Input, Select, DatePicker, Upload } from 'antd';
import '../inquiry.css';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'antd';

function Inquiry() {
  const { Option } = Select;

  const onFinish = values => {
    console.log('Received values of form:', values);
  };
  
  return (
    <div className="inquiry-container">
      <div className="image-container">
        <img src={require('../images/cigar.webp')} alt="background Image" />
      </div>
      <div className="form-container">
        <div className="main_form box p-3">
          <h3 className='title'>Enter Inquiry Form</h3>
          <Form layout='horizontal' onFinish={onFinish}>
            <div className="form-row">
              <div className="item">
                <Form.Item label='Full Name' name='name'>
                  <Input placeholder='Full name' />
                </Form.Item>
                <Form.Item label='Username' name='username'>
                  <Input placeholder='Username' />
                </Form.Item>
                <Form.Item label="Pick a date" name="inquirydate">
                  <DatePicker className="date" />
                </Form.Item>
                <Form.Item label='Phone Number' name='phoneNumber'>
                  <Input placeholder='Phone Number' />
                </Form.Item>
                <Form.Item name="describe" label="Enter Inquiry">
                  <Input.TextArea className='describe' />
                </Form.Item>
                <Form.Item label='Attach Document'>
                  <Form.Item name="attachment" valuePropName="fileList" noStyle>
                    <Upload name="logo" action="/upload.do" listType="text">
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
              </div>
            </div>
            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>SUBMIT</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Inquiry;
