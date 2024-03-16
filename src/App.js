import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Main_register from './pages/Main_register';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';



function App() {
  return (
    <div >
      <BrowserRouter>
      <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          <Route path='/Main_Register' element={<Main_register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={< Register/>} />
          <Route path='/home' element={< Home/>} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
