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

    // Define state to track booked seats for the current date
    const [bookedSeats, setBookedSeats] = useState({});
    
    // Static total seats for each vehicle type
    const totalSeats = { Bus: 100, Van: 24 };

    // State variables to hold remaining seats for each vehicle type
    const [remainingSeats, setRemainingSeats] = useState({ Bus: 100, Van: 24 });

    const [isTodayBooking, setIsTodayBooking] = useState(false);

    const fetchBooking = async (userId) => {
        try {
            const response = await axios.get(`/api/employee/getTraBooking3/${userId}`);
            console.log('Booking API Response:', response.data);

            if (response.data && response.data.bookings) {
                // Update bookedSeats state
                const booked = {};
                response.data.bookings.forEach((booking) => {
                    const bookingDate = new Date(booking.bookingdate).toLocaleDateString();
                    booked[booking._id] = { ...booking, bookingDate };
                });
                setBookedSeats(booked);

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
        if (user && user.userid) {
            fetchBooking(user.userid);
        }
    }, [user]);

    
    // Function to reset remaining seats to total seats
    const resetRemainingSeats = () => {
        setRemainingSeats({ Bus: totalSeats.Bus, Van: totalSeats.Van });
    };

     // Check for a new day and reset remaining seats accordingly
     useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
                resetRemainingSeats();
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, []);

    // Handle booking creation
    const handleBooking = async (type) => {
        try {
            // Check if there are remaining seats for the selected type
            if (remainingSeats[type] > 0) {
                // Make your booking API call here
                // Assuming you have the necessary data to create a booking
                const newBooking = {
                    userId: user.userid,
                    Type: type,
                    bookingdate: new Date().toLocaleDateString(), // Assuming booking date is today
                    Details: 'Sample Description', // Sample description
                };
                // Make POST request to create a new booking
                const response = await axios.post('/api/employee/TraBooking', newBooking);
                // Update state with the new booking
                const updatedBooking = {
                    ...response.data,
                    bookingDate: new Date(response.data.bookingdate).toLocaleDateString()
                };
                // Update booked seats state
                setBookedSeats(prevState => ({
                    ...prevState,
                    [response.data._id]: updatedBooking
                }));
                setBooking([...booking, updatedBooking]);
                // Update remaining seats state
                setRemainingSeats(prevState => ({
                    ...prevState,
                    [type]: prevState[type] - 1
                }));
                // Update isTodayBooking state
                setIsTodayBooking(response.data.isTodayBooking);
                message.success('Booking created successfully');
            } else {
                message.error('No remaining seats available');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            message.error('Failed to create booking');
        }
    };

    // handle the user details part
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deletebooking/${id}`);
            // Remove the booking from booked seats
            const { [id]: deletedBooking, ...restBookedSeats } = bookedSeats;
            setBookedSeats(restBookedSeats);
            // Update remaining seats state
            setRemainingSeats(prevState => ({
                ...prevState,
                [deletedBooking.Type]: prevState[deletedBooking.Type] + 1
            }));
            setBooking(prev => prev.filter(item => item._id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete booking');
        }
    };

    const showDescriptionModal = (description) => {
        setSelectedDescription(description);
        setDescriptionModalVisible(true);
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
                    <Button type="primary" className="update" onClick={() => navigate(`/TraBookingUpdate/${record._id}`)} disabled={record.status === 'approved' || record.status === 'rejected'}>
                        Update
                    </Button>
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
            <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBooking`)}>BOOKING</Button>
            <Button className='bookprimary-button my-2' htmlType='submit' onClick={() => navigate(`/TraBookingdisplayAll`)}>View Available Seats</Button>
        </Layout>
    );
}

export default TraBookingDisplay;