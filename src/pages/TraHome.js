import React, { useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import annlayout from '../pages/AnnLayout'

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

    return <Layout>
        
        </Layout>;
}

export default TraHome;