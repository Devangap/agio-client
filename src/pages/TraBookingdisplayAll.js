import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TraBookingdisplayAll() {
    const { user } = useSelector((state) => state.user);
    const [booking, setBooking] = useState([]);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const navigate = useNavigate();

    // Static total seats for each vehicle type
    const totalSeats = { Bus: 100, Van: 24 };

    // State variables to hold remaining seats for each vehicle type
    const [remainingSeats, setRemainingSeats] = useState({ Bus: 100, Van: 24 });

    // Function to reset remaining seats to total seats
    const resetRemainingSeats = () => {
        setRemainingSeats({ Bus: totalSeats.Bus, Van: totalSeats.Van });
    };

    // Define function to show description modal
    const showDescriptionModal = (description) => {
        setSelectedDescription(description);
        setDescriptionModalVisible(true);
    };

    // Check for a new day and reset remaining seats accordingly
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 4 && now.getMinutes() === 0 && now.getSeconds() === 0) {
                // Reset remaining seats
                resetRemainingSeats();
                
                // Fetch bookings from the previous day and delete them
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const formattedDate = yesterday.toLocaleDateString();
                
                axios.get(`/api/employee/getTraBooking?date=${formattedDate}`)
                    .then(response => {
                        if (response.data && response.data.bookings) {
                            response.data.bookings.forEach(async (booking) => {
                                await axios.delete(`/api/employee/deletebooking/${booking._id}`);
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching or deleting bookings from the previous day:', error);
                    });
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, []);

    const fetchBooking = async () => {
        try {
            const response = await axios.get('/api/employee/getTraBooking');
            console.log('Booking API Response:', response.data);

            if (response.data && response.data.bookings) {
                // Update remaining seats
                const remaining = { Bus: totalSeats.Bus, Van: totalSeats.Van };
                response.data.bookings.forEach((booking) => {
                    remaining[booking.Type] -= 1; // Reduce remaining seats by 1 for each booking
                });
                setRemainingSeats(remaining);

                // Update booking state with booking date
                setBooking(response.data.bookings.map(booking => ({
                    ...booking,
                    bookingDate: new Date(booking.bookingdate).toLocaleDateString()
                })));
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
        fetchBooking();
    }, []);

    // handle the user details part
    const handleDelete = async (id, type) => {
        try {
            await axios.delete(`/api/employee/deletebooking/${id}`);
            // Update remaining seats state
            setRemainingSeats(prevState => ({
                ...prevState,
                [type]: prevState[type] + 1
            }));
            setBooking(prev => prev.filter(item => item._id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete booking');
        }
    };

    // User booking columns
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
        
    ];

    return (
        <Layout>
            {/* Display Total Seats for Each Vehicle Type */}
            <div className='seat-count'>
                <div>Total Bus Seats: {totalSeats.Bus}</div>
                <div>Remaining Bus Seats: {remainingSeats.Bus}</div>
            </div>
            <div className='seat-count'>
                <div>Total Van Seats: {totalSeats.Van}</div>
                <div>Remaining Van Seats: {remainingSeats.Van}</div>
            </div>

            {/* Table to display bookings */}
            <Table dataSource={booking} columns={columns} />

            {/* Description Modal */}
            <Modal
                title="Description"
                visible={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
            >
                <p>{selectedDescription}</p>
            </Modal>

            <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBookingDisplay`)}>View Own Details</Button>
        </Layout>
    );
}

export default TraBookingdisplayAll;
