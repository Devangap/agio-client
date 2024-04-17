import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Input } from 'antd';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

import { Table, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/empalerts';
import toast from 'react-hot-toast';

function LeaveOverview() {
    const [totalMedicalLeaves, setTotalMedicalLeaves] = useState(0);
    const [totalGeneralLeaves, setTotalGeneralLeaves] = useState(0);
    const [totalAnnualLeaves, setTotalAnnualLeaves] = useState(0);
    const [showChart, setShowChart] = useState(false); // State to manage chart visibility
    const dispatch = useDispatch();
    const [leaveData, setLeaveData] = useState([]);
    const token = localStorage.getItem('token');
    const [searchText, setSearchText] = useState('');
    const [monthlyMedicalLeaves, setMonthlyMedicalLeaves] = useState({});
    const [monthlyGeneralLeaves, setMonthlyGeneralLeaves] = useState({});
    const [monthlyAnnualLeaves, setMonthlyAnnualLeaves] = useState({});
    const [quarterlyMedicalLeaves, setQuarterlyMedicalLeaves] = useState({});
    const [quarterlyGeneralLeaves, setQuarterlyGeneralLeaves] = useState({});
    const [quarterlyAnnualLeaves, setQuarterlyAnnualLeaves] = useState({}); 
    const [yearlyMedicalLeaves, setYearlyMedicalLeaves] = useState({});
const [yearlyGeneralLeaves, setYearlyGeneralLeaves] = useState({});
const [yearlyAnnualLeaves, setYearlyAnnualLeaves] = useState({});


    const handleSearch = (value) => {
        setSearchText(value);
    };

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
                const remainingAnnualLeave = employeeDetails[index].annual_leave;
                const remainingGeneralLeave = employeeDetails[index].general_leave;
                const remainingMedicalLeave = employeeDetails[index].medical_leave;
                return {
                    ...leave,
                    empid: employeeDetails[index].empid,
                    department: employeeDetails[index].department,
                    dob: employeeDetails[index].dob,
                    remainingAnnualLeave: remainingAnnualLeave,
                    remainingGeneralLeave: remainingGeneralLeave,
                    remainingMedicalLeave: remainingMedicalLeave,
                    
                };
            });

            console.log(leaveDataWithEmployeeDetails);
            console.log(employeeDetails);
            console.log('Departments:');
leaveDataWithEmployeeDetails.forEach(item => {
    console.log('Department:', item.department);
});
            

            console.log('Employees Date of Birth:');
            leaveDataWithEmployeeDetails.forEach(item => {
                const dob = new Date(item.dob); // Assuming dob is the property name
                const monthName = dob.toLocaleDateString('en-US', { month: 'long' });
                console.log('Month of Birth:', monthName);
            });

            setLeaveData(leaveDataWithEmployeeDetails);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch leave data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Fetch total medical leaves from backend
        axios.get('/api/employee/total-medical-leaves')
            .then(response => {
                setTotalMedicalLeaves(response.data.totalMedicalLeaves);
                // Show chart if total medical leaves are greater than 0
                setShowChart(response.data.totalMedicalLeaves > 0);
            })
            .catch(error => {
                console.error('Error fetching total medical leaves:', error);
            });

        // Fetch total general leaves from backend
        axios.get('/api/employee/total-general-leaves')
            .then(response => {
                setTotalGeneralLeaves(response.data.totalGeneralLeaves);
            })
            .catch(error => {
                console.error('Error fetching total general leaves:', error);
            });

        // Fetch total annual leaves from backend
        axios.get('/api/employee/total-annual-leaves')
            .then(response => {
                setTotalAnnualLeaves(response.data.totalAnnualLeaves);
            })
            .catch(error => {
                console.error('Error fetching total annual leaves:', error);
            });

        // Fetch monthly medical leaves from backend
      
            // Fetch monthly medical leaves from backend
            axios.get('api/employee/monthly-medical-leaves')
        .then(response => {
            // Assuming the response data structure is { monthlyMedicalLeaves: {...} }
            const { monthlyMedicalLeaves } = response.data;
            
            // Log the received data to verify
            console.log('Received Monthly Medical Leaves:', monthlyMedicalLeaves);
            console.log('dev',monthlyMedicalLeaves.month)

            // Update the state with the received data
            setMonthlyMedicalLeaves(monthlyMedicalLeaves);
        })
        .catch(error => {
            console.error('Error fetching monthly medical leaves:', error);
            // Handle errors gracefully, e.g., show a message to the user
        });
        axios.get('/api/employee/monthly-general-leaves')
            .then(response => {
                // Assuming the response data structure is { monthlyGeneralLeaves: {...} }
                const { monthlyGeneralLeaves } = response.data;
                
                // Log the received data to verify
                console.log('Received Monthly General Leaves:', monthlyGeneralLeaves);

                // Update the state with the received data
                setMonthlyGeneralLeaves(monthlyGeneralLeaves);
            })
            .catch(error => {
                console.error('Error fetching monthly general leaves:', error);
                // Handle errors gracefully, e.g., show a message to the user
            });

        // Fetch monthly annual leaves data
        axios.get('/api/employee/monthly-annual-leaves')
            .then(response => {
                // Assuming the response data structure is { monthlyAnnualLeaves: {...} }
                const { monthlyAnnualLeaves } = response.data;
                
                // Log the received data to verify
                console.log('Received Monthly Annual Leaves:', monthlyAnnualLeaves);

                // Update the state with the received data
                setMonthlyAnnualLeaves(monthlyAnnualLeaves);
            })
            .catch(error => {
                console.error('Error fetching monthly annual leaves:', error);
                // Handle errors gracefully, e.g., show a message to the user
            });
            axios.get('/api/employee/quarterly-medical-leaves')
    .then(response => {
        // Assuming the response data structure is { quarterlyMedicalLeaves: [...] }
        const { quarterlyMedicalLeaves } = response.data;

        // Log the received data to verify
        console.log('Received Quarterly Medical Leaves:', quarterlyMedicalLeaves);

        // Update the state with the received data
        setQuarterlyMedicalLeaves(quarterlyMedicalLeaves);
        setShowChart(true); // Assuming you want to show the chart after fetching quarterly data
    })
    .catch(error => {
        console.error('Error fetching quarterly medical leaves:', error);
        // Handle errors gracefully, e.g., show a message to the user
    });

