import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TraBookingDisplay() {
    const { user } = useSelector((state) => state.user);
    const [booking, setbooking] = useState([]);
    
    const navigate = useNavigate();

    const fetchBooking = async (userId) => {
        try {
            const response = await axios.get(`/api/employee/getTraBooking3/${userId}`);
            console.log('Booking API Response:', response.data);

            if (response.data && response.data.bookings) {
                setbooking(response.data.bookings);
            } else {
                setbooking([]);
                message.info('No booking data available');
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            message.error('Failed to fetch booking data');
        }
    };



    useEffect(() => {
        if (user && user.userid) {
            fetchBooking(user.userid);
        }
        
    }, [user]);


    const handleLeaveSubmission = () => {
        navigate('/TraBooking');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deletebooking/${id}`);
            setbooking(prev => prev.filter(item => item._id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete booking');
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
            title: 'Select Location',
            dataIndex: 'location',
            key: 'location',
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
                    <Button type="primary" className="update" onClick={() => navigate(`/TraBookingUpdate/${record._id}`)}>Update</Button>
                    <Button type="primary" className="update" onClick={() => navigate(`/TraPayment`)}>Upload</Button>
                    <Button type="primary" className="update" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                    
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

export default TraBookingDisplay;
