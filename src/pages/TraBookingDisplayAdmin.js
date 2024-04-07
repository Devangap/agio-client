import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';
import toast from 'react-hot-toast';


function TraBookingDisplayAdmin() {
    const [booking, setbooking] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const fetchbooking = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/employee/getTraBooking', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
            setbooking(response.data.bookings);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch leave data');
        }
    };

    useEffect(() => {
        fetchbooking();
    }, []);



  /*  const handleLeaveCount = async (record) => {
        try {
            // Fetch the leave data using the leaveid
            const responseLeave = await axios.get(`/api/employee/getleave3/${record._id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
    
            if (!responseLeave.data.success) {
                toast.error("Failed to fetch leave data.");
                return;
            }
    
            const leaveData = responseLeave.data.leave;
            const leave = leaveData; // Assuming the leave data is returned as an object
    
            // Check if the leave type is "Medical"
            if (leave.Type === 'Medical') {
                // If it's a medical leave, deduct one from the medical_leave field
                const responseDeduct = await axios.post(
                    '/api/employee/deduct_medical_leave',
                    { userid: record.userid },
                    {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    }
                );
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting medical leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else {
                toast.error("Leave is not of type Medical.");
            }
        } catch (error) {
            toast.error("Error deducting medical leave.");
        }
    };*/

    const changestatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/change_status', {
                bookingid: record._id,
                userid: record.userid,
                status: status
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                fetchbooking();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            toast.error("Error changing status.");
        }
    };

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'EmpName',
            key: 'EmpName',
        },
        {
            title: 'Employee Email',
            dataIndex: 'EmpEmail',
            key: 'EmpEmail',
        },

        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        
        {
            title: 'Booking Date',
            dataIndex: 'bookingdate',
            key: 'bookingdate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        
        {
            title: 'Description',
            dataIndex: 'Details',
            key: 'Details',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Description',
        },
        
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <div className="d-flex">
                        {record.status === "pending" && <Button type="primary" className="approve" onClick={() => { changestatus(record, 'approved'); }}>Approve</Button>}
                        {record.status === "approved" && <Button type="primary" className="reject" onClick={() => changestatus(record, 'rejected')}>Reject</Button>}
                    </div>
                    <Button type="primary">Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Layout>


            <Table dataSource={booking} columns={columns} />
        </Layout>
    );

}

export default TraBookingDisplayAdmin