

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
    const [commentText, setCommentText] = useState('');



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

   

    const showModal = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsModalVisible(true);
    };

   
    const handleCommentSubmit = async (announcementId) => {
        try {
            const response = await axios.post(`/api/employee/comments/${announcementId}`, { text: commentText },
            
            {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            console.log (announcementId)
        ;
            if (response.data.success) {
                message.success('Comment added successfully');
                setCommentText(''); // Clear comment text after submission
                fetchSpecificAnnouncements(user.department); // Refetch announcements to update comments
                fetchGeneralAnnouncements();
            } else {
                message.error(response.data.message || 'Failed to add comment');
            }
        } catch (error) {
            message.error('Failed to add comment');
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
                        style={{ width: 1000, margin: '16px' }}
                        actions={[
                            
                            
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
                        <Form onFinish={() => handleCommentSubmit(announcement._id)}>
                            <Form.Item>
                                <Input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='comment' name='comment'>Add Comment</Button>
                            </Form.Item>
                        </Form>
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
                        <Form onFinish={() => handleCommentSubmit(announcement._id)}>
                            <Form.Item>
                                <Input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='comment' name='comment'>Add Comment</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                ))}
            </div>

            
        </Layout>
    );
}

export default AnnEmpDisplay;

