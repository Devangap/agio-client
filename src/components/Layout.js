import React from 'react';
import '../Annlayout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import  { useEffect } from 'react';

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
       
    ];
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line',
        },
        {
            name: ' Admin Profile',
            path: '/profile',
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

    let menuToBeRendered = userMenu;

    if (user?.isAdmin) {
        menuToBeRendered = adminMenu;
    } else if (user?.isDoctor) {
        menuToBeRendered = doctorMenu;
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
                            <i className="ri-notification-line layout-action-icon mr 3px "></i>
                          
                            <Link className="anchor" to ='/'>{user?.username}</Link>
                            
                            
                        </div>
                    </div>
                    <div className='body'>{children}</div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
