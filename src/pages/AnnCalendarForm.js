import React, { useState } from 'react';
import { Form, Input, DatePicker, Radio, Button, Modal } from 'antd';
import moment from 'moment';
import "../leaveEmpform.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AnnCalendarForm({onFormSubmit}) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    form.submit(); // Submit form when OK is clicked on modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
        const response = await axios.post('/api/employee/AnnCalNotice', values);
        if (response.data.success) {
            toast.success(response.data.message);
            onFormSubmit(); // Closes the modal after successful submission
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error("Something went wrong");
    }
};

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Notice
      </Button>

      <Modal title="Add Notice" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            confirmation: 'yes',
            date: moment(), // Current date
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input your title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
          >
            <DatePicker
              format="MMMM D, YYYY"
              className="form-control"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}

export default AnnCalendarForm;
