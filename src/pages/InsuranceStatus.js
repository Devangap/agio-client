import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { Table, Tabs } from 'antd'; 
import axios from "axios";
import { useDispatch } from "react-redux";

const { TabPane } = Tabs;

function InsuranceStatus() {
  const [approvedData, setApprovedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [insurance24hData, setInsurance24hData] = useState([]);
  const [insuranceSLData, setInsuranceSLData] = useState([]);
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
        // Filter data for each tab
        const approved = insurance.filter(item => item.status === 'approved');
        const rejected = insurance.filter(item => item.status === 'rejected');
        const insurance24h = insurance.filter(item => item.method === '24h Insurance');
        const insuranceSL = insurance.filter(item => item.method === 'Sri Lanka Insurance');
        setApprovedData(approved);
        setRejectedData(rejected);
        setInsurance24hData(insurance24h);
        setInsuranceSLData(insuranceSL);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching insurance data:", error);
    }
  };

  useEffect(() => {
    getInsuranceData();
  }, []);

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
        <h1 className="institle">Insurance Claims Status</h1>
        <hr/>
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
