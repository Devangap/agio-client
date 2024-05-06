import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { Tabs, Table, Card, Button } from 'antd'; 
import axios from "axios";
import { useDispatch } from "react-redux";
import Chart from 'chart.js/auto'; 
import "../Insurance.css";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logoImage from '../Images/logo.png';

const { TabPane } = Tabs;

function InfoCard({ title, value }) {
  return (
    <Card className="insinfo-card">
      <p className="insinfo-value">{value}</p>
      <p className="insinfo-title">{title}</p>
    </Card>
  );
}

function InsuranceStatus() {
  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [insurance24hData, setInsurance24hData] = useState([]);
  const [insuranceSLData, setInsuranceSLData] = useState([]);
  const [claimsToday, setClaimsToday] = useState(0);
  const [claimsApproved, setClaimsApproved] = useState(0);
  const [claimsRejected, setClaimsRejected] = useState(0);
  const [claims24h, setClaims24h] = useState(0);
  const [claimsSriLanka, setClaimsSriLanka] = useState(0);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const getInsuranceData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/insurance/getInsurance", {
        headers: {
          Authorization: 'Bearer ' + token 
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        
        const insurance = response.data.insurance;

        const approved = insurance.filter(item => item.status === 'approved');
        const rejected = insurance.filter(item => item.status === 'rejected');
        const insurance24h = insurance.filter(item => item.method === '24h Insurance');
        const insuranceSL = insurance.filter(item => item.method === 'Sri Lanka Insurance');
        setApprovedData(approved);
        setRejectedData(rejected);
        setInsurance24hData(insurance24h);
        setInsuranceSLData(insuranceSL);

        const today = new Date().toDateString();
        setClaimsToday(insurance.filter(item => new Date(item.createdAt).toDateString() === today).length);
        setClaimsApproved(approved.length);
        setClaimsRejected(rejected.length);
        setClaims24h(insurance24h.length);
        setClaimsSriLanka(insuranceSL.length);

        const claimsPerDay = [0, 0, 0, 0, 0, 0, 0]; 
        insurance.forEach(item => {
          const createdAt = new Date(item.createdAt);
          const dayOfWeek = createdAt.getDay(); 
          claimsPerDay[dayOfWeek]++;
        });

        const ctx = document.getElementById('claimChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'],
            datasets: [{
              label: 'Claims Submitted',
              data: claimsPerDay,
              backgroundColor: '#36a2eb',
              borderColor: 'rgba(54, 162, 235, 1)'
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching insurance data:", error);
    }
  };

  useEffect(() => {
    getInsuranceData();
  }, []);

  const handleDownloadReport = async () => {
    try {
      dispatch(showLoading());
  
      const doc = new jsPDF();
      doc.setFontSize(16);
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setDrawColor(0); 
      doc.setLineWidth(1); 
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10); 
  
      const logoWidth = 50; 
      const logoHeight = 50;
      const centerX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
      const centerY = 15;
      const logo = new Image();
      logo.src = logoImage;
      await new Promise(resolve => {
        logo.onload = () => resolve();
      });
      doc.addImage(logo, 'PNG', centerX, centerY, logoWidth, logoHeight);
  
      const reportText = 'Insurance Claims Overview Report';
      const textWidth = doc.getStringUnitWidth(reportText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      const textY = centerY + logoHeight + 10;
      doc.text(reportText, textX, textY);
  
      const claimsTextY = textY + 20; 
      doc.text('Claims Submitted Today: ' + claimsToday, 20, claimsTextY);
      doc.text('Approved Claims: ' + claimsApproved, 20, claimsTextY + 10);
      doc.text('Rejected Claims: ' + claimsRejected, 20, claimsTextY + 20);
      doc.text('24h Insurance Claims: ' + claims24h, 20, claimsTextY + 30);
      doc.text('Sri Lanka Insurance Claims: ' + claimsSriLanka, 20, claimsTextY + 40);
  
      const chartCanvas = document.getElementById('claimChart');
      const chartImageDataUrl = chartCanvas ? await html2canvas(chartCanvas).then(canvas => canvas.toDataURL()) : null;
      if (chartImageDataUrl) {
        doc.addImage(chartImageDataUrl, 'PNG', 20, claimsTextY + 60, 150, 100);
      }
  
      const tabsHtmlElements = document.querySelectorAll('.ant-tabs-tabpane');
      tabsHtmlElements.forEach(async (tabElement, index) => {
        const tabCanvas = await html2canvas(tabElement);
        const tabImageDataUrl = tabCanvas.toDataURL();
        if (index !== 0 || chartImageDataUrl) {
          doc.addPage(); 
        }
        doc.addImage(tabImageDataUrl, 'PNG', 20, 30, 150, 100);
      });
  
      doc.save('insurance_report.pdf');
  
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error generating PDF report:", error);
    }
  };
  
    
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: 'name',
    },
    {
      title: "Empid",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Number",
      dataIndex: "phoneNumber",
      key: 'phoneNumber',
    },
    {
      title: "Description",
      dataIndex: "description",
      key: 'description',
    },
  ];

  return (
    <Layout>
      <h1 className="institle">Insurance Claims Overview</h1>
      <hr/>
      <Button className = "insreportdownload" type="primary" onClick={handleDownloadReport} style={{ marginBottom: '20px', marginLeft: '14px', marginTop: '5px' }}>Download Report</Button>
      <div className="insadditional-info">
        <InfoCard title="Claims Submitted Today" value={claimsToday} />
        <InfoCard title="Approved Claims" value={claimsApproved} />
        <InfoCard title="Rejected Claims" value={claimsRejected} />
      </div>
      <div className="insadditional-info">
        <InfoCard title="24h Insurance Claims" value={claims24h} />
        <InfoCard title="Sri Lanka Insurance Claims" value={claimsSriLanka} />
      </div>
      <div className="inschart-container" >
        <div className="inschart-wrapper">
          <canvas id="claimChart" width="300" height="200"></canvas>
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Approved" key="1">
          <Table 
            columns={columns}
            dataSource={approvedData}
            pagination={false} 
          />
        </TabPane>
        <TabPane tab="Rejected" key="2">
          <Table 
            columns={columns}
            dataSource={rejectedData}
            pagination={false} 
          />
        </TabPane>
        <TabPane tab="24h Insurance" key="3">
          <Table 
            columns={columns}
            dataSource={insurance24hData}
            pagination={false} 
          />
        </TabPane>
        <TabPane tab="Sri Lanka Insurance" key="4">
          <Table 
            columns={columns}
            dataSource={insuranceSLData}
            pagination={false} 
          />
        </TabPane>
      </Tabs>
    </Layout>
  );
}

export default InsuranceStatus;
