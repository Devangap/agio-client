import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom';

function TraBookingDisplay() {
    const navigate = useNavigate();
    

    const [booking, setbooking] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentbooking, setCurrentbooking] = useState(null); 

    const fetchbooking = async () => {
        try {
            const response = await axios.get('/api/TransportRoute/getTraBooking');
            // Assuming response.data.bookings is an array of bookings
            // Add a unique key (e.g., _id) to each booking for the Table component
            const dataWithKey = response.data.bookings.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setbooking(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Booking");
        }
    };



    useEffect(() => {
        
        fetchbooking();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            // Send a DELETE request to delete the booking by its ID
            await axios.delete(`/api/TransportRoute/deletebooking/${id}`);
    
            // Update the state to remove the deleted booking from the table
            setbooking(prevBookings => prevBookings.filter(booking => booking._id !== id));
    
            // Show a success message
            message.success('Booking deleted successfully');
        } catch (error) {
            // Show an error message if deletion fails
            console.error('Failed to delete Booking:', error);
            message.error('Failed to delete Booking');
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/TraBookingUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    const showModal = (booking) => {
        setCurrentbooking(booking);
        setIsModalVisible(true);
    };
    const handleUpdate = async (values) => {
        try {
            // Assuming you have the Booking ID in currentBooking._id
            const response = await axios.put(`/api/TransportRoute/updateTraBooking/${currentbooking._id}`, values);
            if (response.data.success) {
                message.success('Booking updated successfully');
                setIsModalVisible(false);
                // Refresh the Booking list to reflect the update
                fetchbooking();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update Booking');
        }
    };
    
    

    return (
        <Layout>
            <Table dataSource={booking} columns={columns} />
            <Modal
    title="Update Booking"
    open={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null} // Use null here to not use the default Ok and Cancel buttons
>
    <Form
        layout="vertical"
        initialValues={{ ...currentbooking }}
        onFinish={handleUpdate}
    >
        <Form.Item
            name="EmpName"
            label="Employee Name"
            rules={[{  message: 'Please input the Employee Name!' }]}
        >
            <Input />
        </Form.Item>
        {/* Repeat for other fields as necessary */}
        <Form.Item>
            <Button type="primary" htmlType="submit">
                Update
            </Button>
        </Form.Item>
    </Form>
</Modal>

        

        </Layout>
        
    );

}

export default TraBookingDisplay