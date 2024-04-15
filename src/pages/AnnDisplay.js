import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import Layout from '../components/Layout';
import Anndisplay from '../Anndisplay.css';
import { useNavigate } from 'react-router-dom';



function AnnDisplay() {
    const navigate = useNavigate();
    

    const [announcements, setAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null); 
    const [searchText, setSearchText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);




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
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button type="primary" className="update" onClick={() => navigate(`/AnnUpdate/${record._id}`)}>Update</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
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
         <div className="table-header">
        <div className="search-container">
            <Input
                placeholder="Search announcements"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 200 }}
            />
        </div>
    </div>

            <Table dataSource={filteredAnnouncements} columns={columns} />
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

        

        </Layout>
        
    );
}

export default AnnDisplay;
