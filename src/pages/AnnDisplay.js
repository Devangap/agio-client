import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout';
import Anndisplay from '../Anndisplay.css';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';





function AnnDisplay() {
    const navigate = useNavigate();
    

    const [announcements, setAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null); 
    const [searchText, setSearchText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [comments, setComments] = useState([]);


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
    <Button type="primary" className="update" onClick={() => navigate(`/AnnUpdate/${record._id}`)} style={{ width: '150px', height: '40px', marginBottom: '8px' }}>Update</Button>
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

    
    

    return (
        <Layout>
            <div className="annflex-container">
            <div className="annscrollable-container">

         <div className="table-header">
         
        <div className="Annsearch-container">
           <h2 >Announcements</h2> 
            <Input
            className='annsearch'
                placeholder="Search announcements"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 100, marginLeft:123 }}
            />
            
        </div>
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

</div>
<h2>Employee Comments</h2>
<Table dataSource={comments} columns={commentColumns} />


</div>


        </Layout>
        
    );
}

export default AnnDisplay;