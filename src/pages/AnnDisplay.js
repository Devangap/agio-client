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
import moment from 'moment';



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
    const [videoList, setVideoList] = useState([]);
    const [visible, setVisible] = useState(false);

    const [expandedRows, setExpandedRows] = useState({});
    const [isDesModalVisible, setIsDesModalVisible] = useState(false);
    const [IsbuttonModalVisible,  setIsbuttonModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    function disableNotToday(current) {
      
      return current && current.format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD');
  }
  function disablePastDates(current) {
    
    return current && current < moment().startOf('day');
}


    const showModal2 = (content) => {
    setModalContent(content);
    setIsDesModalVisible(true);
  };
  const handleCancel2 = () => {
    setIsDesModalVisible(false);
  };


const toggleDescription = (key) => {
  const newExpandedRows = { ...expandedRows, [key]: !expandedRows[key] };
  setExpandedRows(newExpandedRows);
};





    const onFinish = async (values) => {
       
        if (!values.expiredate) {
            message.error('Please select an expiration date');
            return;
        }
    
        
        const formData = new FormData();
        
        fileList.forEach(file => {
            formData.append('file', file);
        });
        
        Object.keys(values).forEach(key => {
            formData.append(key, values[key]);
        });
        
        formData.append('userid', user?.userid);
    
        try {
            
            const response = await axios.post('/api/employee/AnnHRsup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
           
            if (response.data.success) {
                toast.success(response.data.message);
                handleCancel();
                window.location.reload();
               
                navigate('/AnnDisplay');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const onFinish2 = async (values) => {
       
      if (!values.expiredate) {
          message.error('Please select an expiration date');
          return;
      }
  
      
      const formData2 = new FormData();
      
      videoList.forEach(video => {
          formData2.append('video', video);
          console.log(video)
      });

      
      
      Object.keys(values).forEach(key => {
          formData2.append(key, values[key]);
      });
      
      formData2.append('userid', user?.userid);
  
      try {
          
          const response = await axios.post('/api/employee/AnnHRsup2', formData2, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
  
         
          if (response.data.success) {
              toast.success(response.data.message);
              handleCancel();
              window.location.reload();
             
              navigate('/AnnDisplay');
          } else {
              toast.error(response.data.message);
          }
      } catch (error) {
          toast.error("Something went wrong");
      }
  };

    const showModal1 = () => {
      setIsbuttonModalVisible(false);
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
                fetchAnnouncements(); 
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
    
            
            response.data.forEach(item => {
                item.comment.forEach(comment => {
                    mappedData.push({
                        key: `${item._id}_${comment._id}`,
                        anntitle: item.anntitle,
                        commentText: comment.text,
                        empId: comment.empId,
                        createdAt: comment.createdAt, 
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
          
            const dataWithKey = response.data.announcements.map(item => ({ ...item, key: item._id })); 
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
        return false; 
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
            width: 150,
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
          dataIndex: 'file', // Adjust based on your data structure
          key: 'file',
          render: (file, record) => {
            // Extract filename from video path
            const filename = file ? file.filename : (record.video ? record.video.substring(record.video.lastIndexOf('/') + 1) : null);
            const backendUrl = 'http://localhost:5001/';
            const filePath = filename ? `${backendUrl}uploads/${filename}` : '';
        
            if (record.video) {
              // If video field is available, render video
              return (
                <div>
                  <video controls style={{ width: '100px', height: '100px' }}>
                    <source src={filePath} type="video/mp4" /> {/* Adjust type as per your video format */}
                  </video>
                  {filename && <p>{filename}</p>} {/* Display video name if available */}
                </div>
              );
            } else if (file) {
              // If file field is available, render image
              return (
                <div>
                  <img src={filePath} alt={filename} style={{ width: '100px', height: '100px' }} />
                  {filename && <p>{filename}</p>} {/* Display image name if available */}
                </div>
              );
            } else {
              return null; // If neither file nor video field is available, render nothing
            }
          },
        },
        
        
          {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            render: (text, record) => {
              const isExpanded = expandedRows[record.key];
              return (
                <>
                  {text.length > 6 ? (
                    <>
                      {text.substring(0, 6)}... 
                      <a onClick={() => showModal2(text)}>More</a>
                    </>
                  ) : (
                    text
                  )}
                </>
              );
            }
            
            
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
        
            
            const response = await axios.put(`/api/annWorkouts/updateAnnHRsup/${currentAnnouncement._id}`, values);
            if (response.data.success) {
                message.success('Announcement updated successfully');
                setIsModalVisible(false);
                
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
  const showModal3 = () => {
    setIsbuttonModalVisible(true);
};
const handleCancel3 = () => {
  setIsbuttonModalVisible(false); // Close the modal
};
const handleVideoBeforeUpload = file => {
  const isMP4 = file.type === 'video/mp4' || (file.type === '' && file.name.endsWith('.mp4'));
  if (!isMP4) {
    toast.error('You can only upload MP4 files!');
  }
  if (isMP4) {
    setVideoList([...videoList, file]);
  }
  return false; // Prevent automatic upload
};
const handleCancel4 = () => {
  setVisible(false);
};

const showModal4 = () => {
  setIsbuttonModalVisible(false);
  setVisible(true);
};

    
    

    return (
        <Layout>
           <Modal
                    title="Upload Announcement with Videos"
                    open={visible}
                    onCancel={handleCancel4}
                    footer={null} // Use null here to remove default buttons
                >
                    <Form layout='vertical' onFinish={onFinish2}>
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
    <DatePicker 
        className="date" 
        disabledDate={disableNotToday}  // Use the function here
    />
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
            
            <div className="form-row">
              <div className="item">
              <Form.Item label="Expire Date" name="expiredate">
    <DatePicker 
        className="date" 
        disabledDate={disablePastDates}  
    />
</Form.Item>

              </div>
              <div className="itemUpload">
              <Form.Item label='Upload Videos' name='video'>
          <Upload 
            beforeUpload={handleVideoBeforeUpload} 
            onRemove={(file) => handleRemove(file, false)} 
            fileList={videoList} 
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select Video</Button>
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
            
            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
            </div>
          </Form>
                </Modal>
       <Modal
    title="Add New Announcement"
    visible={IsbuttonModalVisible}
    onCancel={handleCancel3}
    footer={null} // Use null here to remove default buttons
    centered // This will center the modal vertically
>
    <div className='annaddannoun' style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' ,marginRight: "5000px" ,justifyContent:'center',height:'100%'} }>
        <Button type="primary" onClick={() => showModal1('image')} className='annaddimage' >
            Upload Image
        </Button>
        <Button type="primary" onClick={() => showModal4('video')} className='annaddvideo'>
            Upload Video
        </Button>
        
    </div>
    <Button onClick={handleCancel}>Close</Button>
</Modal>
         
         <h3 >Announcements</h3> 
            <div className="annscrollable-container">
            
            <Form.Item>
            <Form.Item>
            <Button
    type="primary"
    onClick={showModal3}
    className="leavesub"
    name='annadd'
    // style={{ // Green background
    //     color: 'black', // White text
    //     padding: '10px 20px', // Padding around the text
    //     border: 'none', // No border
    //     borderRadius: '5px', // Rounded corners
    //     fontSize: '16px', // Text size
    //     cursor: 'pointer', // Pointer cursor on hover
    //     outline: 'none',
    //     marginRight: '8px' ,
    //     backgroundColor:'#ebe8e4' // Remove focus outline
    // }}
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
                style={{ marginBottom: 10, width: 100, marginLeft:180 }}
            />
            
        
    </div>

            <Table dataSource={filteredAnnouncements} columns={columns}   />

            <Modal
        title="Full Description"
        visible={isDesModalVisible}
        onCancel={handleCancel2}
        footer={[
          <Button key="back" onClick={handleCancel2}>
            Close
          </Button>
        ]}
      >
        <p>{modalContent}</p>
      </Modal>
            

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
                    title="Upload Announcement with Images"
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
    <DatePicker 
        className="date" 
        disabledDate={disableNotToday}  // Use the function here
    />
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
            
            <div className="form-row">
              <div className="item">
              <Form.Item label="Expire Date" name="expiredate">
    <DatePicker 
        className="date" 
        disabledDate={disablePastDates}  
    />
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
            
            <div className="Button-cons">
              <Button className='primary-button my-2' htmlType='submit'>Submit</Button>
            </div>
          </Form>
                </Modal>

</div>
<h3>Employee Comments</h3>
<div annscrollable-container>
<Table dataSource={comments} columns={commentColumns} />


</div>


        </Layout>
        
    );
}

export default AnnDisplay;