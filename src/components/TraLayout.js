import React, { useState } from 'react';
import '../Annlayout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TraLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const {user} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();//no collapsed there is the phto in ur phonr
      //user is defined in the phto so 1:59:39 
    
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: 'Booking Service',
            path: '/announcements',
            icon: 'ri-survey-line',
        },
        {
            name: 'Calendar',
            path: '/calendar',
            icon: 'ri-calendar-line',
        },
        {
            name: 'Profile',
            path: '/profile',
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
            name: 'Drivers Details',
            path: '/driver',
            icon: 'ri-home-line',
        },
        {
            name: 'Users Details',
            path: '/user',
            icon: 'ri-home-line',
        },
        {
            name: 'Vehicle Details',
            path: '/vehicle',
            icon: 'ri-home-line',
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-account-box-line',
        },
        {
            name: 'Logout',
            path: '/logout',
            icon: 'ri-logout-box-line',
        },
    ];

    const menuToBeRendered = user?.isAdmin? adminMenu:userMenu;

    return (
        <div className='main'>
            <div className='d-flex layout'>
                <div className='sidebar'>
                    <div className='sidebar-header'>
                        <img src='logos.png' className='logo'></img>
                        
                    </div>
                    <div className='menu'>
                        {userMenu.map((menu, index) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div key={index} className={`d-flex menu-item ${isActive ? 'active-menu-item' : ''}`}>
                                    <i className={menu.icon}></i>
                                    <Link to={menu.path}>{menu.name}</Link>
                                </div>
                            );
                        })}
                        <div className={`d-flex menu-item `} onClick={() =>{
                            localStorage.clear()
                            navigate('/login')

                        }}>
                                    <i className='ri-logout-box-line'></i>
                                    <Link to='/login'>Logout</Link>
                                </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <div>
                           </div>
                        <div className='layout-action-icon-container align-items-center px-4'>
                            <i className="ri-notification-line layout-action-icon px-3"></i>
                            <Link className='anchor' to='/profile'>{user?.name}</Link>
                        </div>
                    </div>
                    <div className='body'>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default TraLayout;