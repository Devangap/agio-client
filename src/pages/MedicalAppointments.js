import React, {useState} from "react";
import Layout from "../components/Layout";
import { Form, Input, Row, Col, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/empalerts";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MedDatePicker from "../components/MedDatePicker"

function MedicalAppointments() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const onFinish = async(values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/medEmployee/medical-appointments",
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr />
      <MedDatePicker/>
      
      
      {/*<Form layout="vertical" onFinish={onFinish}>
        <h1 className="card-title mt-3">New Appointment</h1>
        <Row>
          <Col span={8} xs={24} sm={24} lg={8}>
            <Form.Item
              required
              label="Date"
              name="appointmentDate"
              rules={[{ required: true }]}
            >
              <Input placeholder="Date" type="date" />
            </Form.Item>

            <Form.Item
              required
              label="Time"
              name="appointmentTime"
              rules={[{ required: true }]}
            >
              <Input placeholder="Time" type="time" />
            </Form.Item>

            <Form.Item
              required
              label="Number"
              name="appointmentNo"
              rules={[{ required: true }]}
            >
              <Input placeholder="Number" type="number" />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-start">
          <Button className="primary-button" htmlType="submit">
            SCHEDULE
          </Button>
        </div>
  </Form>*/}
    </Layout>
  );
}

export default MedicalAppointments;
