import React, { useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import '../Home.css'
function Card({ title }) {
    return (
      <div className="card">
        <h3>{title}</h3>
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

    const getData = async () => {
        try {
            const response = await axios.post('/api/employee/get-employee-info-by-id', {} , {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
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

    return <Layout>
    <div className="cards-container">
      {announcements.slice(0, 8).map((announcement, index) => (
        <Card key={index} title={announcement} />
      ))}
    </div>
  </Layout>
}

export default Home;