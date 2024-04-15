import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { Table } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';

function InsuranceManagerDisplay() {
  const [insuranceData, setInsuranceData] = useState([]);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const getInsuranceData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/insurance/getInsurance", {
        headers: {
          Authorization: 'Bearer ' + token // Pass token as a parameter
        },
      });
      console.log(response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData(response.data.insurance);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching insurance data:", error);
      // Handle error state here
    }
  };

  useEffect(() => {
    getInsuranceData();
  }, []);

  const viewFile = async (fileName) => {
    try {
      const response = await axios.get(`/api/insurance/view-file/${fileName}`, {
        responseType: 'blob',
      });
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
      // Handle error state here
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
    {
      title: "Medical Document",
      dataIndex: "file",
      key: 'file',
      render: (text, record) => (
        <button onClick={() => viewFile(record.file)}>View File</button>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="insanchor">
          <h1>Approve</h1>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Claim List</h1>
      <Table
        columns={columns}
        dataSource={insuranceData}
      />
    </Layout>
  );
}

export default InsuranceManagerDisplay;
