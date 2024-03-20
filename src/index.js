import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import reportWebVitals from './reportWebVitals';
import empstore from './redux/empstore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store = {empstore}>
    <App />
  </Provider>
);


reportWebVitals();
