import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';


function TraDriverViwe() {
    const navigate = useNavigate();

    const [Dregister, setDregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDregister, setCurrentDregister] = useState(null);
    const [filteredDregister, setFilteredDregister] = useState([]);
    const componentPDF = useRef();

    const fetchDregister = async () => {
        try {
            const response = await axios.get('/api/employee/getdrivers');
            const dataWithKey = response.data.drivers.map(item => ({ ...item, key: item._id }));
            setDregister(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch drivers');
        }
    };

    useEffect(() => {
        fetchDregister();
    }, []);


    const generatePDF = useReactToPrint({
        content: () => componentPDF.current,
        documentTitle: "VEHICLE DETAILS",
        onAfterPrint: () => alert("Data Saved in PDF")
    });

   /* const handleUpdate = async values => {
        try {
            const response = await axios.put(`/api/employee/updatedrivers/${currentDregister._id}`, values);
            if (response.data.success) {
                message.success('Driver updated successfully');
                setIsModalVisible(false);
                fetchDregister();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update Driver');
        }
    };*/

    const columns = [
        {
            title: 'Driver Name',
            dataIndex: 'driName',
            key: 'driName',
        },
        {
            title: 'Driver Email',
            dataIndex: 'driEmail',
            key: 'driEmail',
        },

        {
            title: 'Work Expereance',
            dataIndex: 'Type',
            key: 'Type',
        },
        
        {
            title: 'select Register Date',
            dataIndex: 'regdate',
            key: 'regdate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        
        {
            title: 'Driver PhoneNumber',
            dataIndex: 'driPnum',
            key: 'driPnum',
        },
        
    ];

    return (
        <Layout>
           <div>
            <div ref={componentPDF} style={{ width: '100%' }}>
                <Table dataSource={filteredDregister.length > 0 ? filteredDregister : Dregister} columns={columns} />
            </div>
            <Button className='btn btn-success' onClick={generatePDF}>
                Download Report
            </Button>
        </div>
            
        </Layout>
    );
}

export default TraDriverViwe;
