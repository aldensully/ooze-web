import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './extras/reportWebVitals';
import { sendToVercelAnalytics } from './extras/vitals';

ReactDOM.render(
  <App />
  ,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);
