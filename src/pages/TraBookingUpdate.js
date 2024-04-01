import React, { useEffect} from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker} from 'antd';
import AnnLayout from '../pages/AnnLayout';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function TraBookingUpdate() {

  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router-dom v5 or v6
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchbookings = async () => {
      try {
        const response = await axios.get(`/api/TransportRoute/getTraBooking2/${id}`);
        if (response.data.success) {
          const data = response.data.Booking;
          form.setFieldsValue({
            EmpName: data.EmpName,
            EmpEmail: data.EmpEmail,
            Type: data.Type,
            bookingdate: moment(data.bookingdate),
            Details: data.Details,
          });
        } else {
          toast.error('Announcement not found!');
          navigate('/TraBookingDisplay');
        }
      } catch (error) {
        toast.error('Failed to fetch announcement data!');
      }
    };

    fetchbookings();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const updatedValues = {
      ...values,

      bookingdate: values.bookingdate.format('YYYY-MM-DD'),
      
    };

    try {
      const response = await axios.put(`/api/TransportRoute/updateTraBooking/${id}`, updatedValues);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/TraBookingDisplay');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AnnLayout>
      <div className="annform">
        <div className="AnnHRSup_form box p-3">
          <h3 className='title'>Update Booking Details</h3>
          <Form layout='vertical' form={form} onFinish={onFinish}>
            <div className="form-row">
              <div className="item">
                <Form.Item label='Employee Name' name='EmpName'>
                  <Input placeholder='Employee Name' />
                </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
              <Form.Item label='Employee Email' name='EmpEmail'>
            <Input placeholder='Employee Email' />
          </Form.Item>
              </div>
              <div className="item">
              <Form.Item name="Type" label="Type">
            <Select className="Type" placeholder="Select Vehicle type">
              <Option value="Bus">Bus</Option>
              <Option value="Van">Van</Option>
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
            <Form.Item name="Details" label="Any Other Details">
          <Input.TextArea className='Description' />
        </Form.Item>
            </div>

            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Update</Button>
            </div>
          </Form>
        </div>
      </div>
    </AnnLayout>
  )
}

export default TraBookingUpdate