import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select } from 'antd';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function TraVehicleRegister() {
  const navigate = useNavigate();
  const [numSeats, setNumSeats] = useState(null);

  const onFinish = async (values) => {
    console.log('Received values of form', values);

    try {
      const response = await axios.post('/api/employee/Vehicleregister', values);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/TraVehicleDetails');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleVehicleTypeChange = (value) => {
    if (value === 'bus') {
      setNumSeats(50);
    } else if (value === 'van') {
      setNumSeats(12);
    }
  };

  return (
    <Layout>
      <div className="bookform">
        <div className="book_form box p-3">
          <h3 className="booktitle">CREATE VEHICLE ACCOUNT</h3>
          <Form layout="vertical" onFinish={onFinish}>
            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item name="Type" label="Type">
                  <Select
                    className="Vehicle Type"
                    placeholder="Select Vehicle type"
                    onChange={handleVehicleTypeChange}
                  >
                    <Option value="bus">Bus</Option>
                    <Option value="van">Van</Option>
                  </Select>
                </Form.Item>
              </div>
              {numSeats && (
                <div className="bookform-row">
                  <div className="bookitem">
                    <Form.Item  label="Number of Seats" >
                      <Input disabled value={numSeats} />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>

            {/* Other form items... */}
            
            <div className="bookButton-cons">
              <Button className="bookprimary-button my-2" htmlType="submit">
                Submit
              </Button>
              <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraVehicleDetails`)}>View Details</Button>
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

export default TraVehicleRegister;
