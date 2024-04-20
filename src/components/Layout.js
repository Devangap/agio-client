import React from 'react';
import '../Annlayout.css';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import  { useEffect } from 'react';
import { Badge ,Avatar} from 'antd';
import axios from 'axios';

function Layout({ children }) {

    const {user} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    const navigate = useNavigate()
    const location = useLocation();//no collapsed there is the phto in ur phonr
                                   //user is defined in the phto so 1:59:39 

                                   const handleLogout = () => {
                                    localStorage.clear();
                                    dispatch(setUser(null)); // Clear user state in Redux store
                                    navigate('/Main_login');
                                };
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
    
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Announcements',
            path: '/AnnEmpDisplay',
            icon: 'ri-survey-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
        {
            name: 'Uniform',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        {

            name: 'Inquiry',
            path: '/inquiry',
          icon: 'ri-account-box-line',
        },
      {
            name: 'Transport',
            path: '/TraBookingBox',

            icon: 'ri-account-box-line',
        },
       
    ];
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Employee Registration ',
            path: '/Main_register',
            icon: 'ri-account-box-line',
        },
        
    ];

    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' Doctor Profile',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        
    ];
    const Annhrsupmenu = [
        {
            name: 'Home',
            path: '/AnnHRsup',
            icon: 'ri-home-line',
        },
        {
            name: ' Announcements',
            path: '/AnnDisplay',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
        {
            name: ' Calendar',
            path: '/AnnCalendar',
            icon: 'ri-account-box-line',
        },
        {
            name: ' Profile',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        
    ];
    const leavemenu = [
        {
            name: ' Overview',
            path: '/leaveoverview',
            icon: 'ri-account-box-line',
        },
        
        {
            name: ' Leave requests',
            path: '/leaveHrsupdisplay',
            icon: 'ri-account-box-line',
        },
       
        {
            name: ' Calendar',
            path: '/LeaveCal',
            icon: 'ri-account-box-line',
        },
       
       
    ];
    const logisticmenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' Transport',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
        {
            name: ' BookingUserdetails',
            path: '/TraBookingDisplayAdmin',
            icon: 'ri-account-box-line',
        },
        {
            name: ' DriverRegister And Details',
            path: '/TraDriverBox',
            icon: 'ri-account-box-line',
        },
        {
            name: ' VehicleRegister And Details',
            path: '/VehicleBox',
            icon: 'ri-account-box-line',
        },
       
    ];
    const uniformmenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' uniform ',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
       
    ];
    const inquirymenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' Inquiry ',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
       
    ];
    const insuarancemenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' Insuarance ',
            path: '/insClaimSubmit',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
       
    ];
    const performancemenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Performance',
            path: '/perf',
            icon: 'ri-home-line',
        },
        {
            name: 'Leave',
            path: '/leaveEmp',
            icon: 'ri-calendar-line',
        },
      
    ];
    
    
    

    let menuToBeRendered = userMenu;

    if (user?.isAdmin) {
        menuToBeRendered = adminMenu;
    } else if (user?.isDoctor) {
        menuToBeRendered = doctorMenu;
    }
else if (user?.isAnnHrsup) {
    menuToBeRendered = Annhrsupmenu ;
}else if (user?.isLeaveHrsup) {
    menuToBeRendered = leavemenu ;
}else if (user?.islogisticsMan) {
    menuToBeRendered = logisticmenu ;
}else if (user?.isuniform) {
    menuToBeRendered = uniformmenu ;
}else if (user?.isinsu) {
    menuToBeRendered = insuarancemenu ;
}else if (user?.isinquiry) {
    menuToBeRendered = inquirymenu  ;
}else if (user?.isperfomace) {
    menuToBeRendered = performancemenu ;
}


useEffect(() => {
    // Check for authentication status on component mount
    if (!localStorage.getItem('token')) {
        navigate('/Main_login');
    }
}, [navigate]);


    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className='sidebar-header'>
                        <img src='logos.png' className='logo'></img>
                        
                    </div>
                    <div className='menu'>
                    {menuToBeRendered.map((menu, index) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div key={index} className={`d-flex menu-item ${isActive ? 'active-menu-item' : ''}`}>
                                    <i className={menu.icon}></i>
                                    <Link to={menu.path}>{menu.name}</Link>
                                   

                                </div>
                                 
                            );
                            
                            
                        })}
                         
                        <div className={`d-flex menu-item `} onClick={handleLogout}>
                            <i className='ri-logout-circle-line'></i>
                            <Link to='Main_login'>Logout</Link>
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <div>
                           </div>
                        <div className='layout-action-icon-container'>
                        <Badge count={user?.unseenNotifications.length} onClick = {() => navigate("/Main_Notifications")}>
                        <i className="ri-notification-line layout-action-icon mr 3px "></i>
                         </Badge>
                            
                          
                            <Link className="anchor mx-3" to ='/'>{user?.username}</Link>
                            
                            
                        </div>
                    </div>
                    <div className='body'>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
