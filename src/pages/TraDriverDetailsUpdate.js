import React, { useEffect} from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker} from 'antd';
import AnnLayout from '../pages/AnnLayout';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function TraDriverDetailsUpdate() {
  
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router-dom v5 or v6
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
  const fetchDregister = async () => {
    try {
      const response = await axios.get(`/api/TransportRoute/getdriver2/${id}`);
      if (response.data.success) {
        const data = response.data.Dregisters;
        form.setFieldsValue({
          driName: data.driName,
          driEmail: data.driEmail,
          Type: data.Type,
          regdate: moment(data.regdate),
          driPnum: data.driPnum,
        });
      } else {
        toast.error('Announcement not found!');
        navigate('/TraDriverDetailsDisplay');
      }
    } catch (error) {
      toast.error('Failed to fetch announcement data!');
    }
  };

  fetchDregister();
}, [id, form, navigate]);

const onFinish = async (values) => {
  console.log('Received values of form: ', values);
  const updatedValues = {
    ...values,
    uploaddate: values.uploaddate.format('YYYY-MM-DD'),
    
  };

  try {
    const response = await axios.put(`/api/TransportRoute/updatedriver/${id}`, updatedValues);
    if (response.data.success) {
      toast.success(response.data.message);
      navigate('/TraDriverDetailsDisplay');
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
          <h3 className='title'>Update Driver Details</h3>
          <Form layout='vertical' form={form} onFinish={onFinish}>
            <div className="form-row">
              <div className="item">
                <Form.Item label='Driver Name' name='driName'>
                  <Input placeholder='Driver Name' />
                </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
              <Form.Item label='Driver Email' name='driEmail'>
                  <Input placeholder='Driver Email' />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item name="Type" label="Work Expereance">
                  <Select className="Type" placeholder="Work Expereance">
                    <Option value="Bus">Bus</Option>
                    <Option value="Van">Van</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
                <Form.Item label="select Register Date" name="regdate">
                  <DatePicker className="regdate" />
                </Form.Item>
              </div>
            </div>

            <div className="item">
              <Form.Item name="Driver PhoneNumber" label="driPnum">
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

export default TraDriverDetailsUpdate