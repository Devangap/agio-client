import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import AnnHRsup from './pages/AnnHRsup';



function App() {
  return (
    <div >
      <BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={< Register/>} />
          <Route path='/home' element={< Home/>} />
          <Route path='/AnnHRsup' element={< AnnHRsup/>} />
        </Routes>

      </BrowserRouter>
      
    </div>
  );
}

export default App;
