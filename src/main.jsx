import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">  {/* El basename "/" es el valor por defecto, lo podes incluso omitir */}
    <App />
  </BrowserRouter>
);
