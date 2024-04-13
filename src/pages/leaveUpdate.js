import React, { useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function LeaveUpdate() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`/api/employee/getleave3/${id}`);
        if (response.data.success) {
          const data = response.data.leave;
          
          form.setFieldsValue({
            name: data.name,
            Type: data.Type,
            RangePicker: [moment(data.RangePicker[0]), moment(data.RangePicker[1])],
            Description: data.Description,
          });
          
        } else {
          toast.error('Leave not found!');
          navigate('/leaveEmp');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch leave data!');
      }
    };

    fetchLeave();
  }, [id, form, navigate]);
  const onFinish = async (values) => {
    try {
      // Extracting values from RangePicker
      const [uploaddate, expiredate] = values.RangePicker;
  
      const updatedValues = {
        ...values,
        uploaddate: uploaddate ? moment(uploaddate).format('YYYY-MM-DD') : undefined,
        expiredate: expiredate ? moment(expiredate).format('YYYY-MM-DD') : undefined,
      };
  
      const response = await axios.put(`/api/employee/updateleave/${id}`, updatedValues);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/leaveEmp');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update leave data!');
    }
  };
  return (
    <div className="leaveform">
      <div className="leave_formbox p-3">
        <h3 className="leave_title">Update Leave Form</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="leave_form-row">
            <div className="leave_item">
              <Form.Item label="Employee Name" name="name">
                <Input placeholder="Employee name" />
              </Form.Item>
            </div>
          </div>
          <div className="leave_form-row">
            <div className="leave_item">
              <Form.Item
                label="Leave Duration"
                name="RangePicker"
                rules={[{ required: false, message: 'Please input!' }]}
              >
                <RangePicker />
              </Form.Item>
            </div>
          </div>
          <div className="leave_form-row">
            <div className="leave_item">
              <Form.Item name="Type" label="Select leave type" className="leavet">
                <Select className="leave_Type" placeholder="Select leave type">
                  <Option value="General">General</Option>
                  <Option value="Specific">Annual</Option>
                  <Option value="Medical">Medical</Option>
                </Select>
              </Form.Item>
              
            </div>
          </div>
          <div className="leave_form-row">
            <div className="leave_item">
            </div>
          </div>
          <div className="leave_item">
            <Form.Item name="Description" label="Description">
              <Input.TextArea className="leave_Description" />
            </Form.Item>
          </div>
          <div className="leave_Button-cons">
            <Button className="leave_primary-button my-2" htmlType="submit">
              Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LeaveUpdate;
