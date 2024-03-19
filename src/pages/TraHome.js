import React, { useEffect } from 'react';
import axios from 'axios';
import annlayout from '../pages/AnnLayout'
import TraLayout from '../components/TraLayout';

function TraHome() {

    const getData = async () => {
        try {
            const response = await axios.post('/api/user/get-user-info-by-id', {} , {
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

    return <TraLayout>
        <div className='Main_header'>
        <h1>WELCOME OUR ANGIO TRANSPORT </h1>
        </div>
    </TraLayout>;
}

export default TraHome;