// Fetch quarterly general leaves data
axios.get('/api/employee/quarterly-general-leaves')
    .then(response => {
        // Assuming the response data structure is { quarterlyGeneralLeaves: [...] }
        const { quarterlyGeneralLeaves } = response.data;

        // Log the received data to verify
        console.log('Received Quarterly General Leaves:', quarterlyGeneralLeaves);

        // Update the state with the received data
        setQuarterlyGeneralLeaves(quarterlyGeneralLeaves);
    })
    .catch(error => {
        console.error('Error fetching quarterly general leaves:', error);
        // Handle errors gracefully, e.g., show a message to the user
    });

// Fetch quarterly annual leaves data
axios.get('/api/employee/quarterly-annual-leaves')
    .then(response => {
        // Assuming the response data structure is { quarterlyAnnualLeaves: [...] }
        const { quarterlyAnnualLeaves } = response.data;

        // Log the received data to verify
        console.log('Received Quarterly Annual Leaves:', quarterlyAnnualLeaves);

        // Update the state with the received data
        setQuarterlyAnnualLeaves(quarterlyAnnualLeaves);
    })
    .catch(error => {
        console.error('Error fetching quarterly annual leaves:', error);
        // Handle errors gracefully, e.g., show a message to the user
    });
    // Fetch yearly medical leaves data
axios.get('/api/employee/yearly-medical-leaves')
.then(response => {
    // Assuming the response data structure is { yearlyMedicalLeaves: {...} }
    const { yearlyMedicalLeaves } = response.data;

    // Log the received data to verify
    console.log('Received Yearly Medical Leaves:', yearlyMedicalLeaves);

    // Update the state with the received data
    setYearlyMedicalLeaves(yearlyMedicalLeaves);
})
.catch(error => {
    console.error('Error fetching yearly medical leaves:', error);
    // Handle errors gracefully, e.g., show a message to the user
});

// Fetch yearly general leaves data
axios.get('/api/employee/yearly-general-leaves')
.then(response => {
    // Assuming the response data structure is { yearlyGeneralLeaves: {...} }
    const { yearlyGeneralLeaves } = response.data;

    // Log the received data to verify
    console.log('Received Yearly General Leaves:', yearlyGeneralLeaves);

    // Update the state with the received data
    setYearlyGeneralLeaves(yearlyGeneralLeaves);
})
.catch(error => {
    console.error('Error fetching yearly general leaves:', error);
    // Handle errors gracefully, e.g., show a message to the user
});

