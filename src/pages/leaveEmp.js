import React, { useEffect, useState } from 'react';
import { Table, Button, message ,Card} from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/empalerts';
import { useSelector, useDispatch } from 'react-redux';

function LeaveEmp() {
    const [employeeData, setEmployeeData] = useState(null);
    const { user } = useSelector((state) => state.user);
    const [leaveData, setLeaveData] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const getData = async () => {
        try {
            const response = await axios.post('/api/employee/get-employee-info-by-id', {} , {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            });
            setEmployeeData(response.data.data); // Update employeeData state with response data
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (user && user.userid) {
            fetchData(user.userid);
        }
    }, [user]);
    

    const fetchData = async (userid) => {
        try {
          console.log(userid)
            const response = await axios.get(`/api/employee/getleave2/${userid}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
    
            // Check if response data contains leave information
            if (response.data && response.data.leave) {
                // If leave data is available, set it in the state
                setLeaveData(response.data.leave);
            } else {
                // If leave data is not available, set the state to an empty array or default value
                setLeaveData([]);
                // You can also display a message to the user indicating that no leave data is available
                message.info('No leave data available');
            }
        } catch (error) {
            console.error(error);
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
            message.success('Leave deleted successfully');
        } catch (error) {
            message.error('Failed to delete leave');
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
    ];

    const leaveTypes = [
        { title: 'General Leave', description: `Available Leaves: ${employeeData ? employeeData.general_leave : ''}` },
        { title: 'Annual Leave', description: `Available Leaves: ${employeeData ? employeeData.annual_leave : ''}` },
        { title: 'Medical Leave', description: `Available Leaves: ${employeeData ? employeeData.medical_leave : ''}` },
    ];

    return (
        <Layout>
            
            <div className="leave-types" style={{ display: 'flex', justifyContent: 'space-between' }}>
                {leaveTypes.map((type, index) => (
                    <Card key={index} className="leave-type-card" title={type.title} bordered={false}>
                        <p>{type.description}</p>
                    </Card>
                ))}
            </div>
            <div>
                <button className="leavesub" onClick={handleLeaveSubmission}>Leave Submission</button>
            </div>
            <Table dataSource={leaveData} columns={columns} />
            
        </Layout>
    );
}

export default LeaveEmp;
