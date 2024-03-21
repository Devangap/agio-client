import React from 'react';
import '../Annlayout.css';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


    function Layout({ children }) {
        const { user } = useSelector((state) => state.user);
        const navigate = useNavigate();
        const location = useLocation();
    
        const userMenu = [
            {
                name: 'Home',
                path: '/',
                icon: 'ri-home-line',
            },
            {
                name: 'Announcements',
                path: '/announcements',
                icon: 'ri-survey-line',
            },
            {
                name: 'Leave',
                path: '/calendar',
                icon: 'ri-calendar-line',
            },
            {
                name: 'Uniform',
                path: '/profile',
                icon: 'ri-account-box-line',
            },
            {
                name: 'Transport',
                path: '/trans',
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
                name: 'Admin profile',
                path: '/profile',
                icon: 'ri-account-box-line',
            },
            {
                name: 'Admin Leave',
                path: '/profile',
                icon: 'ri-account-box-line',
            },
        ];
    
        const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
    
        return (
            <div className='main'>
                <div className='d-flex layout'>
                    <div className='sidebar'>
                        <div className='sidebar-header'>
                            <img src='logos.png' className='logo' />
                        </div>
                        <div className='menu'>
                            {menuToBeRendered.map((menu, index) => {
                                const isActive = location.pathname == menu.path;
                                return (
                                    <div key={index} className={`d-flex menu-item ${isActive ? 'active-menu-item' : ''}`}>
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                );
                            })}
                            <div className={`d-flex menu-item`} onClick={() => {
                                localStorage.clear();
                                navigate('/Main_login');
                            }}>
                                <i className="ri-logout-box-r-line"></i>
                                <Link to='/Main_login'> Logout</Link>
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='header'>
                            <div></div>
                            <div className='layout-action-icon-container'>
                                <i className="ri-notification-line layout-action-icon mr 3px "></i>
                                <Link className="anchor" to='/'>{user?.username}</Link>
                            </div>
                        </div>
                        <div className='body'>{children}</div>
                    </div>
                </div>
            </div>
        );
    }
    
    export default Layout;