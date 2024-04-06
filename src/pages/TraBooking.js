import React, { useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Upload, message } from 'antd';
import "../leaveEmpform.css";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useDispatch ,useSelector} from 'react-redux';
import { showLoading ,hideLoading} from '../redux/empalerts';
import { setUser } from '../redux/userSlice';
import Layout from '../components/Layout';

function TraBooking() {

  const { RangePicker } = DatePicker;
    const { Option } = Select;
    const [userData, setUserData] = useState({}); 

    const navigate = useNavigate();
    const {user} = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const getData = async () => {
    try {
        const response = await axios.post('/api/employee/get-employee-info-by-id', {} , {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
        });
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

useEffect(() => {
    getData();
}, []);
    const onFinish = async (values) => {
        console.log('Received values of form', values);
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/TraBooking', {...values , userid : user?.userid,}
           
           , {headers:{
            Authorization :`Bearer ${localStorage.getItem("token")}`,
           },

            });
            dispatch(hideLoading());
            if(response.data.success){
                navigate("/TraBookingDisplay")
               
                
            }else{
                toast.error(response.data.message);
      
            }
            
        } catch (error) {
          dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };
    console.log(user?.userid);

    return <Layout>
    <div className="annform">
  <div className="AnnHRSup_form box p-3">
    <h3 className='title'>BOOKING TRANSPORT</h3>
    <Form layout='vertical' onFinish={onFinish}>
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
        <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
      </div>
    </Form>
  </div>
</div>
  
  </Layout>
}


export default TraBooking