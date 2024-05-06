import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../Home.css';
import LeaveImage from '../Images/leave.png';
 import AnnouncementImage from '../Images/promotion.png';
import UniformImage from '../Images/shirt copy.png';
import InsuranceImage from '../Images/life-insurance.png';
import InquiryImage from '../Images/conversation.png';
import MedicalImage from '../Images/stethoscope.png';
import PerformanceImage from '../Images/good-feedback.png';
import TransportImage from '../Images/shuttle.png';



function Card({ title, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/default-page'); // Replace '/default-page' with the desired page path
    }
  };

  // Define an object that maps card names to image paths
  const imagePaths = {
    'Leave': LeaveImage,
 'Announcement': AnnouncementImage,
     'Transport': TransportImage,
     'Uniform': UniformImage,
     'Insurance': InsuranceImage,
     'Inquiry': InquiryImage,
     'Medical': MedicalImage,
     'Performance': PerformanceImage
  };

  // Determine the image source based on the card title
  const imagePath = imagePaths[title] || imagePaths['Default'];

  return (
    <div className="carduser" onClick={handleClick} style={{ textAlign: 'center' }}>
      <img src={imagePath} alt={title} style={{ width: '70px', height: '70px', display: 'block', margin: '0 auto', marginBottom: '5px' }} />
      <div className="textuser">
      <h4 style={{ marginTop: '20px', fontSize: '20px', marginBottom: '5px', color: '#1f1300' }}>{title}</h4>
      </div>
    </div>
  );
}

function Home() {
  const announcements = [
    'Leave',
    'Announcement',
    'Transport',
    'Uniform',
    'Insurance',
    'Inquiry',
    'Medical',
    'Performance',
  ];

  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.post('/api/employee/get-employee-info-by-id', {}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      console.log(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCardClick = (announcement) => {
    switch (announcement) {
      case 'Leave':
        navigate('/leaveEmp');
        break;
      case 'Announcement':
        navigate('/AnnEmpDisplay');
        break;
        case 'Medical':
        navigate('/medical-appointments');
        break;
      case 'Transport':
        navigate('/TraBookingBox');
        break;
        case 'Inquiry':
        navigate('/inquiry');
        break;
      case 'Insurance':
        navigate('/insEmployee');
        break;
      case 'Performance':
        navigate('/rank');
        break; 
      // Add other cases for each announcement
      default:
        navigate('/default-page');
    }
  };

  return (
    <Layout>
      <div className="cards-container-user">
        {announcements.slice(0, 8).map((announcement, index) => (
          <Card
            key={index}
            title={announcement}
            onClick={() => handleCardClick(announcement)}
          />
        ))}
      </div>
    </Layout>
  );
}

export default Home;
