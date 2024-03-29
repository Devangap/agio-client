import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Main_register from './pages/Main_register';


import { Toaster } from 'react-hot-toast';
import TraHome from './pages/TraHome';


import Home from './pages/Home';

import LeaveHRsup from './pages/leaveHRsup';
import Main_login from './pages/Main_login';

import AnnHRsup from './pages/AnnHRsup';
import AnnDisplay from './pages/AnnDisplay';
import AnnUpdate from './pages/AnnUpdate';
import TraDriverRegister from './pages/TraDriverRegister';
import TraVehicleRegister from './pages/TraVehicleRegister';

import meddash from './pages/meddash';


import TraProtectedRoute from './components/TraProtectedRoute';
import TraPublicRoute from './components/TraPublicRoute';
import TraLogin from './pages/TraLogin';
import TraRegister from './pages/TraRegister';



import Inquiry from './pages/inquiry';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TraBooking from './pages/TraBooking';
import TraBookingDisplay from './pages/TraBookingDisplay';
import TraBookingUpdate from './pages/TraBookingUpdate';
import TraVehicleDetails from './pages/TraVehicleDetails';
import TraDriverDetailsDisplay from './pages/TraDriverDetailsDisplay';



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

          <Route path='/Main_Register' element={<ProtectedRoute><Main_register /></ProtectedRoute>} />
          <Route path='/Main_Login' element={<PublicRoute><Main_login /></PublicRoute>} />
        
          <Route path='/meddash' element={<ProtectedRoute><meddash/></ProtectedRoute>} />
          

          <Route path='/Main_Register' element={<Main_register />} />
          <Route path='/Main_Login' element={<Main_login />} />




          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/AnnHRsup' element={< AnnHRsup/>} />
          <Route path='/AnnDisplay' element={< AnnDisplay/>} />
          <Route path='/AnnUpdate/:id' element={< AnnUpdate/>} />
          <Route path='/LeaveHRsup' element={< LeaveHRsup/>} />



        
            /*transport  Navigation*/
          <Route path='/home' element={<TraProtectedRoute><TraHome /></TraProtectedRoute>} />
          <Route path='/login' element={<TraPublicRoute><TraLogin /></TraPublicRoute>} />
          <Route path='/register' element={<ProtectedRoute><TraRegister /></ProtectedRoute>} />
          <Route path='/dregister' element={<TraDriverRegister />} />
          <Route path='/vregister' element={< TraVehicleRegister/>} />
          <Route path='/TraBooking' element={<TraBooking/>} />
          <Route path='/TraBookingDisplay' element={< TraBookingDisplay />} />
          <Route path='/TraBookingUpdate' element={< TraBookingUpdate />} />
          <Route path='/TravehicleDisplay' element={< TraVehicleDetails />} />
          <Route path='/TraDriverDisplay' element={< TraDriverDetailsDisplay />} />
          
      
          



        
          <Route path='/inquiry' element ={<Inquiry/>} />

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;