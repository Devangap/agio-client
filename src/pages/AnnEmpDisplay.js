

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AnnEmpDisplay() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const [announcements, setAnnouncements] = useState([]);

    const [specificAnnouncements, setSpecificAnnouncements] = useState([]);
    const [generalAnnouncements, setGeneralAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);


    useEffect(() => {
        // Fetch announcements when the user state is available
        if (user) {
            fetchSpecificAnnouncements(user.department);
            fetchGeneralAnnouncements();
        }
    }, [user]);

    const fetchSpecificAnnouncements = async (department) => {
        try {
            const response = await axios.get(`/api/employee/getAnnHRsupSpecific?department=${department}`);
            const data = response.data;
    
            if (!data.success) {
                message.error(data.message || 'No specific announcements');
                setSpecificAnnouncements([]);
            } else {
                setSpecificAnnouncements(data.announcements);
            }
        } catch (error) {
            message.error('Failed to fetch specific announcements');
        }
    };
    
    const fetchGeneralAnnouncements = async () => {
        try {
            const response = await axios.get('/api/employee/getAnnHRsupgen');
            const data = response.data;
    
            if (!data.success) {
                message.error(data.message || 'No general announcements');
                setGeneralAnnouncements([]);
            } else {
                setGeneralAnnouncements(data.announcements);
            }
        } catch (error) {
            message.error('Failed to fetch general announcements');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteAnnHRsup/${id}`);
            fetchSpecificAnnouncements(user.department);
            fetchGeneralAnnouncements();
            message.success('Announcement deleted successfully');
        } catch (error) {
            message.error('Failed to delete announcement');
        }
    };

    const showModal = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsModalVisible(true);
    };

    const handleUpdate = async (values) => {
        try {
            const response = await axios.put(`/api/annWorkouts/updateAnnHRsup/${currentAnnouncement._id}`, values);
            if (response.data.success) {
                message.success('Announcement updated successfully');
                setIsModalVisible(false);
                fetchSpecificAnnouncements(user.department);
                fetchGeneralAnnouncements();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update announcement');
        }
    };

    
    return (
        <Layout>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <h6>SPECIFIC ANNOUNCEMENTS</h6>
                {specificAnnouncements.map(announcement => (
                    <Card
                        key={announcement._id}
                        title={announcement.anntitle}
                        style={{ width: 300, margin: '16px' }}
                        actions={[
                            <Button type="primary" onClick={() => navigate(`/AnnUpdate/${announcement._id}`)}>Update</Button>,
                            <Button danger onClick={() => handleDelete(announcement._id)}>Delete</Button>
                        ]}
                    >
                        <div>
                            {announcement.file && (
                                <>
                                    <img
                                        src={announcement.file.path ? `http://localhost:5001/uploads/${announcement.file.filename}` : ''}
                                        alt={announcement.file.filename}
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <p>{announcement.file.filename}</p>
                                </>
                            )}
                        </div>
                        <p><strong>Type:</strong> {announcement.Type}</p>
                        <p><strong>Department:</strong> {announcement.Department}</p>
                        <p><strong>Upload Date:</strong> {new Date(announcement.uploaddate).toLocaleDateString()}</p>
                        <p><strong>Expire Date:</strong> {new Date(announcement.expiredate).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {announcement.Description}</p>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <h6>GENERAL ANNOUNCEMENTS</h6>
                {generalAnnouncements.map(announcement => (
                    <Card
                        key={announcement._id}
                        title={announcement.anntitle}
                        style={{ width: 300, margin: '16px' }}
                        actions={[
                            <Button type="primary" onClick={() => navigate(`/AnnUpdate/${announcement._id}`)}>Update</Button>,
                            <Button danger onClick={() => handleDelete(announcement._id)}>Delete</Button>
                        ]}
                    >
                        <div>
                            {announcement.file && (
                                <>
                                    <img
                                        src={announcement.file.path ? `http://localhost:5001/uploads/${announcement.file.filename}` : ''}
                                        alt={announcement.file.filename}
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <p>{announcement.file.filename}</p>
                                </>
                            )}
                        </div>
                        <p><strong>Type:</strong> {announcement.Type}</p>
                        <p><strong>Department:</strong> {announcement.Department}</p>
                        <p><strong>Upload Date:</strong> {new Date(announcement.uploaddate).toLocaleDateString()}</p>
                        <p><strong>Expire Date:</strong> {new Date(announcement.expiredate).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> {announcement.Description}</p>
                    </Card>
                ))}
            </div>

            <Modal
                title="Update Announcement"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    layout="vertical"
                    initialValues={{ ...currentAnnouncement }}
                    onFinish={handleUpdate}
                >
                    <Form.Item
                        name="anntitle"
                        label="Announcement Title"
                        rules={[{ required: true, message: 'Please input the announcement title!' }]}
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

export default AnnEmpDisplay;

