import React from 'react'
import '../TraStyle/dvstyle.css'
import logo from './image/agio.jpg'
import pic from './image/Cigars.jpg'

function DVpage() {
  return (
    <div className='content1' style={{ backgroundImage: `url(${pic})` }}>

            <div className='logo'>
            <img src={logo} id='lg' />
            </div>

        <div className='left-side'>
            <h1>DRIVER REGISTER</h1>
            <button className="btn1" type='submit'>CLICK ON</button>

        </div>
        <div className='right-side'>
        <h1>VEHICLE REGISTER</h1>
        <button className="btn1" type='submit'>CLICK ON</button>

        </div>


    </div>
  )
}

export default DVpage