import React from 'react';
import ReactDOM from 'react-dom';

//Se carga el css bootstrap para que tome primero estos estilos
import 'bootstrap/dist/css/bootstrap.min.css'
//Se carga el css globals, que contiene los css generales
import './styles/globals.css'

import App from './App';
import Encabezado from './components/Encabezado';

ReactDOM.render(
  <React.StrictMode>
    {/* Encabezado se muestra en todas las páginas */}
    <Encabezado/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
