import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/TraLogin';
import Register from './pages/TraRegister';
import { Toaster } from 'react-hot-toast';
import TraHome from './pages/TraHome';
import DriverRegister from './pages/DriverRegister';

function App() {
  return (
    <div >
      <BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={< Register/>} />
          <Route path='/home' element={< TraHome/>} />
          <Route path='/dregister' element={< DriverRegister/>} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
