import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Main_register from './pages/Main_register';

import Login from './pages/TraLogin';
import Register from './pages/TraRegister';

import { Toaster } from 'react-hot-toast';
import TraHome from './pages/TraHome';


import Home from './pages/Home';
import LeaveHRsup from './pages/leaveHRsup';
import Main_login from './pages/Main_login';

import AnnHRsup from './pages/AnnHRsup';
import TraDriverRegister from './pages/TraDriverRegister';
import TraVehicleRegister from './pages/TraVehicleRegister';




import Inquiry from './pages/inquiry';
import { useSelector } from 'react-redux';



function App() {
  const{loading} = useSelector(state => state.alerts);
  return (
    <div >
      <BrowserRouter>
<<<<<<< Updated upstream
      <div className = "spinner-parent">
      <div class="spinner-border" role="status">
  
</div>
      </div>
=======
      {loading && (<div className = "spinner-parent">
      <div class="spinner-border" role="status">
  
</div>
      </div>)}
>>>>>>> Stashed changes
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/Main_Register' element={<Main_register />} />
          <Route path='/Main_Login' element={<Main_login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={< Register/>} />


          <Route path='/' element={< Home/>} />
          <Route path='/AnnHRsup' element={< AnnHRsup/>} />
          <Route path='/LeaveHRsup' element={< LeaveHRsup/>} />


          <Route path='/home' element={< TraHome/>} />
          <Route path='/dregister' element={<TraDriverRegister />} />
          <Route path='/vregister' element={< TraVehicleRegister/>} />
          
      
          



        
          <Route path='/inquiry' element ={<Inquiry/>} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;