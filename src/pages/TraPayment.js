import React from 'react';
import { Button, Form, Upload, message } from 'antd';
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import '../Tra.css';
import Layout from '../components/Layout';

function TraPayment() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('file', values.medicaldoc[0].originFileObj);

            const response = await axios.post("/api/employee/PaymentUpload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + token,
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate(`/TraBookingDisplay`)
                
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
            <div className='payH'>
                <h3>UPLOAD PAYMENT SLIP</h3>
            </div>
            <div className='PayD'>
                <h4>Angio Company Bank Details</h4>
                <ul>
                    <li>Bank name: Bank Of Celone</li>
                    <li>Account Nunber : 5647483</li>
                    <li>Account Name : Angio</li>
                    <li>Branch : Malabe</li>
                </ul>
            </div>
            <Form onFinish={onFinish}>
                <div className='input_file'>
                    <label className="bank_attch" htmlFor="medicaldoc">Attach Paymenet Slip:</label>
                    <Form.Item name="medicaldoc" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button className='upbtn' icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                </div>
                <div className="sbtn">
                    <Button className='sbbtn' htmlType='submit' >SUBMIT</Button>
                </div>
            </Form>
        </Layout>
    );
}

export default TraPayment;