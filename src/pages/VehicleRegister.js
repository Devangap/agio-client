import React from 'react'


function VehicleRegister() {
  return (
    <div className='content'>
        
        <div className='rightSide'>
          <form id='register-form' >
            <h1>Create Vehicle Account</h1>
            <label htmlFor='name'>Vehicle Type</label>
            <input name='name' placeholder='Enter First Name' type='text'/>
            <label htmlFor='name'>Vehicle No</label>
            <input name='name' placeholder='Enter Last Name' type='text'/>

            <label htmlFor='number'>Vehicle Licence Details</label>
            <textarea 
                rows="2"
                
                placeholder='Enter Licence Details'
                name='masage'
                required
                ></textarea>
            <label htmlFor='nic'>Emissions Certificate Details</label>
            <textarea 
                rows="2"
                
                placeholder='Enter Emissions Certificate Details'
                name='masage'
                required
                ></textarea>
            
            <label htmlFor='email'>Owner Details</label>
            <textarea 
                rows="2"
                
                placeholder='Enter Owner Details'
                name='masage'
                required
                ></textarea>
            
            <button className="btn" type='submit'>REGISTER</button>
          </form>
        </div>
      </div>
  )
}

export default VehicleRegister