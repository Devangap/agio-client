import React from 'react';
import ReactDOM from 'react-dom/client';//user react-dom/client not react-dom
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import empstore from './redux/empstore';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={empstore}>
      <App />
    </Provider>

);


// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={empstore||store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
//ReactDOM.rednder is in the older version
reportWebVitals();
