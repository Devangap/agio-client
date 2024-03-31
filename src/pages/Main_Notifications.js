import React from 'react'
import Layout from '../components/Layout'
import '../Main_Notifications.css';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showLoading,hideLoading } from '../redux/empalerts';
import toast from 'react-hot-toast';

function Main_Notifications() {
    const{user} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const markAllAsSeen = async()=>{
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/employee/mark_all_seen', {userid : user?.userid});
            dispatch(hideLoading());
            if(response.data.success){
                toast.success(response.data.message);
               
                
            }else{
                toast.error(response.data.message);
      
            }
            
        } catch (error) {
          dispatch(hideLoading());
            toast.error("Something went wrong");
        }
           


    };
  return (
    <Layout>
    <h2 className = "n_title">Notifications</h2>
    <Tabs>
        <Tabs.TabPane tab = 'Unread' key = {0} >
            <div className = 'n-felx justify-content-end' >
            <h4>Unread</h4>
                <h7 className = "anchor"onClick ={() => markAllAsSeen}>Mark all as read</h7>
            </div>
            {user?.unseenNotifications .map((notification) =>(
                <div className = "card p-7" onClick = {() => navigate("/leavehrsupreq")}>
                    <div className = "card-text">{notification.message}</div>

                </div>

            ) )}
           

        </Tabs.TabPane>
        <Tabs.TabPane tab = 'Read' key = {1} >
        <div className = 'n_felx justify-content-end' >
                <h7 className = "anchor">Clear All</h7>
            </div>
            <h4>Read</h4>

        </Tabs.TabPane>


    </Tabs>
    </Layout>
  )
}

export default Main_Notifications
