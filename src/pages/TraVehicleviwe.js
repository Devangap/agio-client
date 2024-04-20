import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input } from 'antd';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function TraVehicleviwe() {


    const navigate = useNavigate();
    

    const [Vregister, setVregister] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentVregister, setCurrentVregister] = useState(null); 
    const [filteredVregister, setFilteredVregister] = useState([]);
    const componentPDF = useRef();

    const fetchVregister = async () => {
        try {
            const response = await axios.get('/api/employee/getVehicles');
            // Assuming response.data.bookings is an array of bookings
            // Add a unique key (e.g., _id) to each booking for the Table component
            const dataWithKey = response.data.vehicles.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setVregister(dataWithKey);
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Vehicle");
        }
    };



    useEffect(() => {
        
        fetchVregister();
    }, []);



    

    const columns = [
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        

        {
            title: 'Vehicle Number',
            dataIndex: 'vehicleNum',
            key: 'vehicleNum',
        },

        {
            title: 'Emissions Certificate Details ',
            dataIndex: 'ECDetails',
            key: 'ECDetails',
        },
        {
            title: 'Select Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Licence Details',
            dataIndex: 'LicenceDetails',
            key: 'LicenceDetails',
        },
        
        
        {
            title: 'Owner Details',
            dataIndex: 'OwnerDetails',
            key: 'OwnerDetails',
        },
     
    ];

    const showModal = (Vregister) => {
        setCurrentVregister(Vregister);
        setIsModalVisible(true);
    };
   

    const generatePDF= useReactToPrint({
        content: ()=>componentPDF.current,
        documentTitle:"VEHICLE DETAILS",
        onAfterPrint:()=>alert("Data Saved in PDF")

    });

  return (
    <Layout>

        
         
            
            <div ref={componentPDF} style={{width: '100%'}}>
            <h3>ALL VEHICLE DETAILS</h3>
                <Table dataSource={filteredVregister.length > 0 ? filteredVregister : Vregister} columns={columns} />
                </div>

                <Button className="bookdetails"
      
      onClick={generatePDF}
    >
      Download Report
    </Button>
         

        

        </Layout>
  )
}

export default TraVehicleviwe;