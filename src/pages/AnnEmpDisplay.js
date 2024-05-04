

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Input, message ,Tabs,Radio} from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../AnnEmpDisplay.css"
import { InfoCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
function AnnEmpDisplay() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);


    const [announcements, setAnnouncements] = useState([]);

    const [specificAnnouncements, setSpecificAnnouncements] = useState([]);
    const [generalAnnouncements, setGeneralAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [events, setEvents] = useState([]);
    const [isRSVPModalVisible, setIsRSVPModalVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [rsvpChoice, setRsvpChoice] = useState(null);





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
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/employee/event');
            if (!response.data.success) {
                message.error(response.data.message || 'Failed to fetch events');
            } else {
                setEvents(response.data.getNotice);
            }
        } catch (error) {
            message.error('Error retrieving events: ' + error.message);
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
    const getData = async () => {
        try {
            const response = await axios.post('/api/employee/get-employee-info-by-id', {}, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

   



   

    const showModal = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsModalVisible(true);
    };

   
    const handleCommentSubmit = async (announcementId) => {
        try {
            const empId = user.empid; // Directly using `empId` from `user` object
            console.log(empId);
    
            const response = await axios.post(`/api/employee/comments/${announcementId}`, 
                { text: commentText, empId: empId }, // Include `empId` in the request
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
    
            console.log(announcementId);
    
            if (response.data.success) {
                message.success('Comment added successfully');
                setCommentText('');
                fetchSpecificAnnouncements(user.department);
                fetchGeneralAnnouncements();
            } else {
                message.error(response.data.message || 'Failed to add comment');
            }
        } catch (error) {
            message.error('Failed to add comment');
        }
        console.log(commentText);
    };

    const showRSVPModal = (event) => {
        setCurrentEvent(event);
        setIsRSVPModalVisible(true);
    };
    
    const handleRSVPClose = () => {
        setIsRSVPModalVisible(false);
        setCurrentEvent(null);
        setRsvpChoice(null); // Reset the RSVP choice when closing the modal
    };
    
    const handleRSVPSubmit = async () => {
        if (!rsvpChoice) {
            message.error('Please select your RSVP choice');
            return; // Do nothing if no choice is made
        }
    
        try {
            const response = await axios.post(`/api/employee/rsvp/${currentEvent._id}`, {
                choice: rsvpChoice,
                empId: user.empid ,
                department:user.department// Assuming you have user's empId
                
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            if (response.data.success) {
                message.success('RSVP submitted successfully');
                setRsvpChoice(null);
                setIsRSVPModalVisible(false);
                fetchEvents(); // Refresh the list of events or manage state update
            } else {
                message.error(response.data.message || 'Failed to submit RSVP');
            }
        } catch (error) {
            message.error('Failed to submit RSVP');
            console.error('RSVP submission error:', error);
        }
    };console.log(currentEvent?._id)
    
    
    
    

    
    return (
        <Layout>
        <Tabs defaultActiveKey="notices">
    <TabPane tab="Notices" key="notices">
        <div className="anncardsss">
            <Card className="notices-card" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                <h2  >Notices</h2>
                {events.length > 0 ? (
                    <div>
                        {events.slice(0).reverse().map(event => ( // Reversing the array
                            <div className="anncard" key={event.id}>
                                <h3 style={{ marginTop: "20px", color: 'rgb(66, 34, 2)}'}}>
                                    <InfoCircleOutlined style={{ color: "#ECB159", marginRight: "10px" }}  />
                                    {event.title}
                                </h3>
                                <p style={{ fontSize: '16px', marginLeft: "20px", justifyContent:'center'}}>{event.description}</p>
                                <Button type="primary" style={{ float: "right", marginBottom: "100px", backgroundColor: "#ECB159"}}onClick={() => showRSVPModal(event)}>
                                    RSVP</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No notices found.</p>
                )}
            </Card>
        </div>
    </TabPane>

            <TabPane tab="Announcements" key="announcements">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <h6>SPECIFIC ANNOUNCEMENTS</h6>
                    {specificAnnouncements.map(announcement => (
                        <Card className='Annspec'
                            key={announcement._id}
                            title={announcement.anntitle}
                            
                            actions={[]}
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
                            {/* <p><strong>Upload Date:</strong> {new Date(announcement.uploaddate).toLocaleDateString()}</p>
                            <p><strong>Expire Date:</strong> {new Date(announcement.expiredate).toLocaleDateString()}</p> */}
                            <p><strong>Description:</strong> {announcement.Description}</p>
                            <Form onFinish={() => handleCommentSubmit(announcement._id)}>
                                <Form.Item>
                                    <Input
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
                        className='Annspec'
                            key={announcement._id}
                            title={announcement.anntitle}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            actions={[]}
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
            </TabPane>
        </Tabs>
        <Modal
    title="RSVP to Event"
    visible={isRSVPModalVisible}
    onOk={handleRSVPSubmit}
    onCancel={handleRSVPClose}
    footer={[
        <Button key="back" onClick={handleRSVPClose}>
            Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleRSVPSubmit} disabled={!rsvpChoice}>
            Submit
        </Button>,
    ]}
>
    {currentEvent && (
        <div>
            <h2>{currentEvent.title}</h2>
            <p>{currentEvent.description}</p>
            <Radio.Group onChange={(e) => setRsvpChoice(e.target.value)} value={rsvpChoice}>
                <Radio value="in">I'm in</Radio>
                <Radio value="out">I'm out</Radio>
            </Radio.Group>
        </div>
    )}
</Modal>

    </Layout>
    );
}

export default AnnEmpDisplay;

