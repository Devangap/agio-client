import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { Table, Button, message, Modal, Form, Input } from 'antd'; 
import axios from "axios";
import { useDispatch } from "react-redux";

function InsuranceManagerDisplay() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [insuranceData2, setInsuranceData2] = useState([]);
  const [visible, setVisible] = useState(false); 
  const [selectedInsurance, setSelectedInsurance] = useState(null); 
  const [updateModalVisible, setUpdateModalVisible] = useState(false); 
  const [searchTerm1, setSearchTerm1] = useState("");  
  const [searchTerm2, setSearchTerm2] = useState(""); 
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
    setUpdateModalVisible(true); 
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
    setUpdateModalVisible(false); 
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
  
  const handleInsuranceUpdate = async (insuranceType) => {
    try {
      dispatch(showLoading());
      const response = await axios.put(`/api/insurance/changeMethod/${selectedInsurance._id}`, { method: insuranceType });
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
      console.error("Error updating insurance method:", error);
      message.error("Failed to update insurance method.");
    }
  };

  const handleSearch1 = async () => { 
    try {
      if (!searchTerm1.trim()) {
        message.warning("Please enter an Employee ID to search.");
        return;
      }
      dispatch(showLoading());
      const response = await axios.get(
        `/api/insurance/getInsuranceEmployee/${searchTerm1}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData(response.data.insuranceData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error searching insurance data:", error);
      message.error("Failed to search insurance data.");
    }
  };

  const handleReset = () => {
    getInsuranceData();
    setSearchTerm1("");
  };

  const handleSearch2 = async () => { 
    try {
      if (!searchTerm2.trim()) {
        message.warning("Please enter an Employee ID to search.");
        return;
      }
      dispatch(showLoading());
      const response = await axios.get(
        `/api/insurance/getInsuranceEmployee/${searchTerm2}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData2(response.data.insuranceData); 
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error searching insurance data:", error);
      message.error("Failed to search insurance data.");
    }
  }
  
  const handleReset2 = () => {
    setSearchTerm2("");
  };

  const handleDownload = async (record) => {
    try {
      const response = await axios.get(`/api/insurance/generate-pdf/${record.id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `insurance_claim_${record.id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('Failed to download PDF');
    }
  };

  const handlereport = async () => {
    try {
      const response = await axios.post("/api/insurance/generate-allpdf", { insuranceData: insuranceData }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'insurance_reports.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading reports:', error);
      message.error('Failed to download reports');
    }
  };

  const columns = [
    {
      title: "Number",
      dataIndex: "insuranceID",
      key: "insuranceID",
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: 'name',
      render: (text, record) => (
        <span className="insanchor" onClick={() => { setVisible(true); setSelectedInsurance(record); }}>{text}</span>
      ),
    },
    {
      title: "EmployeeID",
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
          <Button className="insupdate" onClick={() => handleUpdate(record)}>Update</Button>
          <Button className="inscancel"onClick={() => handleDelete(record._id)}>Cancel</Button>
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Number",
      dataIndex: "insuranceID",
      key: "insuranceID",
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: 'name',
    },
    {
      title: "EmployeeID",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div className="insstatus"> 
          {record.status === "Pending" && <h1 className="insanchor" >Approve</h1>}
          {record.status === "approved" && <h1 className="insanchor" >Reject</h1>}
          {record.status === "rejected" && <h1 className="insanchor" >Approve</h1>}
        </div>
      )
    },
    
    {
      title: "Action",
      key: 'action',
      render: (text, record) => (
        <div className="insactbutton">
          <Button className="insreportdownload" onClick={() => handleDownload(record)}>Download</Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="institle">
        <h1>Insurance Requset Claim List</h1>
      </div>
      <hr/>
      <div className="insSearch">
        <Input
          placeholder="Enter Employee ID"
          value={searchTerm1}
          onChange={(e) => setSearchTerm1(e.target.value)}
          style={{ marginRight: 8, width: 200 }}
        />
        <Button type="primary" onClick={handleSearch1} style={{ marginRight: 8 }}>
          Search
        </Button>
        <Button onClick={handleReset} style={{ marginRight: 8 }}>
          Reset
        </Button>
        <Button onClick={handlereport} className="insreport">
          Download Reports
        </Button>
      </div>
      <div>
        <Table 
          columns={columns}
          dataSource={insuranceData}
          pagination={false}
          scroll={{ x: 'max-content' }} 
        />
      </div>
      
      <Modal
        title="Choose the Insurance Method"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
        ]}
      >
        {selectedInsurance && (
          <div>
            <p>Name: {selectedInsurance.name}</p>
            <p>Empid: {selectedInsurance.id}</p>
            <p>Number: {selectedInsurance.phoneNumber}</p>
            <p>Description: {selectedInsurance.description}</p>
            <div>
              <Button onClick={() => handleInsuranceUpdate('24h Insurance')}>24h Insurance</Button>
              <Button onClick={() => handleInsuranceUpdate('Sri Lanka Insurance')}>Sri Lanka Insurance</Button>
            </div>
          </div>
        )}
      </Modal>
      
      <Modal
        title="Update Insurance"
        visible={updateModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        {selectedInsurance && (
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
        )}
      </Modal>
      <div className="institle">
        <h1>Download Employee's Insurance Claim Report</h1>
      </div>
      <hr/>
      <div className="insSearch">
        <Input
          placeholder="Enter Employee ID"
          value={searchTerm2}
          onChange={(e) => setSearchTerm2(e.target.value)}
          style={{ marginRight: 8, width: 200 }}
        />
        <Button type="primary" onClick={handleSearch2} style={{ marginRight: 8 }}>
          Search
        </Button>
        <Button onClick={handleReset2}>Reset</Button>
      </div>
      <div style={{ height: "500px", overflow: "auto" }}>
        <Table 
          columns={columns2}
          dataSource={insuranceData2}
          pagination={false} 
        />
      </div>
    </Layout>
  );
}

export default InsuranceManagerDisplay;
