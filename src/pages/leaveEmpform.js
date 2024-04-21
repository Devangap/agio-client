// import React, { useEffect, useState } from 'react';
// import { Button, Form, Input, Select, DatePicker, Upload } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import "../leaveEmpform.css";
// import axios from "axios";
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { showLoading, hideLoading } from '../redux/empalerts';

// function LeaveEmpform() {
//     const { RangePicker } = DatePicker;
//     const { Option } = Select;
//     const [fileList, setFileList] = useState([]);
//     const [leaveType, setLeaveType] = useState('');

//     const [userData, setUserData] = useState({});

//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.user);
//     const dispatch = useDispatch();
//     const getData = async () => {
//         try {
//             const response = await axios.post('/api/employee/get-employee-info-by-id', {}, {
//                 headers: {
//                     Authorization: 'Bearer ' + localStorage.getItem('token')
//                 },
//             });
//             console.log(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         getData();
//     }, []);

//     const onFinish = async (values) => {
//         console.log('Received values of form', values);
//         try {
//             dispatch(showLoading());
    
//             // Create a new FormData instance
//             const formData = new FormData();
//             // Append each file to FormData
//             fileList.forEach(file => {
//                 formData.append('file', file);
//             });
//             // Append other form values to FormData
//             Object.keys(values).forEach(key => {
//                 formData.append(key, values[key]);
//             });
//             // Append user ID to FormData
//             formData.append('userid', user?.userid);
    
//             // Make POST request to upload the form data
//             const response = await axios.post('/api/employee/leaveEmpform', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
    
//             dispatch(hideLoading());
    
//             // Handle response
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 navigate("/leaveEmp");
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             dispatch(hideLoading());
//             toast.error("Something went wrong");
//         }
//     };
//     const handleBeforeUpload = (file) => {
//         const isPDF = file.type === 'application/pdf';
//         if (!isPDF) {
//             toast.error('You can only upload PDF files!');
//             return false;
//         }
    
//         // Get additional information about the file
//         const fileInfo = {
//             name: file.name,
//             type: file.type,
//             size: file.size,
//         };
    
//         // Log or use the fileInfo object as needed
//         console.log('File information:', fileInfo);
    
//         setFileList([file]);
//         return false;
//     };

//     const handleRemove = () => {
//         setFileList([]);
//     };

//     const validateUploadField = (_, value) => {
//         if (value === "Medical") {
//             if (fileList.length === 0) {
//                 return Promise.reject("Please upload a document for medical leave");
//             }
//         }
//         return Promise.resolve();
//     };

//     const handleLeaveTypeChange = (value) => {
//         setLeaveType(value);
//     };

//     return (
//         <div className="leaveform">
//             <div className="leave_formbox p-3">
//                 <h3 className='leave_title'>Leave Submission Form</h3>
//                 <Form layout='vertical' onFinish={onFinish}>
//                     <div className="leave_form-row">
//                         <div className="leave_item">
//                             <Form.Item label='Employee Name' name='name'>
//                                 <Input placeholder='Employee name' />
//                             </Form.Item>
//                         </div>
//                     </div>
//                     <div className="leave_form-row">
//                     <div className="leave_item">
//     <Form.Item
//         label="Start Date"
//         name="startDate"
//         rules={[{ required: false, message: 'Please input!' }]}
//     >
//         <DatePicker />
//     </Form.Item>
//     <Form.Item
//         label="End Date"
//         name="endDate"
//         rules={[{ required: false, message: 'Please input!' }]}
//     >
//         <DatePicker />
//     </Form.Item>
// </div>
//                     </div>
//                     <div className="leave_form-row">
//                         <div className="leave_item">
//                             <Form.Item name="Type" label="Select leave type" className='leavet'>
//                                 <Select className="leave_Type" placeholder="Select leave type" onChange={handleLeaveTypeChange}>
//                                     <Option value="General">General</Option>
//                                     <Option value="Annual">Annual</Option>
//                                     <Option value="Medical">Medical</Option>
//                                 </Select>
//                             </Form.Item>
//                         </div>
//                     </div>
//                     {leaveType === 'Medical' && ( // Conditionally render Form.Item component
//                         <Form.Item
//                             label='Upload Medical Documents'
//                             name='file'
//                             rules={[
//                                 { required: true, message: 'Please upload a document' },
//                                 { validator: validateUploadField }
//                             ]}
//                             dependencies={['Type']}
//                         >
//                             <Upload
//                                 beforeUpload={handleBeforeUpload}
//                                 onRemove={handleRemove}
//                                 fileList={fileList}
//                                 listType="picture"
//                             >
//                                 <Button icon={<UploadOutlined />}>Select File</Button>
//                             </Upload>
//                         </Form.Item>
//                     )}
//                     <div className="leave_form-row">
//                         <div className="leave_item">
//                         </div>
//                     </div>
//                     <div className="leave_item">
//                         <Form.Item name="Description" label="Description">
//                             <Input.TextArea className='leave_Description' />
//                         </Form.Item>
//                     </div>
//                     <div className="leave_Button-cons">
//                         <Button className='leave_primary-button my-2' htmlType='submit'>Submit</Button>
//                     </div>
//                 </Form>
//             </div>
//         </div>
//     )
// }

// export default LeaveEmpform;

