import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Destructure Select Option from Ant Design
const { Option } = Select;

// AnnHRsup Component
function AnnHRsup() {
  // State variables
  const [announcementType, setAnnouncementType] = useState('');
  const [fileList, setFileList] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Function to handle form submission
  const onFinish = async (values) => {
    // Create a new FormData instance
    const formData = new FormData();
    // Append each file to FormData
    fileList.forEach(file => {
      formData.append('file', file);
    });
    // Append other form values to FormData
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    // Append user ID to FormData
    formData.append('userid', user?.userid);

    try {
      // Make POST request to upload the form data
      const response = await axios.post('/api/employee/AnnHRsup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Handle response
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/AnnDisplay');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Function to handle file removal
  const handleRemove = file => {
    setFileList(prevFileList => prevFileList.filter(f => f !== file));
  };

  // Function to handle file selection
  const handleBeforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      toast.error('You can only upload JPG/PNG file!');
    }
    if (isJpgOrPng) {
      setFileList([...fileList, file]);
    }
    return false; // Prevent automatic upload
  };

  // Function to handle announcement type change
  const handleTypeChange = value => {
    setAnnouncementType(value);
  };

  // JSX component
  return (
    <Layout>
      <div className="annform">
        <div className="AnnHRSup_form box p-3">
          <h3 className='title'>Create an Announcement</h3>
          <Form layout='vertical' onFinish={onFinish}>
            {/* Announcement Title */}
            <div className="form-row">
              <div className="item">
                <Form.Item label='Announcement Title' name='anntitle' rules={[{ required: true, message: 'Please input announcement title!' }]}>
                  <Input placeholder='Announcement Title' />
                </Form.Item>
              </div>
            </div>
            {/* Upload Date and Type */}
            <div className="form-row">
              <div className="item">
                <Form.Item label="Upload Date" name="uploaddate">
                  <DatePicker className="date" />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item name="Type" label="Type">
                  <Select className="Type" placeholder="Select announcement type" onChange={handleTypeChange}>
                    <Option value="General">General</Option>
                    <Option value="Specific">Specific</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/* Department (Specific announcement type) */}
            {announcementType === 'Specific' && (
              <div className="form-row">
                <div className="item">
                  <Form.Item label="Department" name="Department">
                    <Select placeholder="Select department">
                    <Option value="HR">HR</Option>
             
             <Option value="Logistics">Logistics</Option>
             <Option value="Procurement Department">Procurement Department</Option>
             <Option value="Quality Assurance">Quality Assurance</Option>
             <Option value="Production Department">Production Department</Option>
             <Option value="Sales and Marketing">Sales and Marketing</Option>
             <Option value="Finance and Accounting ">Finance and Accounting </Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}
            {/* Expire Date and Upload Media */}
            <div className="form-row">
              <div className="item">
                <Form.Item label="Expire Date" name="expiredate">
                  <DatePicker className="date" />
                </Form.Item>
              </div>
              <div className="itemUpload">
                <Form.Item label='Upload Media' name='file'>
                  <Upload 
                    beforeUpload={handleBeforeUpload} 
                    onRemove={handleRemove} 
                    fileList={fileList} 
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            {/* Description */}
            <div className="item">
              <Form.Item name="Description" label="Description">
                <Input.TextArea className='Description' />
              </Form.Item>
            </div>
            {/* Submit Button */}
            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default AnnHRsup;

