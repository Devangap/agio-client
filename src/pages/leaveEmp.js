import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout'
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { showLoading,hideLoading } from '../redux/empalerts';
import { useSelector, useDispatch } from 'react-redux'; 

import { useParams } from 'react-router-dom';

function LeaveEmp() {
    const {user} = useSelector((state) => state.user);
    const [leaveData, setLeaveData] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
   
   

    useEffect(() => {
        if (user && user.userid) {
            fetchData(user.userid);
        }
    }, [user]); // Fetch data when user object changes

    const fetchData = async (userid) => {
        try {
            dispatch(showLoading());
            const response = await axios.get(`/api/employee/getleave2/${userid}`, {
                headers: {
                    Authorization: 'Bearer ' + token // Pass token as a parameter
                },
            });
            dispatch(hideLoading());
            setLeaveData(response.data.leave); // Assuming response.data.leave is an array of objects
        } catch (error) {
            console.error(error); // Log the error for debugging
            message.error('Failed to fetch leave data');
        }
    };



  
    const handleLeaveSubmission = () => {
        navigate('/leaveEmpform');
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteleave/${id}`);
            setLeaveData(prev => prev.filter(item => item._id !== id));
            message.success('Announcement deleted successfully');
        } catch (error) {
            message.error('Failed to delete announcement');
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
                    <Button type="primary" className="update" onClick={() => navigate(`/leaveUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
        // Define your table columns here
    ];

    return (
        <Layout>
            <div>
                <button className="leavesub" onClick={handleLeaveSubmission}>Leave Submission</button>
            </div>
            <Table dataSource={leaveData} columns={columns} />
        </Layout>
    );
}

export default LeaveEmp;
