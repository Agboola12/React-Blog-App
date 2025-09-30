import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Routing.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Routing />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
