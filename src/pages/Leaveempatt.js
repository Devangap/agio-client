import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Upload, message, Button, DatePicker, Table } from 'antd';
import axios from 'axios';
import '../att.css';

function Leaveempatt() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [leaveData, setLeaveData] = useState([]);

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
          const attendanceResponse = await axios.get('/api/employee/attendance', {
              params: {
                  date: selectedDate.format('YYYY-MM-DD')
              }
          });
          const leaveResponse = await axios.get('/api/employee/attendance_leave', {
              params: {
                  date: selectedDate.format('YYYY-MM-DD')
              }
          });
  
          const attendanceData = attendanceResponse.data.attendance;
          const employeeIds = leaveResponse.data.employeeIds;
  
          const updatedAttendanceData = attendanceData.map(attendance => {
              const empid = attendance.empid;
              const leaveSubmitted = empid.includes(employeeIds);
  
              if (!attendance.attendance && leaveSubmitted) {
                  return {
                      ...attendance,
                      leaveSubmission: 'Leave submitted'
                  };
              } else if (!leaveSubmitted) {
                  return {
                      ...attendance,
                      warning: true // Add a flag to indicate a warning needs to be sent
                  };
              }
  
              return attendance;
          });
  
          setAttendanceData(updatedAttendanceData);
      } catch (error) {
          console.error('Error fetching attendance data:', error);
          message.error('Failed to fetch attendance data');
      }
  };
  const renderLeaveSubmissionColumn = (text, record) => {
    if (!record.attendance && record.leaveSubmission === 'Leave submitted') {
        return (
            <span>Leave submitted</span>
        );
    } else if (!record.attendance && !record.leaveSubmission) {
        return (
            <Button >Send Warning</Button>
        );
    } else {
        return '-';
    }
};

    const rowClassName = (record) => {
        return record.attendance ? '' : 'absent-row';
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
            render: (text) => (text ? 'Present' : 'Absent')
        },
        {
          title: 'Leave Submission',
          dataIndex: 'leaveSubmission',
          key: 'leaveSubmission',
          render: renderLeaveSubmissionColumn
      }
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
                    beforeUpload={(file) => {
                        const isCSV =
                            file.type === 'text/csv' ||
                            (file.type === 'application/vnd.ms-excel' && file.name.endsWith('.csv'));
                        if (!isCSV) {
                            message.error('You can only upload CSV files!');
                        }
                        return isCSV;
                    }}
                >
                    <Button className="LinsertEmp" style={{ float: 'right' }}>
                        Insert Employee Attendance
                    </Button>
                </Upload>
                {attendanceData && attendanceData.length > 0 && (
                    <Table
                        dataSource={attendanceData}
                        columns={columns}
                        rowClassName={rowClassName}
                    />
                )}
            </Layout>
        </div>
    );
}

export default Leaveempatt;
