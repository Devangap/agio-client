import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Button, Table } from 'antd';
import axios from 'axios'; // Import Axios
import Layout from '../components/Layout'; // Assuming Layout is your custom component
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from "../Images/logo.png"

const { Option } = Select;

function LeaveReport() {
  const [loading, setLoading] = useState(false); // State to manage loading state of the button
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (reportData.length > 0) {
      console.log('Report data:', reportData);
    }
  }, [reportData]);

  const handleGenerateReport = async () => {
    setLoading(true); // Set loading state to true while waiting for the response
    try {
      // Make a request to the backend endpoint with the selected year, month, and department
      const response = await axios.get('/api/employee/leave-report', {
        params: {
          month: selectedMonth,
          department: selectedDepartment
        }
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error generating report:', error);
      // Handle errors
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  const downloadPdfReport = async () => {
    const doc = new jsPDF();
    const logoWidth = 50;
    const logoHeight = 50;
    const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
    const logoY = 15;
    const tableY = 100; // Adjust as needed

    const logo = new Image();
    logo.src = logoImage;
    await new Promise(resolve => {
        logo.onload = () => resolve();
    });
    doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

    autoTable(doc, {
        theme: 'striped',
        head: [['Description', 'Type', 'Start Date', 'End Date', 'Status']],
        body: reportData.map(item => [
            item.leave.Description,
            item.leave.Type,
            item.leave.startDate,
            item.leave.endDate,
            item.leave.status
        ]),
        startY: tableY,
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 200 }
    });

    doc.text('Leave Report', 14, 15);
    doc.save('LeaveReport.pdf');
};
  const columns = [
    {
        title: 'Name',
        dataIndex: ['leave', 'name'],
        key: 'Description',
      },
    {
      title: 'Description',
      dataIndex: ['leave', 'Description'],
      key: 'Description',
    },
    {
      title: 'Type',
      dataIndex: ['leave', 'Type'],
      key: 'Type',
    },
    {
      title: 'Start Date',
      dataIndex: ['leave', 'startDate'],
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: ['leave', 'endDate'],
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: ['leave', 'status'],
      key: 'status',
    },
  ];

  return (
    <Layout>
      <h3
        style={{
          fontWeight: 'bold',
          marginTop: '10px',
          marginRight: '10px',
          marginBottom: '30px'
        }}
      >
        Generate Leave Report
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <DatePicker picker="month" style={{ marginRight: '10px' }} onChange={(date, dateString) => setSelectedMonth(dateString)} />
        <Select
          className="department-select" // Add a unique class name
          placeholder="Choose department"
          style={{ width: "450px", height: "50px" }}
          onChange={(value) => setSelectedDepartment(value)}
        >
          <Option value="HR">HR</Option>
          <Option value="Logistics">Logistics</Option>
          <Option value="Procurement Department">Procurement Department</Option>
          <Option value="Quality Assurance">Quality Assurance</Option>
          <Option value="Production Department">Production Department</Option>
          <Option value="Sales and Marketing">Sales and Marketing</Option>
          <Option value="Finance and Accounting">Finance and Accounting</Option>
        </Select>
        <div style={{ marginTop: '0px', marginLeft: '10px', display: 'flex', alignItems: 'flex-start' }}>
  <Button style={{ backgroundColor: '#ffc658' }} type="primary" onClick={handleGenerateReport} loading={loading}>Generate Report</Button>
  <Button style={{ backgroundColor: '#ffc658' ,marginLeft: '10px'}}  type="primary" onClick={downloadPdfReport} >Download</Button>
</div>
      </div>
     
      <div style={{ marginTop: '20px' }}>
        <Table columns={columns} dataSource={reportData} />
      </div>
    </Layout>
  );
}

export default LeaveReport;
