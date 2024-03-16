import React from 'react'
import '../header.css';
import logo from './image/agio.jpg'

function Header() {
  return (
    <div className='header'>
        <div className='logo'>
        <img src={logo} id='lg' />
        </div>
        <div className='icon'>
        
        </div>
    </div>
  )
}

export default Header;