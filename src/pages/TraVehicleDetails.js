import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import AnnLayout from '../pages/AnnLayout';
import { useNavigate } from 'react-router-dom';

import ReactDOM from 'react-dom';
import App from '../App';



function TraVehicleDetails() {

    const navigate = useNavigate();
    const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
    

    const [booking, setbooking] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentbooking, setCurrentbooking] = useState(null); 


    const fetchbooking = async () => {
        try {
            const response = await axios.get('/api/TransportRoute/getTraBooking');
            // Assuming response.data.announcements is an array of announcements
            // Add a unique key (e.g., id) to each announcement for the Table component
            const dataWithKey = response.data.booking.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setbooking(dataWithKey);
        } catch (error) {
            message.error("Failed to fetch Booking");
        }
    };



    useEffect(() => {
        
        fetchbooking();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/TransportRoute/deletebookings/${id}`);
            setbooking(prev => prev.filter(item => item._id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete Booking');
        }
    };

    const columns = [
        {
            title: 'Vehicle Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Vehicle Number',
            dataIndex: 'vehicleNum',
            key: 'vehicleNum',
        },

        {
            title: 'Emissions Certificate Details',
            dataIndex: 'ECDetails',
            key: 'ECDetails',
        },
        
        {
            title: 'Licence Details',
            dataIndex: 'Licence Details',
            key: 'Licence Details',
        },

        {
            title: 'Owner Details',
            dataIndex: 'Owner Details',
            key: 'Owner Details',
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

    const showModal = (Booking) => {
        setCurrentbooking(Booking);
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
    <AnnLayout>
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
    name="vehicleNum"
    label="Vehicle Number"
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



</AnnLayout>
  )
}

export default TraVehicleDetails