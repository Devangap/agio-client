import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Layout from "../components/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../Insurance.css";

function InsClaimSubmit() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [employeeId, setEmployeeId] = useState('');

    useEffect(() => {
        const fetchEmployeeId = async () => {
            try {
                const response = await axios.post("/api/employee/get-employee-info-by-id", {}, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                });
                if (response.data.success) {
                    setEmployeeId(response.data.data.empid);
                    console.log(response.data.data.empid);
                } else {
                   
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchEmployeeId();
    }, []);    

    const validatePhoneNumber = (_, value) => {
        if (value && value.length !== 10) {
            return Promise.reject(new Error('Phone number must be 10 digits'));
        }
        return Promise.resolve();
    };

    const validateFile = (_, fileList) => {
        if (fileList.length > 1) {
            return Promise.reject(new Error('Only one file can be uploaded'));
        }
        if (fileList.length === 1) {
            const file = fileList[0];
            const fileType = file.type;
            if (fileType !== 'application/pdf') {
                return Promise.reject(new Error('Only PDF files are allowed'));
            }
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
    try {
        if (!values.medicaldoc || !Array.isArray(values.medicaldoc) || values.medicaldoc.length === 0) {
            toast.error("Please upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('id', employeeId);
        formData.append('phoneNumber', values.phoneNumber);
        formData.append('description', values.description); 
        formData.append('file', values.medicaldoc[0].originFileObj);

        const response = await axios.post("/api/insurance/insClaimSubmit", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
            }
        });

        if (response.data.success) {
            toast.success(response.data.message);
            toast("Redirecting to Employee Insurance Claim Request page");
            navigate("/InsEmployee");
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
    }
};

    return (
        <Layout>
            <h3 className='ins-title'>Enter Insurance Claim Form</h3>
            <hr/>
            <Form layout='horizontal' onFinish={onFinish}>
                <div className="ins-form-row">
                    <div className="ins-item">
                        <label htmlFor="name">Full Name:</label>
                        <Form.Item name='name' className="ins-form-item">
                            <Input className='ins-input-field' id="name" placeholder='Full name' />
                        </Form.Item>
            
                        <label htmlFor="id">Employee ID:</label>
                        <Form.Item className="ins-form-item">
                            <Input className='ins-input-field' id="id" placeholder='Employee ID' value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} disabled/>
                        </Form.Item>

                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <Form.Item name='phoneNumber' rules={[{ validator: validatePhoneNumber }]} className="ins-form-item">
                            <Input className='ins-input-field' id="phoneNumber" placeholder='Phone Number' />
                        </Form.Item>

                        <label htmlFor="description">Description:</label>
                        <Form.Item name='description' className="ins-form-item">
                            <Input.TextArea className='ins-textarea-field' id="description" placeholder='Description' />
                        </Form.Item>

                        <label htmlFor="medicaldoc">Attach Medical Document:</label>
                        <Form.Item name="medicaldoc" valuePropName="fileList" getValueFromEvent={(e) => e.fileList} rules={[{ validator: validateFile }]} className="ins-form-item">
                            <Upload name="meddoc" action="/api/insurance/insClaimSubmit" listType="text">
                                <Button className='ins-primary-button' icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                </div>
                <div className="ins-button-container">
                    <Button className='update' htmlType='submit'>SUBMIT</Button>
                </div>
            </Form>
        </Layout>
    );
}

export default InsClaimSubmit;
