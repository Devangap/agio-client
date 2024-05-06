import React, { useState } from 'react';
import Layout from '../components/Layout';
import { DatePicker,Table } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { MonthPicker } = DatePicker; 
function AnnReport() {
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [announcements, setAnnouncements] = useState([]);

    const handleMonthChange = (date, dateString) => {
        setSelectedMonth(date);
        fetchAnnouncements(dateString); 
    };

    const fetchAnnouncements = async (monthString) => {
        const response = await fetch(`/api/employee/AnnHRsupReport/month?month=${monthString}`);
        const data = await response.json();
        setAnnouncements(data);
    };
    const columns = [
        {
            title: 'Title',
            dataIndex: 'anntitle',
            key: 'anntitle',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Department',
            dataIndex: 'Department',
            key: 'Department',
        },
        {
            title: 'Upload Date',
            dataIndex: 'uploaddate',
            key: 'uploaddate',
            render: text => new Date(text).toLocaleDateString() // Format the date
        }
    ];
    const downloadPdfReport = () => {
        const doc = new jsPDF();
    
        autoTable(doc, {
            theme: 'striped',
            head: [['Title', 'Description', 'Department', 'Upload Date']],
            body: announcements.map(ann => [
                ann.anntitle,
                ann.Description,
                ann.Department,
                new Date(ann.uploaddate).toLocaleDateString()
            ]),
            startY: 20,
            headStyles: { fillColor: [22, 160, 133] }, // Add your own styling here
            margin: { top: 20 }
        });
    
        doc.text('Monthly Announcements Report', 14, 15);
        doc.save(`Monthly-Report-${selectedMonth?.format('YYYY-MM')}.pdf`);
    }
    
    

    return (
        <Layout>
            <div>
                <h1>Annual Report</h1>
                <p>Select a month for the report:</p>
                <MonthPicker
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                />
                  <button onClick={downloadPdfReport} className='leavesub'>
                Download Report
                </button>
                <Table
                    columns={columns}
                    dataSource={announcements}
                    rowKey="_id"
                    pagination={false} // Assuming you might not need pagination, adjust as necessary
                />
            </div>
        </Layout>
    );
}

export default AnnReport;
