import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Upload, message, Button, DatePicker, Table, Modal } from 'antd'; // Import Modal from antd
import axios from 'axios';
import '../att.css';

function Leaveempatt() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [warningModalVisible, setWarningModalVisible] = useState(false); // State to control visibility of warning modal
    const [selectedEmployee, setSelectedEmployee] = useState(null); // State to store selected employee details

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
                <Button onClick={() => handleSendWarning(record)}>Send Warning</Button> // Call handleSendWarning function on button click
            );
        } else {
            return '-';
        }
    };

    const handleSendWarning = (record) => {
        // Set the selected employee details
        setSelectedEmployee(record);
        // Set the modal visible
        setWarningModalVisible(true);
    };

    const handleWarningSubmit = async () => {
      try {
          if (selectedEmployee) {
              const warningMessage = `Warning Regarding Attendance and Leave Submission\n\n` +
                  `Dear ${selectedEmployee.username_log},\n\n` +
                  `This is to inform you that you were marked as absent from work on ${selectedDate.format('YYYY-MM-DD')}. As per our company's policies, it is mandatory to submit leave requests for any planned absences in advance. Failure to do so can result in disciplinary action.\n\n` +
                  `We understand that unforeseen circumstances may arise, but it is important to communicate any issues affecting your attendance promptly. Consistent attendance and adherence to leave submission procedures are essential for the smooth operation of our team and the achievement of our organizational goals.\n\n` +
                  `Please be reminded of the consequences of repeated absences without proper leave submission, which may include further disciplinary measures.\n\n` +
                  `If you have any concerns or need assistance, please don't hesitate to reach out to the HR department.\n\n` +
                  `Thank you for your attention to this matter.\n\n` +
                  `Sincerely,\nDevanga Palliyaguru\nHr Supervisor`;
  
              const token = localStorage.getItem('token'); // Retrieve token from local storage or wherever it's stored
              const modifiedEmpid = selectedEmployee.empid.split('_')[0];; // Modify this value as needed

console.log('Modified Empid:', modifiedEmpid);
              const response = await axios.post('/api/employee/addWarning', {
                empid: modifiedEmpid, 
                  warning: {
                      date: new Date(),
                      message: warningMessage
                  }
              }, {
                  headers: {
                      Authorization: 'Bearer ' + token // Include token in headers
                  }
              });
  
              if (response.status === 200) {
                  setWarningModalVisible(false);
                  message.success('Warning submitted successfully');
              } else {
                  message.error('Failed to submit warning');
              }
          }
      } catch (error) {
          console.error('Error submitting warning:', error);
          message.error('Failed to submit warning');
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
            {/* Warning Modal */}
            <Modal
                title="Warning"
                visible={warningModalVisible}
                onCancel={() => setWarningModalVisible(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={handleWarningSubmit}>
                        Submit
                    </Button>,
                    <Button key="back" onClick={() => setWarningModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                {selectedEmployee && (
                    <>
                        <p>
                            <strong>Subject:</strong> Warning Regarding Attendance and Leave Submission
                        </p>
                        <p>
                            Dear {selectedEmployee.username_log},
                        </p>
                        <p>
                            This is to inform you that you were marked as absent from work on {selectedDate.format('YYYY-MM-DD')}. As per our company's policies, it is mandatory to submit leave requests for any planned absences in advance. Failure to do so can result in disciplinary action.
                        </p>
                        <p>
                            We understand that unforeseen circumstances may arise, but it is important to communicate any issues affecting your attendance promptly. Consistent attendance and adherence to leave submission procedures are essential for the smooth operation of our team and the achievement of our organizational goals.
                        </p>
                        <p>
                            Please be reminded of the consequences of repeated absences without proper leave submission, which may include further disciplinary measures.
                        </p>
                        <p>
                            If you have any concerns or need assistance, please don't hesitate to reach out to the HR department.
                        </p>
                        <p>
                            Thank you for your attention to this matter.
                        </p>
                        <p>
                            Sincerely,
                            <br />
                            Devanga Palliyaguru
                            <br />
                            Hr Supervisor
                        </p>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default Leaveempatt;
