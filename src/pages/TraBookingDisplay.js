import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TraBookingDisplay() {
    const { user } = useSelector((state) => state.user);
    const [booking, setBooking] = useState([]);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const navigate = useNavigate();

    const fetchBooking = async (userId) => {
        try {
            const response = await axios.get(`/api/employee/getTraBooking3/${userId}`);
            console.log('Booking API Response:', response.data);

            if (response.data && response.data.bookings) {
                // Calculate remaining seats and update booking data
                const updatedBookings = response.data.bookings.map((booking) => ({
                    ...booking,
                    remainingSeats: booking.Type === 'Bus' ? 50 - response.data.bookings.filter((b) => b.Type === 'Bus').length : 12 - response.data.bookings.filter((b) => b.Type === 'Van').length
                }));
                setBooking(updatedBookings);
            } else {
                setBooking([]);
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

    const showDescriptionModal = (description) => {
        setSelectedDescription(description);
        setDescriptionModalVisible(true);
    };

    const handleDelete = async (bookingId) => {
        try {
            const response = await axios.delete(`/api/employee/deleteTraBooking/${bookingId}`);
            if (response.data && response.data.success) {
                message.success('Booking deleted successfully');
                // Refetch booking data after deletion
                fetchBooking(user.userid);
            } else {
                message.error('Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            message.error('Failed to delete booking');
        }
    };

    // user booking columns
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
            render: (text) => (
                <>
                    {text.length > 10 ? (
                        <span>
                            {text.substring(0, 10)}...
                            <Button type="link" onClick={() => showDescriptionModal(text)}>See more</Button>
                        </span>
                    ) : (
                        text
                    )}
                </>
            ),
        },
        {
            title: 'Remaining Seats',
            dataIndex: 'remainingSeats',
            key: 'remainingSeats',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/TraBookingUpdate/${record._id}`)}>Update</Button>
                    {record.status === 'approved' ? (
                        <Button type="primary" className="pybtn" onClick={() => navigate(`/TraPayment`)}>Upload</Button>
                    ) : (
                        <Button type="primary" className="pybtn" disabled>Upload</Button>
                    )}
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Table dataSource={booking} columns={columns} />

            <Modal
                title="Description"
                visible={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
            >
                <p>{selectedDescription}</p>
            </Modal>
        </Layout>
    );
}

export default TraBookingDisplay;
