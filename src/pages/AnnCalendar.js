import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import { Modal, Form, Input, DatePicker, Button, Table } from 'antd';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
const { Column } = Table;

function AnnCalendar() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [notices, setNotices] = useState([]); // Define notices state
    const [columns, setColumns] = useState([]);

    function disableNotToday(current) {
       
        return current && current.format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD');
    }
    function disablePastDates(current) {
        
        return current && current < moment().startOf('day');
    }

    const locales = { 'en-US': enUS };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });

    const handleOpenUpdateModal = () => {
        form.setFieldsValue({
            title: selectedEvent.title,
            submission: moment(selectedEvent.start),
            expiryDate: moment(selectedEvent.end),
            description: selectedEvent.description
        });
        setIsUpdateModalVisible(true);
        setIsEventModalVisible(false);
    };

    const handleUpdateEvent = async () => { 
        form.validateFields().then(async (values) => {
            try {
                const response = await axios.put(`/api/employee/updatevent/${selectedEvent.id}`, {
                    ...values,
                    submission: values.submission.format("YYYY-MM-DD"),
                    expiryDate: values.expiryDate.format("YYYY-MM-DD")
                });
                if (response.data.success) {
                    toast.success('Event updated successfully');
                    setIsUpdateModalVisible(false);
                    fetchNotices();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Error updating event');
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleDeleteEvent = async () => {
        if (selectedEvent && selectedEvent.id) {
            try {
                const response = await axios.delete(`/api/employee/deletevent/${selectedEvent.id}`);
                if (response.status === 200) {
                    toast.success('Event deleted successfully');
                    setIsEventModalVisible(false);
                    fetchNotices();
                } else {
                    toast.error('Failed to delete the event');
                }
            } catch (error) {
                toast.error('Error deleting event');
            }
        }
    };
    
    
    

    const fetchNotices = async () => {
        try {
            const response = await axios.get('/api/employee/event');
            const notices = response.data.getNotice.map(notice => {
                const totalResponses = notice.response.length; // Assuming `response` is an array of all responses for the notice
                return {
                    id: notice._id,
                    title: notice.title,
                    start: new Date(notice.submission),
                    end: new Date(notice.expiryDate),
                    description: notice.description,
                    totalResponses, // Add this property
                    departmentChoiceCounts: {}
                };
            });
    
            // Process each notice
            notices.forEach((notice, noticeIndex) => {
                // Initialize department choice counts for the current notice
                const departmentChoiceCounts = {};
                
                // Count choice occurrences by department for the current notice
                response.data.getNotice[noticeIndex].response.forEach(response => {
                    if (response.choice === "in") {
                        const department = response.department;
                        departmentChoiceCounts[department] = (departmentChoiceCounts[department] || 0) + 1;
                    }
                });
                
                // Set the department choice counts for the current notice
                notices[noticeIndex].departmentChoiceCounts = departmentChoiceCounts;
            });
    
            // Generate columns dynamically based on department names
            const departmentColumns = Object.keys(notices.reduce((acc, curr) => {
                for (const department in curr.departmentChoiceCounts) {
                    acc[department] = true;
                }
                return acc;
            }, {})).map(department => ({
                title: department,
                dataIndex: department,
                key: department,
                render: (text, record) => (record.departmentChoiceCounts[department] || 0) // Render 0 if the count is not available
            }));
    
            // Define base columns, excluding Total Responses initially
            const baseColumns = [
                {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                }
            ];
    
            // Add Total Responses column at last
            const totalResponsesColumn = {
                title: 'Total Responses',
                dataIndex: 'totalResponses',
                key: 'totalResponses'
            };
    
            // Combining base columns, department columns, and Total Responses column at the end
            setColumns([...baseColumns, ...departmentColumns, totalResponsesColumn]);
            setEvents(notices);
            setNotices(notices);
        } catch (error) {
            console.error("Error fetching notices:", error);
            toast.error("Error fetching notices");
        }
    };
    
    
    
    
    
    

    useEffect(() => {
        fetchNotices();
    }, []);

    const onFinish = async (values) => {
        try {
            const response = await axios.post('/api/employee/AnnCalNotice', {
                ...values,
                submission: values.submission.format("YYYY-MM-DD"),
                expiryDate: values.expiryDate.format("YYYY-MM-DD")
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setIsModalVisible(false);
                form.resetFields();
                fetchNotices();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsEventModalVisible(true);
    };

    const handleAddNotice = () => {
        form.resetFields(); 
        setIsModalVisible(true);
    };
    

    const handleOk = () => form.submit();
    const handleCancel = () => setIsModalVisible(false);
    


    return (
        <Layout>
             <h1>Event Calendar</h1>
            <div style={{ height: 500, margin: '50px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%', fontFamily: 'Patrick Hand' }}
                    onSelectEvent={handleEventClick}
                />
                <Button type="primary" onClick={handleAddNotice} style={{ marginBottom:70}} >
                    Add Notice
                </Button>
                <Modal
                    title="Add Notice"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{
                            submission: moment(),
                            expiryDate: moment().add(1, 'years')
                        }}
                    >
                        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Start Date" name="submission">
    <DatePicker 
        className="date" 
        disabledDate={disablePastDates}  
    />
</Form.Item>
                        
                        <Form.Item label="End Date" name="expiryDate">
                        <DatePicker 
        className="date" 
        disabledDate={disablePastDates}  
    />
                        </Form.Item>
                        
                        <Form.Item label="Description" name="description">
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Event Details"
                    visible={isEventModalVisible}
                    onOk={() => setIsEventModalVisible(false)}
                    onCancel={() => setIsEventModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setIsEventModalVisible(false)}>
                            Close
                        </Button>,
                        <Button key="update" type="primary" onClick={handleOpenUpdateModal}>
                            Update
                        </Button>,
                        <Button key="delete" type="danger" onClick={handleDeleteEvent}>
                            Delete
                        </Button>
                    ]}
                >
                    {selectedEvent ? (
                        <div>
                            <p><strong>Title:</strong> {selectedEvent.title}</p>
                            <p><strong>Start:</strong> {format(selectedEvent.start, 'PPP')}</p>
                            <p><strong>End:</strong> {format(selectedEvent.end, 'PPP')}</p>
                            <p><strong>Description:</strong> {selectedEvent.description}</p>
                        </div>
                    ) : null}
                </Modal>
                <Modal
                    title="Update Event"
                    visible={isUpdateModalVisible}
                    onOk={() => handleUpdateEvent()}
                    onCancel={() => setIsUpdateModalVisible(false)}
                >
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Submission Date" name="submission">
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item label="Expiry Date" name="expiryDate">
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item label="Description" name="description">
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{ height: 500, width: '80%' }}>
                <Table dataSource={notices} columns={columns} />
                    </div>
            </div>
        </Layout>
    );
}

export default AnnCalendar;

