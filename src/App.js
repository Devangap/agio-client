
import React from 'react';

import {BrowserRouter, Routes, Route,Link,Router} from 'react-router-dom';



import Main_register from './pages/Main_register';
import MainRegDisplay from './pages/MainRegDisplay';



import { Toaster } from "react-hot-toast";
import TraHome from "./pages/TraHome";


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
import Leaveempatt from './pages/Leaveempatt';

import TraProtectedRoute from './components/TraProtectedRoute';
import TraPublicRoute from './components/TraPublicRoute';
import TraLogin from './pages/TraLogin';
import TraRegister from './pages/TraRegister';






import Inquiry from './pages/inquiry';

import InsClaimSubmit from './pages/InsClaimSubmit';
import InsEmployee from './pages/InsEmployee';
import InsuranceManagerDisplay from './pages/InsuranceManagerDisplay';
import InsuranceStatus from './pages/InsuranceStatus';
import InsuranceManager from './pages/InsuranceManager';


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


import InquiryAdmin from './pages/inquiryAdmin';

import TraBookingDisplayAdmin from './pages/TraBookingDisplayAdmin';
import TraVehicleviwe from './pages/TraVehicleviwe';
import TraDriverViwe from './pages/TraDriverViwe';
import TraPayment from './pages/TraPayment';



import UniformOrder from './pages/UniformOrder';
import UniformManagerView from './pages/UniformManagerView';
import UniformShirt from './pages/UniformShirt';
import UniformSkirt from './pages/UniformSkirt';
import UniformShirtInventory from './pages/UniformShirtInventory';
import UniformOrderDetails from './pages/UniformOrderDetails';
import UniformTotals from './pages/UniformTotals';
import UniformCharts from './pages/UniformCharts';










// medical
import MedicalAppointments from "./pages/MedicalAppointments";
import MedParameters from "./pages/MedParameters";
import MedOverview from "./pages/MedOverview";
import MedReports from "./pages/MedReports";



//performance
import Getperformancerecords from "./pages/Perform_Getperformancerecords";
import Updatedataform from "./pages/Perform_Updatedataform";


import Targets from "./pages/perform_target";
import Profile from "./pages/Perform_profile";
import Goalprogress from "./pages/Perform_goalprogress";
import Rewardsm from "./pages/Perform_Rewards";

import Rank from "./pages/Perform_Rank";
import Compare1 from "./pages/Perform_Compare1";

import Charta from "./pages/Perform_Chart";
import Viewprofileadmin from "./pages/Perform_viewemp"; 
import TraBookingdisplayAll from './pages/TraBookingdisplayAll';





function App() {

  const{loading} = useSelector(state => state.alerts);
  const [date, setDate] = React.useState(new Date().getDate());



  return (
    <div>
      <BrowserRouter>
        {loading && (
          <div className="spinner-parent">
            <div class="spinner-border" role="status"></div>
          </div>
        )}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>

          <Route
            path="/Main_Register"
            element={
              <ProtectedRoute>
                <Main_register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Main_Login"
            element={
              <PublicRoute>
                <Main_login />
              </PublicRoute>
            }
          />
          
          <Route
            path="/meddash"
            element={
              <ProtectedRoute>
                <meddash />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
         

          <Route path="/home" element={<TraHome />} />
          <Route path="/dregister" element={<TraDriverRegister />} />
          <Route path="/vregister" element={<TraVehicleRegister />} />

          <Route path="/inquiry" element={<Inquiry />} />

          {/*
          *
          *
          Medical Routes 
          * 
          */}
          <Route
            path="/medical-appointments"
            element={
              <ProtectedRoute>
                <MedicalAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parameters"
            element={
              <ProtectedRoute>
                <MedParameters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/medical-overview"
            element={
              <ProtectedRoute>
                <MedOverview />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/medical-reports"
            element={
              <ProtectedRoute>
                <MedReports />
              </ProtectedRoute>
            }
          />


          <Route path='/Main_Register' element={<ProtectedRoute><Main_register /></ProtectedRoute>} />
          <Route path='/MainRegDisplay' element={<ProtectedRoute><MainRegDisplay /></ProtectedRoute>} />
          <Route path='/Main_Login' element={<PublicRoute><Main_login /></PublicRoute>} />
        
          <Route path='/meddash' element={<ProtectedRoute><meddash/></ProtectedRoute>} />
          <Route path='/LeaveEmp' element={<ProtectedRoute><LeaveEmp /></ProtectedRoute>} />
          
          <Route path='/LeaveHrsupdisplay' element={<ProtectedRoute><LeaveHrsupdisplay /></ProtectedRoute>} />
          <Route path='/Main_Notifications' element={<ProtectedRoute><Main_Notifications /></ProtectedRoute>} />
          <Route path='/LeaveUpdate/:id' element={<ProtectedRoute><LeaveUpdate/></ProtectedRoute>} />
          <Route path='/Leaveoverview' element={<ProtectedRoute><Leaveoverview/></ProtectedRoute>} />
          <Route path='/LeaveCal' element={<ProtectedRoute><LeaveCal/></ProtectedRoute>} />
          <Route path='/Leaveempatt' element={<ProtectedRoute><Leaveempatt/></ProtectedRoute>} />

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
          <Route path='/TraPayment' element={<ProtectedRoute><TraPayment/></ProtectedRoute>} />
          <Route path='/TraBookingdisplayAll' element={<ProtectedRoute><TraBookingdisplayAll/></ProtectedRoute>} />




          
        



          <Route exact path="/MyInquiries" element={<ProtectedRoute><MyInquiries /></ProtectedRoute>} />

          <Route path='/inquiry' element ={<ProtectedRoute><Inquiry/></ProtectedRoute>} />
          <Route path='/inquiryAdmin' element ={<ProtectedRoute><InquiryAdmin/></ProtectedRoute>} />
          

          <Route path='/insClaimSubmit' element={<ProtectedRoute><InsClaimSubmit/></ProtectedRoute>}/>
          <Route path='/insEmployee/:userId' element={<ProtectedRoute><InsEmployee/></ProtectedRoute>}/>
          <Route path='/insEmployee' element={<ProtectedRoute><InsEmployee/></ProtectedRoute>}/>
          <Route path='/InsuranceManagerDisplay' element={<ProtectedRoute><InsuranceManagerDisplay/></ProtectedRoute>}/>
          <Route path='/InsuranceStatus' element={<ProtectedRoute><InsuranceStatus/></ProtectedRoute>}/>
          <Route path='/InsuranceManager' element={<ProtectedRoute><InsuranceManager/></ProtectedRoute>}/>

          
          /*performance*/

          <Route path="/view" element={<ProtectedRoute><Getperformancerecords/></ProtectedRoute>}/>
          <Route path="/update/:id" element={<ProtectedRoute><Updatedataform/></ProtectedRoute>}/>
    
          <Route path="/target" element = {<ProtectedRoute><Targets/></ProtectedRoute>}/>
          <Route path="/profile" element = {<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/progress" element = {<Goalprogress/>}/>
          <Route path="/rewardsm" element = {<ProtectedRoute><Rewardsm/></ProtectedRoute>}/>
          <Route path="/rank" element = {<Rank/>}/>
          <Route path="/com/:id" element = {<ProtectedRoute><Compare1/></ProtectedRoute>}/> 
          <Route path="/viewemp/:id" element = {<ProtectedRoute><Charta/></ProtectedRoute>}/> 
          <Route path="/viewempbyname" element = {<ProtectedRoute><Viewprofileadmin/></ProtectedRoute>}/>

         



        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
