import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Main_register from './pages/Main_register';

import Login from './pages/TraLogin';
import Register from './pages/TraRegister';

import { Toaster } from 'react-hot-toast';
import TraHome from './pages/TraHome';
import DriverRegister from './pages/DriverRegister';
import VehicleRegister from './pages/VehicleRegister';

import Home from './pages/Home';
import LeaveHRsup from './pages/leaveHRsup';
import Main_login from './pages/Main_login';
import AnnHRsup from './pages/AnnHRsup';





function App() {
  return (
    <div >
      <BrowserRouter>
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
          <Route path='/dregister' element={< DriverRegister/>} />
          <Route path='/vregister' element={< VehicleRegister/>} />
          
      
          


        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;