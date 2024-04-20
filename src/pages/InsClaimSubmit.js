import React from 'react';
import { Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function InsClaimSubmit() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            if (values.medicaldoc && Array.isArray(values.medicaldoc) && values.medicaldoc.length > 0) {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('id', values.id);
                formData.append('phoneNumber', values.phoneNumber);
                formData.append('file', values.medicaldoc[0].originFileObj); // Access the file object using originFileObj

                const response = await axios.post("/api/insurance/insClaimSubmit", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    toast.success(response.data.message);
                    toast("Redirecting to Employee Insurance Claim Request page");
                    navigate("/InsEmployee");
                } else {
                    toast.error(response.data.message);
                }
            } else {
                toast.error("Please upload a medical document.");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    return (
        <div className="inquiry-container">
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
                                    <Input placeholder='Employee ID' />
                                </Form.Item>
                                <Form.Item label='Phone Number' name='phoneNumber'>
                                    <Input placeholder='Phone Number' />
                                </Form.Item>
                                <Form.Item label='Attach Medical Document' name="medicaldoc" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
                                    <Upload name="meddoc" action="/api/insurance/insClaimSubmit" listType="text">
                                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                    </Upload>
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
