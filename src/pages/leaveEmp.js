import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Table, Button, message, Card ,Modal} from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/empalerts';
import { useSelector, useDispatch } from 'react-redux';
import '../leaveEmp.css';

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

    const [leaveEvents, setLeaveEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [leaveData, setLeaveData] = useState([]);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    useEffect(() => {
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

        fetchLeaveData();
    }, [user?.department]);
    console.log(user?.department)


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
        let color = '#8884d8';

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
        navigate('/leaveEmpform');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteleave/${id}`);
            setLeaveData(prev => prev.filter(item => item._id !== id));
            message.success('Leave deleted successfully');
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
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
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
                        Download PDF
                    </Button>
                ) : null;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/leaveUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    

    const leaveTypes = [
        { title: 'General Leave', description: `Available Leaves: ${user ? user.general_leave : ''}` },
        { title: 'Annual Leave', description: `Available Leaves: ${user ? user.annual_leave : ''}` },
        { title: 'Medical Leave', description: `Available Leaves: ${user ? user.medical_leave : ''}` },
    ];

    return (
        <Layout>
            <h1>Leave Calendar</h1>
            <button className="leavesub" onClick={handleLeaveSubmission}>Leave Submission</button>

            <div>
            <Calendar
                    localizer={localizer}
                    events={leaveEvents} // Pass leave events to the calendar
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: 50, fontFamily: 'Patrick Hand' }}
                    eventPropGetter={eventPropGetter} // Set event color based on leave type
                    onSelectEvent={handleEventClick} // Handle event click
                />
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

            <div className="leave-types" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {leaveTypes.map((type, index) => (
                    <Card key={index} className="leave-type-card" title={type.title} bordered={false}>
                        <p>{type.description}</p>
                    </Card>
                ))}
            </div>

            <Table dataSource={leaveData} columns={columns} />
        </Layout>
    );
};

export default LeaveEmp;
