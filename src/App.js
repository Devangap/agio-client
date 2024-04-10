import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Main_register from './pages/Main_register';
import MainRegDisplay from './pages/MainRegDisplay';


import { Toaster } from 'react-hot-toast';
import TraHome from './pages/TraHome';

import Leaveoverview from './pages/leaveoverview';
import Home from './pages/Home';

import LeaveHRsup from './pages/leaveHRsup';
import Main_login from './pages/Main_login';

import AnnHRsup from './pages/AnnHRsup';
import AnnDisplay from './pages/AnnDisplay';
import AnnUpdate from './pages/AnnUpdate';
import TraDriverRegister from './pages/TraDriverRegister';
import TraVehicleRegister from './pages/TraVehicleRegister';

import meddash from './pages/meddash';


import LeaveEmp from './pages/leaveEmp';
import LeaveEmpform from './pages/leaveEmpform';
import Main_Notifications from './pages/Main_Notifications';
import LeaveHrsupdisplay from './pages/leaveHrsupdisplay'
import LeaveUpdate from './pages/leaveUpdate';

import TraProtectedRoute from './components/TraProtectedRoute';
import TraPublicRoute from './components/TraPublicRoute';
import TraLogin from './pages/TraLogin';
import TraRegister from './pages/TraRegister';




import Inquiry from './pages/inquiry';

import InsClaimSubmit from './pages/InsClaimSubmit';
import InsEmployee from './pages/InsEmployee';


import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TraBooking from './pages/TraBooking';
import TraBookingDisplay from './pages/TraBookingDisplay';
import TraBookingUpdate from './pages/TraBookingUpdate';
import TraVehicleDetails from './pages/TraVehicleDetails';
import TraDriverDetailsDisplay from './pages/TraDriverDetailsDisplay';
import TraDriverDetailsUpdate from './pages/TraDriverDetailsUpdate';
import TraVehicleDetailsUpdate from './pages/TraVehicleDetailsUpdate';
import DriverBox from './pages/TraDriverBox';
import TraDriverBox from './pages/TraDriverBox';
import VehicleBox from './pages/VehicleBox';
import TraBookingBox from './pages/TraBookingBox';


import MyInquiries from './pages/MyInquiries';










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
          <Route path='/MainRegDisplay' element={<ProtectedRoute><MainRegDisplay /></ProtectedRoute>} />
          <Route path='/Main_Login' element={<PublicRoute><Main_login /></PublicRoute>} />
        
          <Route path='/meddash' element={<ProtectedRoute><meddash/></ProtectedRoute>} />
          <Route path='/LeaveEmp' element={<ProtectedRoute><LeaveEmp /></ProtectedRoute>} />
          <Route path='/LeaveEmpform' element={<ProtectedRoute><LeaveEmpform /></ProtectedRoute>} />
          <Route path='/LeaveHrsupdisplay' element={<ProtectedRoute><LeaveHrsupdisplay /></ProtectedRoute>} />
          <Route path='/Main_Notifications' element={<ProtectedRoute><Main_Notifications /></ProtectedRoute>} />
          <Route path='/LeaveUpdate/:id' element={<ProtectedRoute><LeaveUpdate/></ProtectedRoute>} />
          <Route path='/Leaveoverview' element={<ProtectedRoute><Leaveoverview/></ProtectedRoute>} />

          <Route path='/Main_Register' element={<Main_register />} />
          <Route path='/Main_Login' element={<Main_login />} />




          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/AnnHRsup' element={< AnnHRsup/>} />
          <Route path='/AnnDisplay' element={< AnnDisplay/>} />
          <Route path='/AnnUpdate/:id' element={< AnnUpdate/>} />
          <Route path='/LeaveHRsup' element={< LeaveHRsup/>} />



        
            /*transport  Navigation*/
         
          <Route path='/dregister' element={<TraDriverRegister />} />
          <Route path='/vregister' element={< TraVehicleRegister/>} />
 

          <Route path='/TraBooking' element={<TraBooking/>} />
          <Route path='/TraBookingDisplay' element={< TraBookingDisplay />} />
          <Route path='/TraBookingUpdate/:id' element={< TraBookingUpdate />} />
          <Route path='/TraVehicleDetails' element={< TraVehicleDetails />} />
          <Route path='/TraDriverDetailsDisplay' element={< TraDriverDetailsDisplay />} />
          <Route path='/TraDriverDetailsUpdate/:id' element={<TraDriverDetailsUpdate/>} />
          <Route path='/TraVehicleDetailsUpdate/:id' element={<TraVehicleDetailsUpdate/>} />
          <Route path='/TraDriverBox' element={<TraDriverBox/>} />
          <Route path='/VehicleBox' element={<VehicleBox/>} />
          <Route path='/TraBookingBox' element={<TraBookingBox/>} />

          
        



          <Route exact path="/MyInquiries" element={<MyInquiries />} />

          <Route path='/inquiry' element ={<ProtectedRoute><Inquiry/></ProtectedRoute>} />
          

          <Route path='/insClaimSubmit' element={<InsClaimSubmit/>}/>
          <Route path='/insEmployee' element={<InsEmployee/>}/>

        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;