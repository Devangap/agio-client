import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Upload, message, Button, DatePicker, Table } from 'antd';
import axios from 'axios';

function Leaveempatt() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        if (selectedDate) {
            fetchAttendanceData();
        }
    }, [selectedDate]);

    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get('/api/employee/attendance', {
                params: {
                    date: selectedDate.format('YYYY-MM-DD')
                }
            });
            setAttendanceData(response.data.attendance);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            message.error('Failed to fetch attendance data');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username_log',
            key: 'username_log',
        },
        {
          title: 'Employee ID',
          dataIndex: 'empid',
          key: 'empid',
          render: (text) => text.split('_')[0] // Display only the empid part
      },
        {
            title: 'Attendance',
            dataIndex: 'attendance',
            key: 'attendance',
            render: (text) => text ? 'Present' : 'Absent'
        },
    ];

    return (
        <div>
            <Layout>
                <h1>Leave Employee Attendance</h1>
                <DatePicker 
                    onChange={handleDateChange} 
                    value={selectedDate} 
                    style={{ marginBottom: 16 }}
                    placeholder="Select date"
                />
                <Upload
                    name="csvFile"
                    action={'api/employee/uploadexcelattendance'}
                    beforeUpload={file => {
                        const isCSV = file.type === 'text/csv' || (file.type === 'application/vnd.ms-excel' && file.name.endsWith('.csv'));
                        if (!isCSV) {
                            message.error('You can only upload CSV files!');
                        }
                        return isCSV;
                    }}
                >
                    <Button className='LinsertEmp' style={{ float: 'right' }}>Insert Employee Attendance</Button>
                </Upload>
                {attendanceData && attendanceData.length > 0 && (
                    <Table dataSource={attendanceData} columns={columns} />
                )}
            </Layout>
        </div>
    );
}

export default Leaveempatt;
