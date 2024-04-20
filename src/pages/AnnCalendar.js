import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';

function AnnCalendar() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
const [isEventModalVisible, setIsEventModalVisible] = useState(false);

    const locales = { 'en-US': enUS };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });
    const handleUpdateEvent = () => {
      // Placeholder for update logic
      console.log("Updating event:", selectedEvent.title);
      // After updating, you might want to close the modal and refresh events
      setIsEventModalVisible(false);
      fetchNotices(); // Assuming fetchNotices refreshes the list of events
    };
    
    const handleDeleteEvent = () => {
      // Placeholder for delete logic
      console.log("Deleting event:", selectedEvent.title);
      // After deleting, you might want to close the modal and refresh events
      setIsEventModalVisible(false);
      fetchNotices(); // Assuming fetchNotices refreshes the list of events
    };

    // Move fetchNotices outside useEffect
    const fetchNotices = async () => {
        try {
            const response = await axios.get('/api/employee/event');
            const notices = response.data.getNotice.map(notice => ({
                title: notice.title,
                start: new Date(notice.submission),
                end: new Date(notice.expiryDate),
                description: notice.description
            }));
            setEvents(notices);
        } catch (error) {
            toast.error("Error fetching notices");
            console.error("Error in fetchNotices:", error);
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
                form.resetFields();  // Reset the form after submission
                fetchNotices();       // Refresh the events to include the new notice
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

    const handleAddNotice = () => setIsModalVisible(true);
    const handleOk = () => form.submit();
    const handleCancel = () => setIsModalVisible(false);

    return (
        <Layout>
           <div style={{ height: 500, margin: '50px' }}>
           <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: '100%', fontFamily: 'Patrick Hand' }}
  onSelectEvent={handleEventClick} // This will trigger when an event is clicked
/>
    
                <Button type="primary" onClick={handleAddNotice}>
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
                            expiryDate: moment().add(1, 'years') // set 1 year from now
                        }}
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
                <Modal
  title="Event Details"
  visible={isEventModalVisible}
  onOk={() => setIsEventModalVisible(false)}
  onCancel={() => setIsEventModalVisible(false)}
  footer={[
    <Button key="back" onClick={() => setIsEventModalVisible(false)}>
      Close
    </Button>,
    <Button key="update" type="primary" onClick={handleUpdateEvent}>
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
      <p><strong>Start:</strong> {selectedEvent.start.toString()}</p>
      <p><strong>End:</strong> {selectedEvent.end.toString()}</p>
      <p><strong>Description:</strong> {selectedEvent.description}</p>
    </div>
  ) : null}
</Modal>

            </div>
        </Layout>
    );
}

export default AnnCalendar;
