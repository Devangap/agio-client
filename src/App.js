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
import InsClaimSubmit from './pages/InsClaimSubmit';
import InsEmployee from './pages/InsEmployee';

import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';





function App() {
  const{loading} = useSelector(state => state.alerts);
  return (
    <div >
      <BrowserRouter>
      {loading && (<div className = "spinner-parent">
      <div class="spinner-border" role="status">
  
</div>
      </div>)}
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/Main_Register' element={<PublicRoute><Main_register /></PublicRoute>} />
          <Route path='/Main_Login' element={<PublicRoute><Main_login /></PublicRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={< Register/>} />


          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/AnnHRsup' element={< AnnHRsup/>} />
          <Route path='/LeaveHRsup' element={< LeaveHRsup/>} />


          <Route path='/home' element={< TraHome/>} />
          <Route path='/dregister' element={<TraDriverRegister />} />
          <Route path='/vregister' element={< TraVehicleRegister/>} />
          
      
          



        
          <Route path='/inquiry' element ={<Inquiry/>} />

          <Route path='/insClaimSubmit' element={<InsClaimSubmit/>}/>
          <Route path='/insEmployee' element={<InsEmployee/>}/>

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;