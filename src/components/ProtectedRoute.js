import React, { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { setUser } from '../redux/userSlice';
import { hideLoading, showLoading } from '../redux/empalerts';

function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/get-employee-info-by-id', { token: localStorage.getItem('token') }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            dispatch(hideLoading());
            if (!response.data.success) {
                dispatch(setUser(response.data.data));
                
            }else{
                navigate('/Main_login');

            }
        } catch (error) {
            dispatch(hideLoading());
            navigate('/Main_login');
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user]);

    if (localStorage.getItem('token')) {
        return children;
    } else {
        return <Navigate to="/Main_login" />;
    }
}

export default ProtectedRoute;
