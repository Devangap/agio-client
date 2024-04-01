import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import AnnLayout from '../pages/AnnLayout';
import { useNavigate } from 'react-router-dom';

function TraVehicleDetails() {

    const navigate = useNavigate();
    

    const [Vregister, setVregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentVregister, setCurrentVregister] = useState(null); 


    const fetchVregister = async () => {
        try {
            const response = await axios.get('/api/TransportRoute/getVehicles');
            // Assuming response.data.bookings is an array of bookings
            // Add a unique key (e.g., _id) to each booking for the Table component
            const dataWithKey = response.data.Vregisters.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setVregister(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Booking");
        }
    };



    useEffect(() => {
        
        fetchVregister();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/TransportRoute/deleteVehivle/${id}`);
            setVregister(prev => prev.filter(item => item._id !== id));
            message.success('Booking deleted successfully');
        } catch (error) {
            message.error('Failed to delete Booking');
        }
    };

    const columns = [
        {
            title: 'Type',
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
            title: ' Licence Details',
            dataIndex: 'LicenceDetails',
            key: 'LicenceDetails',
           
        },

        {
            title: 'Owner Details',
            dataIndex: 'OwnerDetails',
            key: 'OwnerDetails',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/TraVehicleDetailsUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    const showModal = (Vregister) => {
        setCurrentVregister(Vregister);
        setIsModalVisible(true);
    };
    const handleUpdate = async (values) => {
        try {
            // Assuming you have the Booking ID in currentBooking._id
            const response = await axios.put(`/api/TransportRoute/updateTraVehicle/${currentVregister._id}`, values);
            if (response.data.success) {
                message.success('Booking updated successfully');
                setIsModalVisible(false);
                // Refresh the Booking list to reflect the update
                fetchVregister();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update Booking');
        }
    };

  return (
    <AnnLayout>
    <Table dataSource={Vregister} columns={columns} />
    <Modal
title="Update Booking"
open={isModalVisible}
onCancel={() => setIsModalVisible(false)}
footer={null} // Use null here to not use the default Ok and Cancel buttons
>
<Form
layout="vertical"
initialValues={{ ...currentVregister }}
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