import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select } from 'antd';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

function TraVehicleRegister() {
  const navigate = useNavigate();
  const [totalSeats, setTotalSeats] = useState(null);
  const [numBuses, setNumBuses] = useState(0);
  const [numVans, setNumVans] = useState(0);

  const onFinish = async (values) => {
    console.log('Received values of form', values);

    try {
      const response = await axios.post('/api/employee/Vehicleregister', values);
      if (response.data.success) {
        toast.success(response.data.message);
        if (values.Type === 'bus') {
          setNumBuses(numBuses + 1);
          setTotalSeats(totalSeats + 50);
        } else if (values.Type === 'van') {
          setNumVans(numVans + 1);
          setTotalSeats(totalSeats + 12);
        }
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
      setTotalSeats(numBuses * 50 + numVans * 12 + 50);
    } else if (value === 'van') {
      setTotalSeats(numBuses * 100 + numVans * 12 + 12);
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
              {totalSeats && (
                <div className="bookform-row">
                  <div className="bookitem">
                    <Form.Item  label="Total Seats" >
                      <Input disabled value={totalSeats} />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>

            <div className="bookform-row">
              <div className="bookitem">
                <Form.Item label="Vehicle Number" name="vehicleNum">
                  <Input placeholder="Vehicle Number" />
                </Form.Item>
              </div>
              <div className="bookitem">
                <Form.Item name="ECDetails" label="Emissions Certificate Details ">
                  <Input.TextArea className="Description" />
                </Form.Item>
              </div>

              <div className="bookitem">
                <Form.Item name="location" label="Select Location">
                  <Select className="Type" placeholder="Select Location">
                    <Option value="Colombo">Colombo</Option>
                    <Option value="Ja-ela">Ja-ela</Option>
                    <Option value="Kollupitiya">Kollupitiya</Option>
                    <Option value="Negambo">Negambo</Option>
                    <Option value="Panadura">Panadura</Option>
                    <Option value="Kaduwela">Kaduwela</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            
            <div className="bookitem">
              <Form.Item name="LicenceDetails" label="Licence Details">
                <Input.TextArea className="Description" />
              </Form.Item>
            </div>
            
            <div className="bookitem">
              <Form.Item name="OwnerDetails" label="Owner Details">
                <Input.TextArea className="Description" />
              </Form.Item>
            </div>
            
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
