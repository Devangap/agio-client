import React, { useEffect } from 'react';
import axios from 'axios';




function Main_home() {

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

    return (
        <div>Main Home Page</div>
    )
}

export default Main_home;