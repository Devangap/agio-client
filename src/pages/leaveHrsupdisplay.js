import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';
import toast from 'react-hot-toast';

function LeaveHrsupdisplay() {
    const [leaveData, setLeaveData] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/employee/getleave', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
            setLeaveData(response.data.leave);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch leave data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredData = leaveData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const changeLeaveCount = async (record) => {
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
                // If it's a medical leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the medical_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountmed', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting medical leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else if (leave.Type === 'Annual') {
                // If it's an annual leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the annual_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountannual', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting annual leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else if (leave.Type === 'General') {
                // If it's a general leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the general_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountgeneral', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting general leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else {
                toast.error("Leave is not of type Medical, Annual, or General.");
            }
        } catch (error) {
            toast.error("Error deducting leave.");
        }
    };

    const changestatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/change_status', {
                leaveid: record._id,
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
                fetchData();
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'RangePicker',
            dataIndex: 'RangePicker',
            key: 'RangePicker',
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <div className="d-flex">
                        {record.status === "pending" && <Button type="primary" className="approve" onClick={() => { changestatus(record, 'approved'); changeLeaveCount(record); }}>Approve</Button>}
                        {record.status === "approved" && <Button type="primary" className="reject" onClick={() => changestatus(record, 'rejected')}>Reject</Button>}
                    </div>
                    <Button type="primary">Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Input.Search
                placeholder="Search by name"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200, marginBottom: 16 }}
            />
           <Table dataSource={filteredData} columns={columns} />
        </Layout>
    );
}

export default LeaveHrsupdisplay;