import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Modal } from 'antd';
import { Form, Input, Select, DatePicker, Button, Upload } from 'antd';
import Layout from '../components/Layout';
import Anndisplay from '../Anndisplay.css';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';


const { Option } = Select;

function AnnDisplay() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    

    const [announcements, setAnnouncements] = useState([]);
    const [announcementType, setAnnouncementType] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null); 
    const [searchText, setSearchText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [comments, setComments] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false); 
    const [fileList, setFileList] = useState([]);
    const onFinish = async (values) => {
        // Ensure expiredate is properly defined
        if (!values.expiredate) {
            message.error('Please select an expiration date');
            return;
        }
    
        // Create a new FormData instance
        const formData = new FormData();
        // Append each file to FormData
        fileList.forEach(file => {
            formData.append('file', file);
        });
        // Append other form values to FormData
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
        // Append user ID to FormData
        formData.append('userid', user?.userid);
    
        try {
            // Make POST request to upload the form data
            const response = await axios.post('/api/employee/AnnHRsup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            // Handle response
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/AnnDisplay');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const showModal1 = () => {
        setIsAddModalVisible(true);
    };

    const handleCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleAddAnnouncement = async (values) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });
            if (selectedFile) {
                formData.append("file", selectedFile);
            }
            const response = await axios.post('/api/employee/createAnnHRsup', formData);
            if (response.data.success) {
                message.success('Announcement added successfully');
                setIsAddModalVisible(false);
                fetchAnnouncements(); // Refresh the announcements list
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to add announcement');
        }
    };


    const fetchComments = async () => {
        try {
            const response = await axios.get('/api/employee/comments');
            const mappedData = [];
    
            // Assuming each item in response.data can have multiple comments
            response.data.forEach(item => {
                item.comment.forEach(comment => {
                    mappedData.push({
                        key: `${item._id}_${comment._id}`, // Unique key for each comment
                        anntitle: item.anntitle,
                        commentText: comment.text,
                        empId: comment.empId,
                        createdAt: comment.createdAt, // Optional, if you want to display or use created date
                    });
                });
            });
            setComments(mappedData);
        } catch (error) {
            message.error("Failed to fetch comments");
        }
    };
    
    

      useEffect(() => {
        fetchAnnouncements();
        fetchComments();
      }, []);
      
      


   




    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/employee/getAnnHRsup');
            // Assuming response.data.announcements is an array of announcements
            // Add a unique key (e.g., id) to each announcement for the Table component
            const dataWithKey = response.data.announcements.map(item => ({ ...item, key: item._id })); // Adjust according to your data structure
            setAnnouncements(dataWithKey);
        } catch (error) {
            message.error("Failed to fetch announcements");
        }
    };
    const handleBeforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          toast.error('You can only upload JPG/PNG file!');
        }
        if (isJpgOrPng) {
          setFileList([...fileList, file]);
        }
        return false; // Prevent automatic upload
      };
    

    const handleDownload = async (announcement) => {
        const zip = new JSZip();
        if (announcement.file && announcement.file.filename) {
            try {
                const fileResponse = await axios.get(`${'http://localhost:5001/'}uploads/${announcement.file.filename}`, {
                    responseType: 'blob',
                });
                zip.file(announcement.file.filename, fileResponse.data);
            } catch (error) {
                message.error('Failed to download file');
                return;
            }
        }
        const handleRemove = file => {
            setFileList(prevFileList => prevFileList.filter(f => f !== file));
          };

        // Generate PDF with jsPDF
        const doc = new jsPDF();
        doc.text(`Title: ${announcement.anntitle}`, 10, 10);
        doc.text(`Upload Date: ${new Date(announcement.uploaddate).toLocaleDateString()}`, 10, 20);
        doc.text(`Type: ${announcement.Type}`, 10, 30);
        doc.text(`Department: ${announcement.Department}`, 10, 40);
        doc.text(`Expire Date: ${new Date(announcement.expiredate).toLocaleDateString()}`, 10, 50);
        doc.text(`Description: ${announcement.Description}`, 10, 60);

        // Convert PDF to a binary string and include it in the ZIP
        const pdfBlob = doc.output('blob');
        zip.file("announcement_details.pdf", pdfBlob);

        // Generate zip file and download
        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, `announcement_${announcement._id}.zip`);
        });
    };



    useEffect(() => {
        
        fetchAnnouncements();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/employee/deleteAnnHRsup/${id}`);
            setAnnouncements(prev => prev.filter(item => item._id !== id));
            message.success('Announcement deleted successfully');
        } catch (error) {
            message.error('Failed to delete announcement');
        }
    };
    const handleTypeChange = value => {
        setAnnouncementType(value);
      };
    

    const columns = [
        {
            title: 'Announcement Title',
            dataIndex: 'anntitle',
            key: 'anntitle',
        },
        {
            title: 'Upload Date',
            dataIndex: 'uploaddate',
            key: 'uploaddate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Department',
            dataIndex: 'Department',
            key: 'Department',
        },

        {
            title: 'Expire Date',
            dataIndex: 'expiredate',
            key: 'expiredate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'File',
            dataIndex: 'filePath', // Adjust based on your data structure
            key: 'file',
            render: (text, record) => {
              // Make sure `record` and `record.file` are valid objects before trying to access `filename`
              const filename = record?.file?.filename;
              
              // Update this URL to match your backend server's URL and port
              // For example, if your backend is running on http://localhost:3000
              const backendUrl = 'http://localhost:5001/';
          
              // Construct the file path with the full URL
              const filePath = filename ? `${backendUrl}uploads/${filename}` : '';
              console.log(filePath)
              return filename ? (
                <div>
                <img src={filePath} alt={filename} style={{ width: '100px', height: '100px' }} />
                <p>{filename}</p>
            </div>
              ) : null;
            },
          },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
    <Button type="primary" className="Annupdate" onClick={() => navigate(`/AnnUpdate/${record._id}`)} style={{ width: '150px', height: '40px', marginBottom: '8px' }}>Update</Button>
    <Button danger onClick={() => handleDelete(record._id)} style={{ width: '150px', height: '40px', marginBottom: '8px' }}>Delete</Button>
    <Button type="default" onClick={() => handleDownload(record)} style={{ width: '150px', height: '40px' }}>Download</Button>
</div>

            
            ),
        },
        
    ];
    const commentColumns = [
        { title: 'Announcement ID', dataIndex: 'key', key: 'announcementId' },
        { title: 'Announcement Title', dataIndex: 'anntitle', key: 'anntitle' },
        { title: 'Comment Text', dataIndex: 'commentText', key: 'commentText' },
        { title: 'Employee ID', dataIndex: 'empId', key: 'empId' },
    ];
    

    const showModal = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsModalVisible(true);
    };
    const handleUpdate = async (values) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
              formData.append(key, values[key]);
            });
            if (selectedFile) {
              formData.append("file", selectedFile);
            }
        
            // Assuming you have the announcement ID in currentAnnouncement._id
            const response = await axios.put(`/api/annWorkouts/updateAnnHRsup/${currentAnnouncement._id}`, values);
            if (response.data.success) {
                message.success('Announcement updated successfully');
                setIsModalVisible(false);
                // Refresh the announcements list to reflect the update
                fetchAnnouncements();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error('Failed to update announcement');
        }
    };
    const filteredAnnouncements = announcements.filter((announcement) =>
  announcement.anntitle.toLowerCase().includes(searchText.toLowerCase())
  
   || announcement.anntitle.toLowerCase().includes(searchText.toLowerCase())
);
const handleRemove = file => {
    setFileList(prevFileList => prevFileList.filter(f => f !== file));
  };

    
    

    return (
        <Layout>
         
         <h2 >Announcements</h2> 
            <div className="annscrollable-container">
            
            <Form.Item>
            <Form.Item>
    <Button
        type="primary"
        onClick={showModal1}
        className="annadd"
    >
        Add Announcement
    </Button>
</Form.Item>
        </Form.Item>

         <div className="table-header">
         
       <div>
       

       </div>
           
            <Input
            className='annsearch'
                placeholder="Search announcements"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 10, width: 100, marginLeft:123 }}
            />
            
        
    </div>

            <Table dataSource={filteredAnnouncements} columns={columns}   />
            

            <Modal
    title="Update Announcement"
    open={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null} // Use null here to not use the default Ok and Cancel buttons
>
    <Form
        layout="vertical"
        initialValues={{ ...currentAnnouncement }}
        onFinish={handleUpdate}
    >
        <Form.Item
            name="anntitle"
            label="Announcement Title"
            rules={[{  message: 'Please input the announcement title!' }]}
        >
            <Input />
        </Form.Item>
        {/* Repeat for other fields as necessary */}
        <Form.Item>
            <Button type="primary" htmlType="submit">
                Update
            </Button>
        </Form.Item>
    </Form>
</Modal>
<Modal
                    title="Add New Announcement"
                    open={isAddModalVisible}
                    onCancel={handleCancel}
                    footer={null} // Use null here to remove default buttons
                >
                    <Form layout='vertical' onFinish={onFinish}>
            {/* Announcement Title */}
            <div className="form-row">
              <div className="item">
                <Form.Item label='Announcement Title' name='anntitle' rules={[{ required: true, message: 'Please input announcement title!' }]}>
                  <Input placeholder='Announcement Title' />
                </Form.Item>
              </div>
            </div>
            {/* Upload Date and Type */}
            <div className="form-row">
              <div className="item">
                <Form.Item label="Upload Date" name="uploaddate">
                  <DatePicker className="date" />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item name="Type" label="Type">
                  <Select className="Type" placeholder="Select announcement type" onChange={handleTypeChange}>
                    <Option value="General">General</Option>
                    <Option value="Specific">Specific</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            {/* Department (Specific announcement type) */}
            {announcementType === 'Specific' && (
              <div className="form-row">
                <div className="item">
                  <Form.Item label="Department" name="Department">
                    <Select placeholder="Select department">
                    <Option value="HR">HR</Option>
             
             <Option value="Logistics">Logistics</Option>
             <Option value="Procurement Department">Procurement Department</Option>
             <Option value="Quality Assurance">Quality Assurance</Option>
             <Option value="Production Department">Production Department</Option>
             <Option value="Sales and Marketing">Sales and Marketing</Option>
             <Option value="Finance and Accounting ">Finance and Accounting </Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}
            {/* Expire Date and Upload Media */}
            <div className="form-row">
              <div className="item">
                <Form.Item label="Expire Date" name="expiredate">
                  <DatePicker className="date" />
                </Form.Item>
              </div>
              <div className="itemUpload">
                <Form.Item label='Upload Media' name='file'>
                  <Upload 
                    beforeUpload={handleBeforeUpload} 
                    onRemove={handleRemove} 
                    fileList={fileList} 
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            {/* Description */}
            <div className="item">
              <Form.Item name="Description" label="Description">
                <Input.TextArea className='Description' />
              </Form.Item>
            </div>
            {/* Submit Button */}
            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
            </div>
          </Form>
                </Modal>

</div>
<h2>Employee Comments</h2>
<div annscrollable-container>
<Table dataSource={comments} columns={commentColumns} />


</div>


        </Layout>
        
    );
}

export default AnnDisplay;