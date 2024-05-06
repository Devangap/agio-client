import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal } from 'antd';
import Layout from '../components/Layout';
import { useReactToPrint } from 'react-to-print';

function TraVehicleviwe() {
  const [Vregister, setVregister] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDetails, setCurrentDetails] = useState('');
  const componentPDF = useRef();

  const fetchVregister = async () => {
    try {
      const response = await axios.get('/api/employee/getVehicles');
      const dataWithKey = response.data.vehicles.map(item => ({ ...item, key: item._id }));
      setVregister(dataWithKey);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch Vehicle');
    }
  };

  useEffect(() => {
    fetchVregister();
  }, []);

  const showModal = (details) => {
    setCurrentDetails(details);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

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
      title: 'Emissions Certificate Details',
      dataIndex: 'ECDetails',
      key: 'ECDetails',
      render: (text) => (
        <span onClick={() => showModal(text.length > 10 ? text : '')}>
          {text.length > 10 ? `${text.slice(0, 10)}... (See More)` : text}
        </span>
      ),
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
      render: (text) => (
        <span onClick={() => showModal(text.length > 10 ? text : '')}>
          {text.length > 10 ? `${text.slice(0, 10)}... (See More)` : text}
        </span>
      ),
    },
    {
      title: 'Owner Details',
      dataIndex: 'OwnerDetails',
      key: 'OwnerDetails',
      render: (text) => (
        <span onClick={() => showModal(text.length > 10 ? text : '')}>
          {text.length > 10 ? `${text.slice(0, 10)}... (See More)` : text}
        </span>
      ),
    },
  ];

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'VEHICLE DETAILS',
    onAfterPrint: () => alert('Data Saved in PDF'),
  });

  return (
    <Layout>
      <div ref={componentPDF} style={{ width: '100%' }}>
        <h3>ALL VEHICLE DETAILS</h3>
        <Table dataSource={Vregister} columns={columns} />
      </div>

      <Modal
        title="Details"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <p>{currentDetails}</p>
      </Modal>

      <Button className="bookdetails" onClick={generatePDF}>
        Download Report
      </Button>
    </Layout>
  );
}

export default TraVehicleviwe;
