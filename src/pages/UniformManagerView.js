import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Button, Select, Modal, Form, message } from 'antd';
import moment from 'moment';
import { Document, Page, Text, PDFDownloadLink, Image, StyleSheet, View } from '@react-pdf/renderer';
import Layout from '../components/Layout';
import '../UniformManagerView.css'; 
import logoImage from '../Images/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



const { Option } = Select;

function UniformOrders() {
  const [uniformOrders, setUniformOrders] = useState([]);
  const [filters, setFilters] = useState({
    employeeNumber: null,
    waistSize: null,
    position: null,
    orderDate: null
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [waistSizeDisabled, setWaistSizeDisabled] = useState(false);
  const [searchId, setSearchId] = useState(""); 

  const fetchUniformOrders = async () => {
    try {
      const response = await axios.get('/api/uniformOrder');
      setUniformOrders(response.data);
    } catch (error) {
      console.error('Error fetching uniform orders:', error);
    }
  };

  useEffect(() => {
    fetchUniformOrders();
  }, []);

  const handleUpdate = (record) => {
    setUpdateRecord(record);
    if (record.position === "Executive") {
      setWaistSizeDisabled(true);
    } else {
      setWaistSizeDisabled(false);
    }
    setModalVisible(true);
  };

  const handleUpdateSubmit = async (values) => {
    try {
      await axios.put(`/api/uniformOrder/${updateRecord._id}`, values);
      fetchUniformOrders();
      setModalVisible(false);
      toast.success('Uniform order updated successfully');
    } catch (error) {
      console.error('Error updating uniform order:', error);
      toast.error('Failed to update uniform order');
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/api/uniformOrder/${key}`);
      fetchUniformOrders();
      toast.success('Uniform order deleted successfully');
    } catch (error) {
      console.error('Error deleting uniform order:', error);
      toast.error('Failed to delete uniform order');
    }
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleStatusButtonClick = () => {
    // Redirect to the UniformStatus page
    window.location.href = '/UniformStatus'; 
  };

  const handleSearch = () => {
    if (searchId.trim() === "") {
      toast.success("Please enter a valid ID");
      return;
    }

    const foundOrder = uniformOrders.find(order => order.employeeNumber === searchId);
    if (!foundOrder) {
      toast.success("No order found with that ID");
      return;
    }

    setUniformOrders([foundOrder]);
  };

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
    
    if (e.target.value.trim() === "") {
      fetchUniformOrders();
    }
  };
  
  const styles = StyleSheet.create({
    page: {
      padding: 20,
    },
    logo: {
      width: 100,
      height: 'auto',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: 'center', // Center align the title
      color: '#1F1300', // Dark brown color
    },
    section: {
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: '#1F1300', // Dark brown color
    },
    listItem: {
      fontSize: 12,
      marginBottom: 5,
      color: '#F7B05B', 
    },
    signatureContainer: {
      position: 'absolute',
      bottom: 40,
      left: 40,
      flexDirection: 'column',
    },
    signatureField: {
      marginBottom: 10,
      color: '#1F1300', // Dark brown color
    },
    date: {
      position: 'absolute',
      bottom: 40,
      right: 40,
      color: '#1F1300', // Dark brown color
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 3,
      borderRightWidth: 3,
      borderBottomWidth: 3,
    },
    tableRow: {
      flexDirection: 'row',
    },
    tableCellHeader: {
      margin: 10,
      fontSize: 5,
      fontWeight: 'bold',
      borderStyle: 'solid',
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderTopColor: '#000',
      borderLeftColor: '#000',
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
      borderStyle: 'solid',
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderLeftColor: '#000',
    },
  });


  const handleDownloadReport = () => {
    const ReportDocument = (
      <Document>
      <Page size="A4" style={styles.page}>
      <Image src={logoImage} style={styles.logo} />
      <Text style={styles.title}>Uniform Orders</Text>

        <View>
          <View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Employee Number</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Position</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>T-shirt Size</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Waist Size</Text>
                <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Uniform Count</Text>
                
              </View>
              {uniformOrders.map(order => (
                <View style={styles.tableRow} key={order._id}>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{order.employeeNumber}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{order.position}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{order.tshirtSize}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{order.waistSize}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{order.uniformCount}</Text>
                
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* Signature */}
      <View style={styles.signatureContainer}>
        <Text style={styles.signatureField}>Name: __________________________</Text>
        <Text style={styles.signatureField}>Position: ________________________</Text>
        <Text style={styles.signatureField}>Signature: _______________________</Text>
      </View>
      
      {/* Date */}
      <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
    );

    const pdfName = 'uniform_orders_report.pdf';

    return (
      <PDFDownloadLink document={ReportDocument} fileName={pdfName}>
        {({ loading }) => (
          <Button className="uniform-manager-view-download-report-button" type="primary" loading={loading}>
            {loading ? 'Generating PDF...' : 'Download Report'}
          </Button>
        )}
      </PDFDownloadLink>
    );
  };

  const columns = [
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'T-shirt Size',
      dataIndex: 'tshirtSize',
      key: 'tshirtSize',
    },
    {
      title: 'Waist Size',
      dataIndex: 'waistSize',
      key: 'waistSize',
    },
    {
      title: 'Uniform Count',
      dataIndex: 'uniformCount',
      key: 'uniformCount',
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button className="uniform-manager-view-action-buttons" onClick={() => handleUpdate(record)}>Update</Button>
          <Button className="uniform-manager-view-action-buttons" onClick={() => handleDelete(record._id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="uniform-manager-view-container">
        <h1>Uniform Orders</h1>
        <div className="uniform-manager-view-search-container" style={{ marginBottom: '10px' }}>
          <Input
            className="uniform-manager-view-search-input"
            value={searchId}
            onChange={handleSearchChange}
            placeholder="Search by Employee Number"
          />
          <Button className="custom-search-button" type="primary" onClick={handleSearch}>Search</Button>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
  
        <div style={{ marginBottom: '10px' }}>
          {handleDownloadReport()}
          <Button className="uniform-manager-view-download-report-button" type="primary" onClick={handleStatusButtonClick}>Order Status</Button>
        </div>
        <Modal
          className="uniform-manager-view-update-modal"
          title="Update Uniform Order"
          visible={modalVisible}
          onCancel={handleCancel}
          footer={null}
        >
        <Form
          layout="vertical"
          onFinish={handleUpdateSubmit}
          initialValues={{
            position: updateRecord?.position,
            tshirtSize: updateRecord?.tshirtSize,
            waistSize: updateRecord?.waistSize,
            uniformCount: updateRecord?.uniformCount,
          }}
        >
          <Form.Item label="Position">
            <Input value={updateRecord?.position} disabled />
          </Form.Item>
          <Form.Item label="T-shirt Size" name="tshirtSize" rules={[{ required: true, message: 'Please select the t-shirt size!' }]}>
            <Select>
              <Option value="Small">Small</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Large">Large</Option>
              <Option value="XL">XL</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Waist Size" name="waistSize" rules={[{ required: true, message: 'Please input the waist size!' }]}>
            <Select disabled={waistSizeDisabled}>
              <Option value={28}>28</Option>
              <Option value={30}>30</Option>
              <Option value={32}>32</Option>
              <Option value={34}>34</Option>
              <Option value={36}>36</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Uniform Count" name="uniformCount" rules={[{ required: true, message: 'Please select the uniform count!' }]}>
            <Select>
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
              <Option value={3}>3</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        <Table dataSource={uniformOrders} columns={columns} />
      </div>
    </div>
  </Layout>
);
}

export default UniformOrders;
