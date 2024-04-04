import React from 'react';
import { Button, Form, Input, Select, DatePicker, Upload } from 'antd';
import '../inquiry.css';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'antd';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

function InsClaimSubmit() {

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
          const response = await axios.post("/api/insurance/insClaimSubmit", values);
          if (response.data.success) {
            toast.success(response.data.message);
            toast("Redirecting to Employee Insurance Claim Requset page");
            navigate("/InsEmployee");
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      };
  
  return (
    <div className="inquiry-container">

      <div className="image-container">

      </div>
      <div className="iform-container">
        <div className="imain_form box p-3">
          <h3 className='ititle'>Enter Insurance Claim Form</h3>
          <Form layout='horizontal' onFinish={onFinish}>
            <div className="iform-row">
              <div className="iitem">
                <Form.Item label='Full Name' name='name'>
                  <Input placeholder='Full name' />
                </Form.Item>
                <Form.Item label='Employee ID' name='id'>
                  <Input placeholder='UseEmployee ID' />
                </Form.Item>
                <Form.Item label='Phone Number' name='phoneNumber'>
                  <Input placeholder='Phone Number' />
                </Form.Item>

                <Form.Item label='Attach Medical Document'>
                  <Form.Item name="medicaldoc" valuePropName="fileList" noStyle>
                    <Upload name="meddoc" action="/upload.do" listType="text">
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
              </div>
            </div>
            <div className="iButton-cons">
              <Button className='iprimary-button my-2' htmlType='submit'>SUBMIT</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default InsClaimSubmit;
