import React, { useEffect} from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, DatePicker} from 'antd';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function TraVehicleDetailsUpdate() {

  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you're using react-router-dom v5 or v6
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchVregister = async () => {
      try {
        const response = await axios.get(`/api/employee/getVehicles2/${id}`);
        if (response.data.success) {
          const data = response.data.VehicleRegister;
          form.setFieldsValue({
            Type: data.Type,
            vehicleNum: data.vehicleNum,
            ECDetails: data.ECDetails,
            LicenceDetails: data.LicenceDetails,
            OwnerDetails: data.OwnerDetails,
          });
        } else {
          toast.error('Announcement not found!');
          navigate('/TraVehicleDetails');
        }
      } catch (error) {
        toast.error('Failed to fetch announcement data!');
      }
    };

    fetchVregister();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const updatedValues = {
      ...values,
      // Convert bookingdate to the desired format if necessary
      
    };

    try {
      const response = await axios.put(`/api/employee/updatevehicles/${id}`, updatedValues);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/TraVehicleDetails'); // Navigate to the desired page after successful update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="annform">
        <div className="AnnHRSup_form box p-3">
          <h3 className='title'>Update Booking Details</h3>
          <Form layout='vertical' form={form} onFinish={onFinish}>
            <div className="form-row">
              <div className="item">
              <Form.Item name="Type" label="Type">
              <Select className="Vehicle Type" placeholder="Select Vehicle type">
                <Option value="bus">Bus</Option>
                <Option value="van">Van</Option>
              </Select>
            </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
              <Form.Item label='Vehicle Number' name='vehicleNum'>
              <Input placeholder='Vehicle Number' />
            </Form.Item>
              </div>
              <div className="item">
              <Form.Item name="ECDetails" label="Emissions Certificate Details ">
            <Input.TextArea className='Description' />
          </Form.Item>
              </div>
            </div>

            <div className="form-row">
              <div className="item">
              <Form.Item name="LicenceDetails" label="Licence Details">
            <Input.TextArea className='Description' />
          </Form.Item>
              </div>
            </div>

            <div className="item">
            <Form.Item name="OwnerDetails" label="Owner Details">
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
  )
}

export default TraVehicleDetailsUpdate