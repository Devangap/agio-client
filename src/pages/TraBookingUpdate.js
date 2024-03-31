import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'; // Remove useHistory
import moment from 'moment';

function TraBookingUpdate() {
    const { id } = useParams();
    const { Option } = Select;
    const [form] = Form.useForm();
    const [bookings, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`/api/TransportRoute/getTraBooking2/${id}`);
                if (response.data.success) {
                    setBooking(response.data.bookings);
                    form.setFieldsValue({
                        empname: response.data.bookings.empname,
                        empemail: response.data.bookings.empemail,
                        Type: response.data.bookings.Type,
                        bookingdate: moment(response.data.bookings.bookingdate),
                        Description: response.data.bookings.Description,
                    });
                } else {
                    toast.error('Booking not found!');
                    // Replace useHistory with window.location.replace as a fallback
                    window.location.replace('/TraBookingDisplay');
                }
            } catch (error) {
                toast.error('Failed to fetch Booking data!');
            }
        };

        fetchBooking();
    }, [id, form]);

    const onFinish = async (values) => {
        const updatedValues = {
            ...values,
            bookingdate: values.bookingdate.format('YYYY-MM-DD'),
        };

        try {
            const response = await axios.put(`/api/TransportRoute/updateTraBooking/${id}`, updatedValues);
            if (response.data.success) {
                toast.success(response.data.message);
                window.location.replace('/TraBookingDisplay'); // Use window.location.replace as a fallback
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (!bookings) {
        return null; // or display loading indicator
    }

    return (
        <Layout>
            <div className="annform">
                <div className="AnnHRSup_form box p-3">
                    <h3 className='title'>Update Booking Details</h3>
                    <Form layout='vertical' form={form} onFinish={onFinish}>
                    <div className="form-row">
              <div className="item">
                <Form.Item label='Employee Name' name='empname'>
                  <Input placeholder='Employee Name' />
                </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
              <Form.Item label='Employee Email' name='empemail'>
                  <Input placeholder='Employee Email' />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item name="Type" label="Type">
                  <Select className="Type" placeholder="Select announcement type">
                    <Option value="General">Bus</Option>
                    <Option value="Specific">Van</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
                <Form.Item label="Booking Date" name="bookingdate">
                  <DatePicker className="date" />
                </Form.Item>
              </div>
            </div>

            <div className="item">
              <Form.Item name="Description" label="Description">
                <Input.TextArea className='Description' />
              </Form.Item>
            </div>

            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Update</Button>
            </div>
                    </Form>
                </div>
            </div>
        </Layout>
    );
}

export default TraBookingUpdate;
