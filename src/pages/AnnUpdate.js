import React, { useEffect} from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker} from 'antd';
import AnnLayout from '../pages/AnnLayout';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function AnnUpdate() {
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router-dom v5 or v6
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`/api/annWorkouts/getAnnHRsup2/${id}`);
        if (response.data.success) {
          const data = response.data.announcement;
          form.setFieldsValue({
            anntitle: data.anntitle,
            uploaddate: moment(data.uploaddate),
            Type: data.Type,
            expiredate: moment(data.expiredate),
            Description: data.Description,
          });
        } else {
          toast.error('Announcement not found!');
          navigate('/AnnDisplay');
        }
      } catch (error) {
        toast.error('Failed to fetch announcement data!');
      }
    };

    fetchAnnouncement();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const updatedValues = {
      ...values,
      uploaddate: values.uploaddate.format('YYYY-MM-DD'),
      expiredate: values.expiredate.format('YYYY-MM-DD'),
    };

    try {
      const response = await axios.put(`/api/annWorkouts/updateAnnHRsup/${id}`, updatedValues);
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

  return (
    <AnnLayout>
      <div className="annform">
        <div className="AnnHRSup_form box p-3">
          <h3 className='title'>Update an Announcement</h3>
          <Form layout='vertical' form={form} onFinish={onFinish}>
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
    </AnnLayout>
  );
}

export default AnnUpdate;
