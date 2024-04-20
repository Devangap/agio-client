import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Modal, Form, Input } from "antd"; 
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/empalerts";
import { useDispatch } from "react-redux";
import "../Insurance.css";
import { Link } from "react-router-dom";

function InsEmployee() {
  const [insuranceData, setInsuranceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); 
  const [selectedInsurance, setSelectedInsurance] = useState(null); 
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  const getInsuranceData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `/api/insurance/getInsuranceEmployee/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + token, 
          },
        }
      );
      console.log("aaaaaaaaaaa");
      console.log(response)
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData(response.data.insuranceData);
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
        responseType: "blob",
      });
      const fileURL = URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  const handleUpdate = (record) => {
    setSelectedInsurance(record); 
    setVisible(true); 
  };

  const handleDelete = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `/api/insurance/deleteInsurance/${id}`
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setInsuranceData(insuranceData.filter((item) => item._id !== id));
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
  };

  const handleSave = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `/api/insurance/updateInsurance/${selectedInsurance._id}`,
        selectedInsurance
      );
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        setVisible(false);
        setInsuranceData(
          insuranceData.map((item) =>
            item._id === selectedInsurance._id ? response.data.insurance : item
          )
        );
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error updating insurance data:", error);
      message.error("Failed to update insurance data.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Empid",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Medical Document",
      dataIndex: "file",
      key: "file",
      render: (text, record) => (
        <Button onClick={() => viewFile(record.file)}>View File</Button>
      ),
    },
    {
      title: "Statuts",
      dataIndex: "status",
      render: (text, record) => {
        let statusDisplay;
        switch (record.status) {
          case "approved":
            statusDisplay = "Approved";
            break;
          case "rejected":
            statusDisplay = "Rejected";
            break;
          default:
            statusDisplay = "Pending";
        }
        return <span>{statusDisplay}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="insanchor">
          <Button onClick={() => handleUpdate(record)}>Update</Button>
          <Button onClick={() => handleDelete(record._id)}>Cancel</Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h2 className="ins-title">Claim List</h2>
      <hr />
      <Table columns={columns} dataSource={insuranceData} />
      <Modal
        title="Update Insurance"
        visible={visible}
        onOk={handleSave}
        onCancel={handleCancel}
        className="inscustom-modal"
      >
        <Form layout="vertical">
          <Form.Item label={<label htmlFor="name">Full Name:</label>}>
            <Input
              value={selectedInsurance?.name}
              onChange={(e) =>
                setSelectedInsurance({
                  ...selectedInsurance,
                  name: e.target.value,
                })
              }
              id="name"
              placeholder="Full name"
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input
              value={selectedInsurance?.phoneNumber}
              onChange={(e) =>
                setSelectedInsurance({
                  ...selectedInsurance,
                  phoneNumber: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label={<label htmlFor="description">Description:</label>}>
            <Input
              value={selectedInsurance?.description}
              onChange={(e) =>
                setSelectedInsurance({
                  ...selectedInsurance,
                  description: e.target.value,
                })
              }
              id="description"
              placeholder="Description"
            />
          </Form.Item>
        </Form>
      </Modal>

      <div className="institle">
        <Button type="primary">
          <Link to="/insClaimSubmit">File a new Insurance Claim Request</Link>
        </Button>
      </div>
    </Layout>
  );
}

export default InsEmployee;
