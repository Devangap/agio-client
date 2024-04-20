import React, { useEffect,useState  } from 'react';
import { Button, Form, Input, Select, DatePicker ,Upload } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

function LeaveUpdate() {
  const { RangePicker } = DatePicker;
  const { Option } = Select;
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [leaveType, setLeaveType] = useState('');

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`/api/employee/getleave3/${id}`);
        if (response.data.success) {
          const data = response.data.leave;
          // Set form fields with retrieved leave data
          form.setFieldsValue({
            name: data.name,
            Type: data.Type,
            startDate: moment(data.startDate),
            endDate: moment(data.endDate),
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
      // Extracting values from individual date pickers
      const startDate = values.startDate;
      const endDate = values.endDate;
  
      const updatedValues = {
          ...values,
          startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
          endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
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
  const handleBeforeUpload = (file) => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
        toast.error('You can only upload PDF files!');
        return false;
    }

    // Get additional information about the file
    const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
    };

    // Log or use the fileInfo object as needed
    console.log('File information:', fileInfo);

    setFileList([file]);
    return false;
};

const handleRemove = () => {
    setFileList([]);
};
  const validateUploadField = (_, value) => {
    if (value === "Medical") {
        if (fileList.length === 0) {
            return Promise.reject("Please upload a document for medical leave");
        }
    }
    return Promise.resolve();
};

const handleLeaveTypeChange = (value) => {
    setLeaveType(value);
};

  return (
    <div className="leaveform">
      <div className="leave_formbox p-3">
        <h3 className="leave_title">Update Leave Form</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item label='Employee Name' name='name'>
                                <Input placeholder='Employee name' />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="leave_form-row">
                    <div className="leave_item">
    <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: false, message: 'Please input!' }]}
    >
        <DatePicker />
    </Form.Item>
    <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: false, message: 'Please input!' }]}
    >
        <DatePicker />
    </Form.Item>
</div>
                    </div>
                    <div className="leave_form-row">
                        <div className="leave_item">
                            <Form.Item name="Type" label="Select leave type" className='leavet'>
                                <Select className="leave_Type" placeholder="Select leave type" onChange={handleLeaveTypeChange}>
                                    <Option value="General">General</Option>
                                    <Option value="Annual">Annual</Option>
                                    <Option value="Medical">Medical</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    {leaveType === 'Medical' && ( // Conditionally render Form.Item component
                        <Form.Item
                            label='Upload Medical Documents'
                            name='file'
                            rules={[
                                { required: true, message: 'Please upload a document' },
                                { validator: validateUploadField }
                            ]}
                            dependencies={['Type']}
                        >
                            <Upload
                                beforeUpload={handleBeforeUpload}
                                onRemove={handleRemove}
                                fileList={fileList}
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                        </Form.Item>
                    )}
                    <div className="leave_form-row">
                        <div className="leave_item">
                        </div>
                    </div>
                    <div className="leave_item">
                        <Form.Item name="Description" label="Description">
                            <Input.TextArea className='leave_Description' />
                        </Form.Item>
                    </div>
                    <div className="leave_Button-cons">
                        <Button className='leave_primary-button my-2' htmlType='submit'>Submit</Button>
                    </div>
                </Form>
            </div>
            </div>
       
      
  );
}

export default LeaveUpdate;

