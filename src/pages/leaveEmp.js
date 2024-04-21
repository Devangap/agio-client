import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Table, Button, message, Card, Modal, Form, Input, Select, DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import Layout from '../components/Layout';
import { useNavigate, useParams  } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/empalerts';
import { useSelector, useDispatch } from 'react-redux';
import '../leaveEmp.css';
import '../leaveEmpform.css';
import toast from 'react-hot-toast';
import moment from 'moment';
import '../calendar.css';

const LeaveEmp = () => {
    const locales = {
        'en-US': enUS,
    };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });
    const { Option } = Select;
    const [leaveEvents, setLeaveEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [leaveData, setLeaveData] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [leaveType, setLeaveType] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const { id } = useParams();
    const [form] = Form.useForm();

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const holidayEvents = [
        {
          title: 'New Year',
          start: new Date(moment().year(), 0, 1),
          end: new Date(moment().year(), 0, 1),
          allDay: true,
          resource: 'holiday'
        },
        {
          title: 'Christmas',
          start: new Date(moment().year(), 11, 25),
          end: new Date(moment().year(), 11, 25),
          allDay: true,
          resource: 'holiday'
        }
        // Add more holiday events as needed
      ];

    const getData = async () => {
        try {
            const response = await axios.post('/api/employee/get-employee-info-by-id', {}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
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
    const handleUpdateLeave = async (record) => {
        setUpdateModalVisible(true); // Show update modal
        setSelectedEvent(record); // Set selected event for the modal
    };
    
    useEffect(() => {
        const fetchLeave = async () => {
            try {
                if (updateModalVisible && selectedEvent && selectedEvent._id) {
                    const response = await axios.get(`/api/employee/getleave3/${selectedEvent._id}`);
                    if (response.data.success) {
                        const data = response.data.leave;
                        // Set form fields with retrieved leave data
                        form.setFieldsValue({
                            name: data.name,
                            Type: data.Type,
                            startDate: moment(data.startDate),
                            endDate: moment(data.endDate),
                            Description: data.Description,
                        });
                    } else {
                        toast.error('Leave not found!');
                        navigate('/leaveEmp');
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch leave data!');
            }
        };
    
        if (updateModalVisible && selectedEvent) {
            fetchLeave();
        }
    }, [selectedEvent, form, navigate, updateModalVisible]);
   
    

    const fetchLeaveData = async () => {
        try {
            const response = await axios.get('/api/employee/getleavedep', {
                params: {
                    department: user?.department // Pass user's department as query parameter
                }
            });
            const leaveData = response.data.leave;

            const events = leaveData.map((leave) => ({
                id: leave._id,
                userid: leave.userid,
                title: `${leave.name}, ${leave.Type}`,
                start: new Date(leave.startDate),
                end: new Date(leave.endDate),
                Type: leave.Type,
                employeeId: leave.employeeId,
                department: leave.department,
            }));

            setLeaveEvents(events);
        } catch (error) {
            console.error('Error fetching leave data:', error);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, [user?.department]);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                if (selectedEvent && selectedEvent.userid) {
                    const userId = selectedEvent.userid;
                    const response = await axios.get(`/api/employee/getuserfromleave/${userId}`);
                    setEmployeeDetails(response.data.employee);
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };

        fetchEmployeeDetails();
    }, [selectedEvent]);

    useEffect(() => {
        if (user && user.userid) {
            fetchData(user.userid);
        }
    }, [user]);

    const fetchData = async (userid) => {
        try {
            const response = await axios.get(`/api/employee/getleave2/${userid}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });

            dispatch(hideLoading());

            if (response.data && response.data.leave) {
                const leaveRecords = response.data.leave.map(record => ({
                    ...record,
                    department: user.department
                }));

                setLeaveData(leaveRecords);
            } else {
                setLeaveData([]);
                message.info('No leave data available');
            }
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch leave data');
        }
    };

    const eventPropGetter = (event) => {
        let color = 'red';

        if (event.Type === 'Medical') {
            color = '#8884d8';
        } else if (event.Type === 'General') {
            color = '#82ca9d';
        } else if (event.Type === 'Annual') {
            color = '#ffc658';
        }

        return {
            style: {
                backgroundColor: color,
                height: '40px',
            },
        };
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalVisible(true); // Set modal visibility to true when an event is clicked
    };

    const handleClosePopup = () => {
        setSelectedEvent(null);
        setEmployeeDetails(null);
    };

    const handleLeaveSubmission = () => {
        setSubmissionModalVisible(true); // Show submission modal
    };

   

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteleave/${id}`);
            setLeaveData(prev => prev.filter(item => item._id !== id));
            message.success('Leave deleted successfully');
            fetchData(user?.userid);
        } catch (error) {
            message.error('Failed to delete leave');
        }
    };

    const handleCloseModal = () => {
        // Reset selected event and employee details when closing the modal
        setSelectedEvent(null);
        setEmployeeDetails(null);
        setModalVisible(false); // Hide modal
    };

    const handleCloseSubmissionModal = () => {
        setSubmissionModalVisible(false); // Hide submission modal
    };

    const handleCloseUpdateModal = () => {
        // Reset selected event and employee details when closing the modal
        setSelectedEvent(null);
        setEmployeeDetails(null);
        setUpdateModalVisible(false); // Hide update modal
    };

    const onFinish = async (values) => {
        console.log('Received values of form', values);
        try {
            dispatch(showLoading());

            // Create a new FormData instance
            const formData = new FormData();
            // Append each file to FormData
            fileList.forEach(file => {
                formData.append('file', file);
            });
            // Append other form values to FormData
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            // Append user ID to FormData
            formData.append('userid', user?.userid);

            // Make POST request to upload the form data
            const response = await axios.post('/api/employee/leaveEmpform', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            dispatch(hideLoading());

            // Handle response
            if (response.data.success) {
                toast.success(response.data.message);
                setSubmissionModalVisible(false)
                fetchData(user?.userid);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Something went wrong");
        }
    };
    const handleUpdateFinish = async (id, values) => {
        try {
            // Extracting values from individual date pickers
            const startDate = values?.startDate;
            const endDate = values?.endDate;
    
            const updatedValues = {
                ...values,
                startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
                endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
            };
    
            if (id) {
                const response = await axios.put(`/api/employee/updateleave/${id}`, updatedValues); // Corrected the way to pass parameters
                if (response.data.success) {
                    toast.success(response.data.message);
                    navigate('/leaveEmp');
                } else {
                    toast.error(response.data.message);
                }
            } else {
                toast.error('Failed to update leave data: No leave ID found!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update leave data!');
        }
    };
   
    
    
    
    

    const handleBeforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            toast.error('You can only upload PDF files!');
            return false;
        }

        // Get additional information about the file
        const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
        };

        // Log or use the fileInfo object as needed
        console.log('File information:', fileInfo);

        setFileList([file]);
        return false;
    };

    console.log("DEVVVVV" , selectedEvent?._id)

    const handleRemove = () => {
        setFileList([]);
    };

    const validateUploadField = (_, value) => {
        if (value === "Medical") {
            if (fileList.length === 0) {
                return Promise.reject("Please upload a document for medical leave");
            }
        }
        return Promise.resolve();
    };

    const handleLeaveTypeChange = (value) => {
        setLeaveType(value);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => {
                return new Date(text).toLocaleDateString('en-US');
            }
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => {
                return new Date(text).toLocaleDateString('en-US');
            }
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Description',
        },
    
        {
            title: 'Documents',
            dataIndex: 'filePath', // Adjust based on your data structure
            key: 'file',
            render: (_, record) => {
                const filename = record?.file?.filename;

                const backendUrl = 'http://localhost:5001/';

                const filePath = filename ? `${backendUrl}uploads/${filename}` : '';

                // Render a download button if a file exists
                return filename ? (
                    <Button
                        type="link"
                        href={filePath}
                        target="_blank"
                        download={filename} // Add the download attribute
                    >
                        View PDF
                    </Button>
                ) : null;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                   <Button type="primary" className="updateleaveemp" style={{ backgroundColor: '#ffc658' }} onClick={() => handleUpdateLeave(record)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    const leaveTypes = [
        { title: <div style={{ marginLeft: '20px', color: 'rgb(66, 34, 2)' }}>Remaining<br/>General Leaves</div>, description: `${user ? user.general_leave : ''}` },
        { title: <div style={{ marginLeft: '20px', color: 'rgb(66, 34, 2)' }}>Remaining<br/>Annual Leaves</div>, description: `${user ? user.annual_leave : ''}` },
        { title: <div style={{ marginLeft: '20px', color: 'rgb(66, 34, 2)' }}>Remaining<br/>Medical Leaves</div>, description: `${user ? user.medical_leave : ''}` },
    ];
    const allEvents = [...leaveEvents, ...holidayEvents];


    return (
        <Layout>
            <div className="leave-types" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {leaveTypes.map((type, index) => (
                    <Card key={index} className="leave-type-card" title={type.title} bordered={false}>
                            <div className="leave-description" style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#ECB159' }}>{type.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
          
            <div className = 'leavecalcomp'>
            
            

            <div>
            <h3 style={{ color: 'rgb(66, 34, 2)', marginBottom:"30px"}}>Leave Calendar</h3>
                <Calendar
                    localizer={localizer}
                    events={allEvents} // Pass leave events to the calendar
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: 50, fontFamily: 'Patrick Hand' }}
                    eventPropGetter={eventPropGetter} // Set event color based on leave type
                    onSelectEvent={handleEventClick} // Handle event click
                />
            </div>
            </div>
          

            <Modal
                title="Leave Details"
                visible={modalVisible} // Control modal visibility
                onCancel={handleCloseModal} // Handle modal close
                footer={[
                    <Button key="close" onClick={handleCloseModal}>Close</Button>,
                ]}
            >
                <p>Name: {selectedEvent?.title?.split(',')[0]?.trim()}</p>
                <p>Type: {selectedEvent?.title?.split(',')[1]?.trim()}</p>
                {employeeDetails && (
                    <>
                        <p>Employee ID: {employeeDetails.empid}</p>
                        <p>Department: {employeeDetails.department}</p>
                        {/* Add more employee details as needed */}
                    </>
                )}
            </Modal>

            <Modal
                title="Leave Submission Form"
                visible={submissionModalVisible} // Control submission modal visibility
                onCancel={handleCloseSubmissionModal} // Handle submission modal close
                footer={[
                    <Button key="close" onClick={handleCloseSubmissionModal}>Close</Button>,
                ]}
            >
                <div className="leaveform">
                    <div className="leave_formbox p-3">
                        <Form layout='vertical' onFinish={onFinish}>
                            <div className="leave_form-row">
                                <div className="leave_item">
                                    <Form.Item label='Employee Name' name='name'>
                                        <Input placeholder='Employee name' />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="leave_form-row">
                                <div className="leave_item">
                                    <Form.Item
                                        label="Start Date"
                                        name="startDate"
                                        rules={[{ required: false, message: 'Please input!' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                    <Form.Item
                                        label="End Date"
                                        name="endDate"
                                        rules={[{ required: false, message: 'Please input!' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="leave_form-row">
                                <div className="leave_item">
                                    <Form.Item name="Type" label="Select leave type" className='leavet'>
                                        <Select className="leave_Type" placeholder="Select leave type" onChange={handleLeaveTypeChange}>
                                            <Option value="General">General</Option>
                                            <Option value="Annual">Annual</Option>
                                            <Option value="Medical">Medical</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            {leaveType === 'Medical' && ( // Conditionally render Form.Item component
                                <Form.Item
                                    label='Upload Medical Documents'
                                    name='file'
                                    rules={[
                                        { required: true, message: 'Please upload a document' },
                                        { validator: validateUploadField }
                                    ]}
                                    dependencies={['Type']}
                                >
                                    <Upload
                                        beforeUpload={handleBeforeUpload}
                                        onRemove={handleRemove}
                                        fileList={fileList}
                                        listType="picture"
                                    >
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </Form.Item>
                            )}
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
            </Modal>

            <Modal
                title="Update Leave Form"
                visible={updateModalVisible} // Control submission modal visibility
                onCancel={handleCloseUpdateModal} // Handle submission modal close
                footer={[
                    <Button key="close" onClick={handleCloseUpdateModal}>Close</Button>,
                ]}
            >
                <div className="leaveform">
      <div className="leave_formbox p-3">
       
        <Form layout="vertical" form={form} onFinish={handleUpdateFinish}>
        <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item label='Employee Name' name='name'>
                                <Input placeholder='Employee name' />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="leave_form-row">
                    <div className="leave_item">
    <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: false, message: 'Please input!' }]}
    >
        <DatePicker />
    </Form.Item>
    <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: false, message: 'Please input!' }]}
    >
        <DatePicker />
    </Form.Item>
</div>
                    </div>
                    <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item name="Type" label="Select leave type" className='leavet'>
                                <Select className="leave_Type" placeholder="Select leave type" onChange={handleLeaveTypeChange}>
                                    <Option value="General">General</Option>
                                    <Option value="Annual">Annual</Option>
                                    <Option value="Medical">Medical</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    {leaveType === 'Medical' && ( // Conditionally render Form.Item component
                        <Form.Item
                            label='Upload Medical Documents'
                            name='file'
                            rules={[
                                { required: true, message: 'Please upload a document' },
                                { validator: validateUploadField }
                            ]}
                            dependencies={['Type']}
                        >
                            <Upload
                                beforeUpload={handleBeforeUpload}
                                onRemove={handleRemove}
                                fileList={fileList}
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>
                    )}
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
                    <Button className='leave_primary-button my-2' htmlType='submit' onClick={() => handleUpdateFinish(selectedEvent?._id, form.getFieldsValue())}>Update</Button>
                    </div>
                </Form>
            </div>
            </div>
            </Modal>

            <div className='Leaveempdisplay'>
            <button className="leavesub" onClick={handleLeaveSubmission}>Leave Submission</button>
            <Table className="leaveTableemp" dataSource={leaveData} columns={columns} />
            </div>
        </Layout>
    );
};

export default LeaveEmp;

