import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { Table, Button, message, Modal, Form, Input } from 'antd'; 
import axios from "axios";
import { useDispatch } from "react-redux";

function InsuranceManagerDisplay() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [visible, setVisible] = useState(false); 
  const [selectedInsurance, setSelectedInsurance] = useState(null); 
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
        setInsuranceData(response.data.insurance);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching insurance data:", error);
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
    }
  };

  const handleUpdate = (record) => {
    setSelectedInsurance(record); 
    setVisible(true); 
  }

  const handleDelete = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(`/api/insurance/deleteInsurance/${id}`);
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData(insuranceData.filter(item => item._id !== id));
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error deleting insurance data:", error);
      message.error("Failed to delete claim request.");
    }
  };

  const handleCancel = () => {
    setVisible(false);
  }

  const handleSave = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.put(`/api/insurance/updateInsurance/${selectedInsurance._id}`, selectedInsurance);
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setVisible(false); 
        setInsuranceData(insuranceData.map(item => item._id === selectedInsurance._id ? response.data.insurance : item));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error updating insurance data:", error);
      message.error("Failed to update insurance data.");
    }
  };

  const changeClaimStatus = async (record) => {
    try {
      let newStatus;
      if (record.status === 'Pending') {
        newStatus = 'approved';
      } else if (record.status === 'approved') {
        newStatus = 'rejected';
      } else {
        newStatus = 'Pending'; 
      }
      
      const response = await axios.put(`/api/insurance/changeStatus/${record._id}`, { status: newStatus });
      
      if (response.data.success) {
        message.success(response.data.message);
        setInsuranceData(insuranceData.map(item => item._id === record._id ? {...item, status: newStatus} : item));
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      message.error("Failed to change status.");
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
        <Button onClick={() => viewFile(record.file)}>View File</Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div className="insstatus"> 
          {record.status === "Pending" && <h1 className="insanchor" onClick={() => changeClaimStatus(record)}>Approve</h1>}
          {record.status === "approved" && <h1 className="insanchor" onClick={() => changeClaimStatus(record)}>Reject</h1>}
          {record.status === "rejected" && <h1 className="insanchor" onClick={() => changeClaimStatus(record)}>Approve</h1>}
        </div>
      )
    },
    {
      title: "Action",
      key: 'action',
      render: (text, record) => (
        <div className="insactbutton">
          <Button onClick={() => handleUpdate(record)}>Update</Button>
          <Button onClick={() => handleDelete(record._id)}>Cancel</Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Claim List</h1>
      <hr/>
      <Table
        columns={columns}
        dataSource={insuranceData}
      />
      <Modal
        title="Update Insurance"
        visible={visible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Full Name">
            <Input value={selectedInsurance?.name} onChange={e => setSelectedInsurance({...selectedInsurance, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input value={selectedInsurance?.phoneNumber} onChange={e => setSelectedInsurance({...selectedInsurance, phoneNumber: e.target.value})} />
          </Form.Item>
          <Form.Item label="Description">
            <Input value={selectedInsurance?.description} onChange={e => setSelectedInsurance({...selectedInsurance, description: e.target.value})} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default InsuranceManagerDisplay;
