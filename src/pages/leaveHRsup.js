import React from 'react'
import {Button, Form ,  Input,Select, DatePicker,message,Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import AnnLayout from './AnnLayout';

function LeaveHRsup() {

  const{Option} = Select;

  const onFinish = values =>{
    console.log('Recieved values of form', values);

  }


  const props = {
    beforeUpload: file => {
      // Here you can add file type checks and other validation
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      return isJpgOrPng || Upload.LIST_IGNORE;
    },
    onChange: info => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };



  return <AnnLayout>
  <div className="annform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>Create an Announcement</h3>
    <Form layout='vertical' onFinish={onFinish}>
      <div className="form-row">
      <div className="item">
          <Form.Item label='Announcement Title' name='anntitle'>
            <Input placeholder='Announcement Title' />
          </Form.Item>
        </div>
        
      </div>
      
      <div className="form-row">
      <div className="item">
          <Form.Item label="Upload Date" name="uploaddate">
            <DatePicker className="date" />
          </Form.Item>
        </div>
        <div className="item">
          <Form.Item name="Type" label="Type">
            <Select className="Type" placeholder="Select announcement type">
              <Option value="General">General</Option>
              <Option value="Specific">Specific</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="form-row">
        <div className="item">
          <Form.Item label="Expire Date" name="expiredate">
            <DatePicker className="date" />
          </Form.Item>
        </div>
        <div className="item">
              <Form.Item label='Upload Media' name='upload'>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
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
</AnnLayout>
} 

export default LeaveHRsup