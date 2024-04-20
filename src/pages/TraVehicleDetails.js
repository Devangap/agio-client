import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';


function TraVehicleDetails() {


    const navigate = useNavigate();
    

    const [Vregister, setVregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentVregister, setCurrentVregister] = useState(null); 
    const [filteredVregister, setFilteredVregister] = useState([]);
    const [searchText, setSearchText] = useState('');
    

    const fetchVregister = async () => {
        try {
            const response = await axios.get('/api/employee/getVehicles');
            // Assuming response.data.bookings is an array of bookings
            // Add a unique key (e.g., _id) to each booking for the Table component
            const dataWithKey = response.data.vehicles.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setVregister(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Vehicle");
        }
    };



    useEffect(() => {
        
        fetchVregister();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            // Send a DELETE request to delete the booking by its ID
            await axios.delete(`/api/employee/deletevehicles/${id}`);
    
            // Update the state to remove the deleted booking from the table
            setVregister(prevVehicles => prevVehicles.filter(Vregister => Vregister._id !== id));
    
            // Show a success message
            message.success('Vehicle deleted successfully');
        } catch (error) {
            // Show an error message if deletion fails
            console.error('Failed to delete Vehicle:', error);
            message.error('Failed to delete Vehicle');
        }
    };


    const filteredData = Vregister.filter((vehicle) =>
    vehicle.vehicleNum.toLowerCase().includes(searchText.toLowerCase())
    
     || vehicle.vehicleNum.toLowerCase().includes(searchText.toLowerCase())
  );
  
    

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
            title: 'Emissions Certificate Details ',
            dataIndex: 'ECDetails',
            key: 'ECDetails',
        },
        {
            title: 'Select Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Licence Details',
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
                    <Button type="primary" className="update" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                    
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
            const response = await axios.put(`/api/employee/updatevehicles/${currentVregister._id}`, values);
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
    <Layout>


        <div className="bookTratable-header">
        <h3>ALL VEHICLE DETAILS</h3>
        <div className="booksearch-container">
            <Input
                placeholder="Search vehicel"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 200 }}
            />
        </div>
    </div>

            <Table dataSource={filteredData} columns={columns} />
                <Button classNames="bookdetails"
        type="bookprimary"
        className="bookdetails"
        danger
        onClick={() => navigate(`/TraVehicleviwe`)}
        
      >
        VIEW VEHICLE DETAILS
      </Button>
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
            <Button type="bookprimary" htmlType="submit">
                Update
            </Button>
        </Form.Item>
        
        
    </Form>
    
</Modal>


        

        </Layout>
  )
}

export default TraVehicleDetails