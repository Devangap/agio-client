import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import axios from 'axios'; // Import axios for making API requests
import { Modal, Button } from 'antd'; // Import Modal and Button from Ant Design


const LeaveCal = () => {
    const locales = {
        'en-US': enUS,
    };

    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    });

    const [leaveEvents, setLeaveEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

    useEffect(() => {
        // Fetch leave data from backend when component mounts
        const fetchLeaveData = async () => {
            try {
                const response = await axios.get('api/employee/getleave');
                const leaveData = response.data.leave;

                // Map leave data to events
                const events = leaveData.map((leave) => ({
                    id: leave._id,
                    userid:leave.userid, // Assign unique ID to each event
                    title: ` ${leave.name}, ${leave.Type}`, // Include name and department in title
                    start: new Date(leave.startDate), // Parse start date
                    end: new Date(leave.endDate), // Parse end date
                    Type: leave.Type, // Correct the property name to 'Type'
                    employeeId: leave.employeeId // Add employee ID to the event
                }));

                setLeaveEvents(events);
            } catch (error) {
                console.error('Error fetching leave data:', error);
            }
        };

        fetchLeaveData();
    }, []); // Run once when component mounts

    useEffect(() => {
        // Fetch employee details when selectedEvent changes
        const fetchEmployeeDetails = async () => {
            try {
                if (selectedEvent && selectedEvent.userid) {
                    const userId = selectedEvent.userid;
                    console.log(userId)
    
                    const response = await axios.get(`/api/employee/getuserfromleave/${userId}`);
                    setEmployeeDetails(response.data.employee);
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };
    
        fetchEmployeeDetails(); // Call fetchEmployeeDetails immediately
    }, [selectedEvent]); 

    const eventPropGetter = (event) => {
        let color = '#8884d8'; // Default color (purple)

        if (event.Type === 'Medical') {
            color = '#8884d8'; // Purple
        } else if (event.Type === 'General') {
            color = '#82ca9d'; // Blue
        } else if (event.Type === 'Annual') {
            color = '#ffc658'; // Yellow
        }

        return {
            style: {
                backgroundColor: color,
                height: '40px', // Set event height
            },
        };
    };

    const handleEventClick = (event) => {
        // Set the selected event when clicked
        setSelectedEvent(event);
        setModalVisible(true); // Show modal when event is clicked
    };

    const handleCloseModal = () => {
        // Reset selected event and employee details when closing the modal
        setSelectedEvent(null);
        setEmployeeDetails(null);
        setModalVisible(false); // Hide modal
    };

    return (
        <Layout>
            <h1>Leave Calendar</h1>
            <button>Add Leave</button>

            <div>
                <Calendar
                    localizer={localizer}
                    events={leaveEvents} // Pass leave events to the calendar
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: 50, fontFamily: 'Patrick Hand' }}
                    eventPropGetter={eventPropGetter} // Set event color based on leave type
                    onSelectEvent={handleEventClick} // Handle event click
                />
            </div>

            <Modal
                title="Leave Details"
                visible={modalVisible} // Control modal visibility
                onCancel={handleCloseModal} // Handle modal close
                footer={[
                    <Button key="close" onClick={handleCloseModal}>Close</Button>,
                ]}
            >
                <p>Name: {selectedEvent?.title?.split(',')[0]?.trim()}</p>
                <p>Type: {selectedEvent?.title?.split(',')[1]?.trim()}</p>
                {employeeDetails && (
                    <>
                        <p>Employee ID: {employeeDetails.empid}</p>
                        <p>Department: {employeeDetails.department}</p>
                        {/* Add more employee details as needed */}
                    </>
                )}
            </Modal>
        </Layout>
    );
};

export default LeaveCal;
