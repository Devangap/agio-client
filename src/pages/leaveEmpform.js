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

function LeaveEmpform() {
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
            const response = await axios.post('/api/employee/leaveEmpform', {...values , userid : user?.userid,}
           
           , {headers:{
            Authorization :`Bearer ${localStorage.getItem("token")}`,
           },

            });
            dispatch(hideLoading());
            if(response.data.success){
                navigate("/leaveEmp")
               
                
            }else{
                toast.error(response.data.message);
      
            }
            
        } catch (error) {
          dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };
    console.log(user?.userid);

    return (
        <div className="leaveform">
            <div className="leave_formbox p-3">
                <h3 className='leave_title'>Leave Submission Form</h3>
                <Form layout='vertical' onFinish={onFinish}>
                    <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item label='Employee Name' name='name'>
                                <Input placeholder='Employee name' />
                            </Form.Item>
                        </div>
                        <div className="leave_item">
                            <Form.Item label='Department' name='department'>
                                <Input placeholder='Department' />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item
                                label="Leave Duration"
                                name="RangePicker"
                                rules={[{ required: false, message: 'Please input!' }]}
                            >
                                <RangePicker />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item name="Type" label="Select leave type" className='leavet'>
                                <Select className="leave_Type" placeholder="Select leave type">
                                    <Option value="General">General</Option>
                                    <Option value="Specific">Annual</Option>
                                    <Option value="Medical">Medical</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="leave_form-row">
                        <div className="leave_item">
                      
                        </div>
                    </div>
                    <div className="leave_item">
                        <Form.Item name="Description" label="Description">
                            <Input.TextArea className='leave_Description' />
                        </Form.Item>
                    </div>
                    <div className="leave_Button-cons">
                    
                        <Button className='leave_primary-button my-2' htmlType='submit'>Submit</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default LeaveEmpform;