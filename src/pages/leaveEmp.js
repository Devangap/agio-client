import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout'
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { UseSelector } from 'react-redux';

function LeaveEmp() {
    const [leaveData, setLeaveData] = useState([]);
    const navigate = useNavigate();
   


    const fetchData = async () => {
        try {
            const response = await axios.get('/api/leave/getleave', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            });
            setLeaveData(response.data.leave); // Assuming response.data.leave is an array of objects
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLeaveSubmission = () => {
        navigate('/leaveEmpform');
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/annWorkouts/deleteAnnHRsup/${id}`);
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
