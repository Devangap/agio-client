import React from 'react';
import '../Annlayout.css';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();//no collapsed there is the phto in ur phonr
                                   //user is defined in the phto so 1:59:39 
    
    const userMenu = [
        {
            name: 'Home',
            path: '/AnnHRsup',
            icon: 'ri-home-line',
        },
        {
            name: 'Announcements',
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
        {
            name: 'Logout',
            path: '/logout',
            icon: 'ri-logout-box-line',
        },
    ];
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
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

    //const menuToBeRendered = user.isAdmin? adminMenu:userMenu;

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
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <div>
                           </div>
                        <div className='layout-action-icon-container'>
                            <i className="ri-notification-line layout-action-icon"></i>
                        </div>
                    </div>
                    <div className='body'>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
