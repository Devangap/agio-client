import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function TraDriverDetailsDisplay() {

    const navigate = useNavigate();
    

    const [Dregister, setDregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDregister, setCurrentDregister] = useState(null); 

    const fetchDregister = async () => {
        try {
            const response = await axios.get('/api/employee/getdrivers');
            // Assuming response.data.bookings is an array of bookings
            // Add a unique key (e.g., _id) to each booking for the Table component
            const dataWithKey = response.data.drivers.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setDregister(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Booking");
        }
    };



    useEffect(() => {
        
        fetchDregister();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            // Send a DELETE request to delete the booking by its ID
            await axios.delete(`/api/employee/deletedrivers/${id}`);
    
            // Update the state to remove the deleted booking from the table
            setDregister(prevDrivers => prevDrivers.filter(Dregister => Dregister._id !== id));
    
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
            title: 'Driver Name',
            dataIndex: 'driName',
            key: 'driName',
        },
        {
            title: 'Driver Email',
            dataIndex: 'driEmail',
            key: 'driEmail',
        },

        {
            title: 'Work Expereance',
            dataIndex: 'Type',
            key: 'Type',
        },
        
        {
            title: 'select Register Date',
            dataIndex: 'regdate',
            key: 'regdate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        
        {
            title: 'Driver PhoneNumber',
            dataIndex: 'driPnum',
            key: 'driPnum',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/TraDriverDetailsUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    const showModal = (Dregister) => {
        setCurrentDregister(Dregister);
        setIsModalVisible(true);
    };
    const handleUpdate = async (values) => {
        try {
            // Assuming you have the Booking ID in currentBooking._id
            const response = await axios.put(`/api/employee/updatedrivers/${currentDregister._id}`, values);
            if (response.data.success) {
                message.success('Booking updated successfully');
                setIsModalVisible(false);
                // Refresh the Booking list to reflect the update
                fetchDregister();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update Booking');
        }
    };
    


  return (
    <Layout>
            <Table dataSource={Dregister} columns={columns} />
            <Modal
    title="Update Booking"
    open={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null} // Use null here to not use the default Ok and Cancel buttons
>
    <Form
        layout="vertical"
        initialValues={{ ...currentDregister }}
        onFinish={handleUpdate}
    >
        <Form.Item
            name="driName"
            label="Driver Name"
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
  )
}

export default TraDriverDetailsDisplay