// Fetch yearly annual leaves data
axios.get('/api/employee/yearly-annual-leaves')
.then(response => {
    // Assuming the response data structure is { yearlyAnnualLeaves: {...} }
    const { yearlyAnnualLeaves } = response.data;

    // Log the received data to verify
    console.log('Received Yearly Annual Leaves:', yearlyAnnualLeaves);

    // Update the state with the received data
    setYearlyAnnualLeaves(yearlyAnnualLeaves);
})
.catch(error => {
    console.error('Error fetching yearly annual leaves:', error);
    // Handle errors gracefully, e.g., show a message to the user
});


    }, []);

    const columns = [
        {
            title: 'Employee ID',
            dataIndex: 'empid',
            key: 'empid',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Remaining Annual Leave count',
            dataIndex: 'remainingAnnualLeave',
            key: 'remainingAnnualLeave',
        },
        {
            title: 'Remaining General Leave count',
            dataIndex: 'remainingGeneralLeave',
            key: 'remainingGeneralLeave',
        },
        {
            title: 'Remaining Medical Leave count',
            dataIndex: 'remainingMedicalLeave',
            key: 'remainingMedicalLeave',
        },
    ];
    

    // Data for the pie chart
    const pieChartData = [
        { name: 'Medical Leaves', value: totalMedicalLeaves },
        { name: 'General Leaves', value: totalGeneralLeaves },
        { name: 'Annual Leaves', value: totalAnnualLeaves },
    ];
    
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const updatedBarChartData = {
        "2024": Object.entries(monthlyMedicalLeaves).map(([month, count]) => ({
            month: months[parseInt(month) - 1], // Convert month number to month name
            medical: count, // Assign medical leave count
            general: monthlyGeneralLeaves[month] || 0, // Assign general leave count or default to 0
           
            annual: monthlyAnnualLeaves[month] || 0 // Assign annual leave count or default to 0
        })),
        // Additional years if needed
    };
    const updatedBarChartDataquaterly = {
        "2024": [
            { quarter: 'Q1', medical: quarterlyMedicalLeaves[1] || 0, general: quarterlyGeneralLeaves[1] || 0, annual: quarterlyAnnualLeaves[1] || 0 },
            { quarter: 'Q2', medical: quarterlyMedicalLeaves[2] || 0, general: quarterlyGeneralLeaves[2] || 0, annual: quarterlyAnnualLeaves[2] || 0 },
            { quarter: 'Q3', medical: quarterlyMedicalLeaves[3] || 0, general: quarterlyGeneralLeaves[3] || 0, annual: quarterlyAnnualLeaves[3] || 0 },
            { quarter: 'Q4', medical: quarterlyMedicalLeaves[4] || 0, general: quarterlyGeneralLeaves[4] || 0, annual: quarterlyAnnualLeaves[4] || 0 }
        ],
        // Additional years if needed
    };
    const updatedYearlyChartData = Object.entries(yearlyMedicalLeaves).map(([year, count]) => ({
        year,
        medical: count || 0,
        general: yearlyGeneralLeaves[year] || 0,
        
        annual: yearlyAnnualLeaves[year] || 0
    }));
    const MonthlyLeaveDistribution = ({ updatedBarChartData }) => {
        const [showChart, setShowChart] = useState(true);
    
    }
    

    

    
    const filteredData = Array.from(new Set(leaveData.map(item => item.empid)))
    .map(empid => {
        return leaveData.find(item => item.empid === empid && 
            (item.name.toLowerCase().includes(searchText.toLowerCase()) || 
            item.empid.toLowerCase().includes(searchText.toLowerCase())));
    });

    return (
        <Layout>
            <div>
    <h4>Yearly General Leaves</h4>
    <ul>
        {Object.entries(yearlyGeneralLeaves).map(([year, count]) => (
            <li key={year}>{year}: {count}</li>
        ))}
    </ul>
</div>
<div>
    <h4>Yearly Medical Leaves</h4>
    <ul>
        {Object.entries(yearlyMedicalLeaves).map(([year, count]) => (
            <li key={year}>{year}: {count}</li>
        ))}
    </ul>
</div>

<div>
    <h4>Yearly Annual Leaves</h4>
    <ul>
        {Object.entries(yearlyAnnualLeaves).map(([year, count]) => (
            <li key={year}>{year}: {count}</li>
        ))}
    </ul>
</div>
            
             <h4>Leave Overview</h4>
<div style={{ width: '100%', margin: '0 auto' }}>
    {showChart && (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px' }}>
            <h6>Monthly Leave Distribution</h6>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(updatedBarChartData).map(year => (
                    <div key={year}>
                        <h5>{year}</h5>
                        <BarChart width={600} height={400} data={updatedBarChartData[year]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="general" fill="#8884d8" />
                            <Bar dataKey="annual" fill="#ffc658" />
                            <Bar dataKey="medical" fill="#82ca9d" />
                        </BarChart>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
<div style={{ width: '80%', margin: '0 auto' }}>
    {showChart && (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px' }}>
            <h6>Quarterly Leave Distribution</h6>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(updatedBarChartDataquaterly).map(year => (
                    <div key={year}>
                        <h5>{year}</h5>
                        <BarChart width={600} height={400} data={updatedBarChartDataquaterly[year]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="general" fill="#8884d8" />
                            <Bar dataKey="annual" fill="#ffc658" />
                            <Bar dataKey="medical" fill="#82ca9d" />
                        </BarChart>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
<div style={{ width: '80%', margin: '0 auto' }}>
    {showChart && (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px' }}>
            <h6>Yearly Leave Distribution</h6>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.keys(updatedYearlyChartData).map(year => (
                    <div key={year}>
                        <h5>{year}</h5>
                        <BarChart width={600} height={400} data={updatedYearlyChartData[year]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="leaveType" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="medical" fill="#82ca9d" />
                            <Bar dataKey="general" fill="#8884d8" />
                            <Bar dataKey="annual" fill="#ffc658" />
                        </BarChart>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
            <Input.Search
                placeholder="Search by name or employee Id"
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200, marginBottom: 16 }}
            />
            <Table dataSource={filteredData} columns={columns} />
            
            {/* <div>
                <h4>Pie Chart</h4>
                <PieChart width={400} height={400}>
                    <Pie dataKey="value" isAnimationActive={false} data={pieChartData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div> */}
        </Layout>
    );
                            }
export default LeaveOverview;