import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';

// Importar las páginas
import Home from './pages/Home';
import Register from './pages/Register';
import RegisterEstudiante from './pages/RegisterEstudiante';
import RegisterEmpresa from './pages/RegisterEmpresa';
import RegisterAdmin from './pages/RegisterAdmin';
import Login from './pages/Login';

export default function App() {
  useEffect(() => {
    // Simular base de datos inicial en localStorage

    if (!localStorage.getItem('estudiantes')) {
      localStorage.setItem('estudiantes', JSON.stringify([
        {
          id: '20345678901',
          password: 'Estu1234!',
          tipo: 'estudiante',
          estado: 'activo',
          nombre: 'Juan Pérez',
          email: 'juanperez@mail.com'
        }
      ]));
    }

    if (!localStorage.getItem('empresas')) {
      localStorage.setItem('empresas', JSON.stringify([
        {
          id: '30789012345',
          password: 'Empre123!',
          tipo: 'empresa',
          estado: 'activo',
          razonSocial: 'Soluciones SA',
          email: 'contacto@solucionessa.com'
        }
      ]));
    }

    if (!localStorage.getItem('administradores')) {
      localStorage.setItem('administradores', JSON.stringify([
        {
          id: '11222333',
          password: 'Admin123!',
          tipo: 'admin',
          estado: 'activo',
          nombre: 'Laura Gómez',
          email: 'laura.gomez@utn.edu.ar'
        }
      ]));
    }

    if (!localStorage.getItem('personalSAU')) {
      localStorage.setItem('personalSAU', JSON.stringify([
        {
          dni: '11222333',
          nombre: 'Laura',
          apellido: 'Gómez',
          email: 'laura.gomez@utn.edu.ar'
        }
      ]));
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/estudiante" element={<RegisterEstudiante />} />
      <Route path="/register/empresa" element={<RegisterEmpresa />} />
      <Route path="/register/admin" element={<RegisterAdmin />} />
      <Route path="/login" element={<Login />} />
      {/* Puedes agregar más rutas según sea necesario */}
    </Routes>
  );
}
