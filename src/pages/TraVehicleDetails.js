import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function TraVehicleDetails() {
    const navigate = useNavigate();
    const [Vregister, setVregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentVregister, setCurrentVregister] = useState(null);
    const [searchText, setSearchText] = useState('');

    const fetchVregister = async () => {
        try {
            const response = await axios.get('/api/employee/getVehicles');
            const dataWithKey = response.data.vehicles.map(item => ({ ...item, key: item._id }));
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
            await axios.delete(`/api/employee/deletevehicles/${id}`);
            setVregister(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== id));
            message.success('Vehicle deleted successfully');
        } catch (error) {
            console.error('Failed to delete Vehicle:', error);
            message.error('Failed to delete Vehicle');
        }
    };

    const showModal = (Vregister) => {
        setCurrentVregister(Vregister);
        setIsModalVisible(true);
    };

    const renderLongText = (text) => {
        const maxLength = 10; // Set your desired maximum length here
        if (text && text.length > maxLength) {
            const truncatedText = text.substring(0, maxLength) + '...';
            return (
                <span>
                    {truncatedText}
                    <Button type="link" onClick={() => showModal(text)}>See more</Button>
                </span>
            );
        }
        return text;
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
            // Filter the data based on vehicle number (case-insensitive partial match)
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) => record.vehicleNum.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Emissions Certificate Details',
            dataIndex: 'ECDetails',
            key: 'ECDetails',
            render: renderLongText,
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
            render: renderLongText,
        },
        {
            title: 'Owner Details',
            dataIndex: 'OwnerDetails',
            key: 'OwnerDetails',
            render: renderLongText,
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

    return (
        <Layout>
            <div className="bookTratable-header">
                <h3>ALL VEHICLE DETAILS</h3>
                <div className="booksearch-container">
                    <Input
                        placeholder="Search vehicle"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginBottom: 16, width: 200 }}
                    />
                </div>
            </div>
            <Table dataSource={Vregister} columns={columns} />

            <Modal
                title="Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <p>{currentVregister}</p>
            </Modal>
        </Layout>
    );
}

export default TraVehicleDetails;
