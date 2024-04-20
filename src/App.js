import React from 'react';
import {BrowserRouter, Routes, Route,Link,Router} from 'react-router-dom';

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
import AnnEmpDisplay from './pages/AnnEmpDisplay';
import AnnCalHead from './pages/AnnCalHead';

import AnnCalendar from './pages/AnnCalendar';
import AnnCalendarForm from './pages/AnnCalendarForm';

import LeaveCal from './pages/LeaveCal'





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
import TraBookingDisplayAdmin from './pages/TraBookingDisplayAdmin';
import TraVehicleviwe from './pages/TraVehicleviwe';
import TraDriverViwe from './pages/TraDriverViwe';










function App() {
  const{loading} = useSelector(state => state.alerts);
  const [date, setDate] = React.useState(new Date().getDate());


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
          <Route path='/LeaveCal' element={<ProtectedRoute><LeaveCal/></ProtectedRoute>} />

          <Route path='/Main_Register' element={<Main_register />} />
          <Route path='/Main_Login' element={<Main_login />} />




          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path='/AnnHRsup' element={<ProtectedRoute><AnnHRsup/></ProtectedRoute>} />
          <Route path='/AnnDisplay' element={<ProtectedRoute><AnnDisplay/></ProtectedRoute>} />
          <Route path='/AnnUpdate/:id' element={<ProtectedRoute><AnnUpdate/></ProtectedRoute>} />

          <Route path='/AnnEmpDisplay' element={<ProtectedRoute><AnnEmpDisplay/></ProtectedRoute>} />
          <Route path="/AnnCalHead"element={<ProtectedRoute><AnnCalHead date={date}/></ProtectedRoute>} />

          <Route path="/AnnCalendar"element={<ProtectedRoute><AnnCalendar /></ProtectedRoute>} />
          <Route path="/AnnCalendarForm"element={<ProtectedRoute><AnnCalendarForm /></ProtectedRoute>} />

          <Route path='/LeaveHRsup' element={< LeaveHRsup/>} />



        
            /*transport  Navigation*/
         
          <Route path='/dregister' element={<ProtectedRoute><TraDriverRegister /></ProtectedRoute>} />
          <Route path='/vregister' element={<ProtectedRoute>< TraVehicleRegister/></ProtectedRoute>} />
          <Route path='/TraBooking' element={<ProtectedRoute><TraBooking/></ProtectedRoute>} />
          <Route path='/TraBookingDisplay' element={<ProtectedRoute>< TraBookingDisplay /></ProtectedRoute>} />
          <Route path='/TraBookingUpdate/:id' element={<ProtectedRoute>< TraBookingUpdate /></ProtectedRoute>} />
          <Route path='/TraVehicleDetails' element={<ProtectedRoute>< TraVehicleDetails /></ProtectedRoute>} />
          <Route path='/TraDriverDetailsDisplay' element={<ProtectedRoute>< TraDriverDetailsDisplay /></ProtectedRoute>} />
          <Route path='/TraDriverDetailsUpdate/:id' element={<ProtectedRoute><TraDriverDetailsUpdate/></ProtectedRoute>} />
          <Route path='/TraVehicleDetailsUpdate/:id' element={<ProtectedRoute><TraVehicleDetailsUpdate/></ProtectedRoute>} />
          <Route path='/TraDriverBox' element={<ProtectedRoute><TraDriverBox/></ProtectedRoute>} />
          <Route path='/VehicleBox' element={<ProtectedRoute><VehicleBox/></ProtectedRoute>} />
          <Route path='/TraBookingBox' element={<ProtectedRoute><TraBookingBox/></ProtectedRoute>} />
          <Route path='/TraBookingDisplayAdmin' element={<ProtectedRoute><TraBookingDisplayAdmin/></ProtectedRoute>} />
          <Route path='/TraVehicleviwe' element={<ProtectedRoute><TraVehicleviwe/></ProtectedRoute>} />
          <Route path='/TraDriverViwe' element={<ProtectedRoute><TraDriverViwe/></ProtectedRoute>} />


          
        



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