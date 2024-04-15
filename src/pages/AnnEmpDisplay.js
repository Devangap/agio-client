import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

function AnnEmpDisplay() {
    const navigate = useNavigate();

    const [announcements, setAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            // Make a GET request to fetch announcements
            const response = await axios.get('/api/employee/getAnnHRsup?Type=specific'); // Modify the route to include the announcement type
            const dataWithKey = response.data.announcements.map(item => ({ ...item, key: item._id }));
            setAnnouncements(dataWithKey);
        } catch (error) {
            message.error("Failed to fetch announcements");
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteAnnHRsup/${id}`);
            setAnnouncements(prev => prev.filter(item => item._id !== id));
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
                fetchAnnouncements();
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
                {announcements.map(announcement => {
                    console.log(announcement)
                    console.log('File path:', announcement.filePath ? `http://localhost:5001/uploads/${announcement.filePath.filename}` : '');
                    return (
                        <Card
                        key={announcement._id}
                        title={announcement.anntitle}
                        style={{ width: 300, margin: '16px' }}
                        actions={[
                            <Button type="primary" onClick={() => navigate(`/AnnUpdate/${announcement._id}`)}>Update</Button>,
                            <Button danger onClick={() => handleDelete(announcement._id)}>Delete</Button>
                        ]}
                    >
                        {/* Render the image here */}
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
                    );
                })}
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
