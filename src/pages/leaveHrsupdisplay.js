import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker ,Card} from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';
import toast from 'react-hot-toast';
import moment from 'moment'; 

function LeaveHrsupdisplay() {
    const [leaveData, setLeaveData] = useState([]);
    const {user} = useSelector((state) => state.user);
    const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [suggestedDate, setSuggestedDate] = useState(null);
    const [recordId, setRecordId] = useState(null);
 
    const [suggestedDateAdded, setSuggestedDateAdded] = useState(false);
    const [showEditSuggestDateModal, setShowEditSuggestDateModal] = useState(false);
    const [editSuggestedDate, setEditSuggestedDate] = useState(null);

    const fetchData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get('/api/employee/getleave', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
    
            // Extract user IDs from leave data
            const userIds = response.data.leave.map(item => item.userid);
    
            // Fetch employee details based on user IDs
            const employeeDetailsPromises = userIds.map(async (userId) => {
                const employeeInfoResponse = await axios.post('/api/employee/getemployeeinfobyuserid', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                });
                return employeeInfoResponse.data.data;
            });
    
            // Wait for all promises to resolve
            const employeeDetails = await Promise.all(employeeDetailsPromises);
    
            // Combine leave data with employee details
            const leaveDataWithEmployeeDetails = response.data.leave.map((leave, index) => {
           
                return {
                    ...leave,
                    empid: employeeDetails[index].empid,
                    department:employeeDetails[index].department,
                    
                };
            });
    
            console.log(leaveDataWithEmployeeDetails);
            console.log(employeeDetails);
    
            setLeaveData(leaveDataWithEmployeeDetails);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch leave data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredData = leaveData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const changeLeaveCount = async (record) => {
        try {
            // Fetch the leave data using the leaveid
            const responseLeave = await axios.get(`/api/employee/getleave3/${record._id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
    
            if (!responseLeave.data.success) {
                toast.error("Failed to fetch leave data.");
                return;
            }
    
            const leaveData = responseLeave.data.leave;
            const leave = leaveData; // Assuming the leave data is returned as an object
    
            // Check if the leave type is "Medical"
            if (leave.Type === 'Medical') {
                // If it's a medical leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the medical_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountmed', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting medical leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else if (leave.Type === 'Annual') {
                // If it's an annual leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the annual_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountannual', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting annual leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else if (leave.Type === 'General') {
                // If it's a general leave, fetch the userid of that leave
                const userId = record.userid;
                console.log(userId);
                // Deduct one from the general_leave field in the employee database
                const responseDeduct = await axios.post('/api/employee/leavecountgeneral', { userid: userId }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
    
                if (responseDeduct.data.success) {
                    toast.success(responseDeduct.data.message);
                    fetchData(); // Refresh the leave data after deducting general leave
                } else {
                    toast.error(responseDeduct.data.message);
                }
            } else {
                toast.error("Leave is not of type Medical, Annual, or General.");
            }
        } catch (error) {
            toast.error("Error deducting leave.");
        }
    };
    const handleSuggestDate = (record) => {
        // Logic to handle suggesting a date
        setShowSuggestDateModal(true);
        setRecordId(record._id); // Set the record ID in state
        setEditSuggestedDate(false); // Reset the button text to "Suggest Date"
    };

    const handleOk = async () => {
        try {
            // Handle the selected date here, e.g., send it to backend, update state, etc.
            setShowSuggestDateModal(false);
            await handleSuggestDates(recordId, selectedDate); // Pass the record ID to handleSuggestDates
            setSuggestedDateAdded(true); // Set suggestedDateAdded to true after successfully adding the suggested date
            fetchData(); // Refresh the data
        } catch (error) {
            console.error('Error handling suggested date:', error);
            toast.error('Failed to handle suggested date');
        }
    };
    const handleSuggestDates = async (recordId, suggestedDate) => {
        try {
            // Make a POST request to the backend endpoint to add the suggested date
            const response = await axios.post(`/api/employee/${recordId}/suggest-date`, { suggestedDate });
            
            // Handle success
            console.log('Suggested date added:', response.data);
            // Show success message
            toast.success('Suggested date added successfully');
            // Reset the suggested date state after successful addition
            setSelectedDate(null);
        } catch (error) {
            // Handle error
            console.error('Error adding suggested date:', error);
            // Show error message
            toast.error('Failed to add suggested date');
        }
    };
    const handleEditSuggestDates = (record) => {
        setShowEditSuggestDateModal(true);
        setRecordId(record._id);
        setEditSuggestedDate(new Date(record.suggestedDate));
    };
    
    const handleEditOk = async () => {
        try {
            setShowEditSuggestDateModal(false);
            if (editSuggestedDate !== null) {
                await updateSuggestedDate(recordId, editSuggestedDate);
                setSuggestedDateAdded(true);
                fetchData();
            }
        } catch (error) {
            console.error('Error handling edit suggested date:', error);
            toast.error('Failed to handle edit suggested date');
        }
    };
    
    const updateSuggestedDate = async (recordId, suggestedDate) => {
        try {
            const response = await axios.put(`/api/employee/${recordId}/suggest-date`, { suggestedDate });
            
            // Handle success
            console.log('Suggested date updated:', response.data);
            toast.success('Suggested date updated successfully');
            setEditSuggestedDate(null); // Reset the editSuggestedDate state after successful update
        } catch (error) {
            console.error('Error updating suggested date:', error);
            toast.error('Failed to update suggested date');
        }
    };
    


    const changestatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/change_status', {
                leaveid: record._id,
                userid: record.userid,
                status: status
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                fetchData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            toast.error("Error changing status.");
        }
    };
    const approvedLeaves = leaveData.filter(item => item.status === 'approved').length;
    const pendingLeaves = leaveData.filter(item => item.status === 'pending').length;
    const rejectedLeaves = leaveData.filter(item => item.status === 'rejected').length;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => {
                return new Date(text).toLocaleDateString('en-US');
            }
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => {
                return new Date(text).toLocaleDateString('en-US');
            }
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Documents',
            dataIndex: 'filePath', // Adjust based on your data structure
            key: 'file',
            render: (_, record) => {
                const filename = record?.file?.filename;

                const backendUrl = 'http://localhost:5001/';

                const filePath = filename ? `${backendUrl}uploads/${filename}` : '';

                // Render a download button if a file exists
                return filename ? (
                    <Button
                        type="link"
                        href={filePath}
                        target="_blank"
                        download={filename} // Add the download attribute
                    >
                        View PDF
                    </Button>
                ) : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'Description',
        },


        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <div className="d-flex">
    {record.status === "pending" && (
        <>
            <Button type="primary" style={{ backgroundColor: '#ffc658' }} className="approvebut" onClick={() => { changestatus(record, 'approved'); changeLeaveCount(record); }}>Approve</Button>
            <Button type="primary" style={{ borderColor: 'red', color: 'red', backgroundColor: 'white' }} className="rejectbut" onClick={() => changestatus(record, 'rejected')}>Reject</Button>
        </>
    )}
    {record.status === "approved" && (
        <Button type="primary" style={{ borderColor: 'red', color: 'red', backgroundColor: 'white' }} className="rejectbut" onClick={() => changestatus(record, 'rejected')}>Reject</Button>
    )}
    {record.status === "rejected" && (
        <>
            {record.suggestedDate && ( // Render Edit Suggested Date button only if there's a suggested date
                <Button type="primary" className="editSuggestedDateButton"onClick={() => handleEditSuggestDates(record)}>Edit Suggested Date</Button>
            )}
            {!record.suggestedDate && ( // Render Suggest Date button only if there's no suggested date
                <Button type="primary" style={{ borderColor: 'green', color: 'green', backgroundColor: 'white' }} className="suggestDateButton" onClick={() => handleSuggestDate(record)}>Suggest Date</Button>
            )}
        </>
    )}
</div>

                </>
            ),
        },
    ];

    return (
        <Layout>
             <Modal
                title="Edit Suggested Date"
                visible={showEditSuggestDateModal}
                onCancel={() => setShowEditSuggestDateModal(false)}
                onOk={handleEditOk}
            >
                <p>Select a new date:</p>
                <DatePicker
    onChange={date => setEditSuggestedDate(date)}
    value={editSuggestedDate ? moment(editSuggestedDate) : null} // Convert to moment object if not null
    className="suggestedDate" // Adding classname to the date field
/>
            </Modal>

             <Modal
                title="Suggest Date"
                visible={showSuggestDateModal}
                onCancel={() => setShowSuggestDateModal(false)}
                onOk={handleOk}
            >
                {/* Content of the modal */}
                <p>Select a date:</p>
                <DatePicker 
                    onChange={date => setSelectedDate(date)} 
                    value={selectedDate} 
                    className="suggestedDate" // Adding classname to the date field
                />
            </Modal>
            <div className="leave-types" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Card  title = "Approved Leaves "className="leave-type-card"  bordered={false}>
            <div className="leave-description" style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>{approvedLeaves}</h1>
                    </div>
                </Card>
                
                <Card title="Pending Leaves" className="leave-type-card"  bordered={false}>
                <div className="leave-description" style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>{pendingLeaves}</h1>
                    </div>
                </Card>
                <Card title="Rejected Leaves"  className="leave-type-card"  bordered={false}>
                <div className="leave-description" style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>{rejectedLeaves}</h1>
                    </div>
                </Card>
            </div>
            <div className = "remaining">
            <div className = "searchleave">
            <Input.Search
                placeholder="Search by name"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200, marginBottom: 16 }}
            
            />
            </div>
           <Table dataSource={filteredData} columns={columns} />
           </div>
        </Layout>
    );
}

export default LeaveHrsupdisplay;