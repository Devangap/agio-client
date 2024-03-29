import React, { useEffect } from 'react';
import Layout from '../components/Layout'
import axios from 'axios';
import '../leaveEmp.css';
import { useNavigate } from 'react-router-dom';

function LeaveEmp() {
    const navigate = useNavigate();
    const getData = async () => {
        try {
            const response = await axios.post('/api/employee/get-employee-info-by-id', {} , {
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

    const handleLeaveSubmission = () => {
        navigate('/leaveEmpform'); 
    };

  return <Layout>
    <div>
    <button className="leavesub" onClick={handleLeaveSubmission}>Leave Submission</button>
    </div>
  
  </Layout>
}


export default LeaveEmp
