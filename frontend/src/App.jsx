import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


// Importar las páginas
import Home from './pages/Home';
import Register from './pages/Registros/Register';
import RegisterEstudiante from './pages/Registros/RegisterEstudiante';
import RegisterEmpresa from './pages/Registros/RegisterEmpresa';
import RegisterAdmin from './pages/Registros/RegisterAdmin';
import Login from './pages/Login';
import RegistrarPasantia from './pages/Registros/RegistrarPasantia';
import EmpresaHome from './pages/Empresa/EmpresaHome';
import ModuloOportunidades from './pages/Estudiante/ModuloOportunidades';
import EstudianteHome from './pages/Estudiante/EstudianteHome';


export default function App() {

  return (
    <Routes>
       <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/estudiante" element={<RegisterEstudiante />} />
      <Route path="/register/empresa" element={<RegisterEmpresa />} />
      <Route path="/register/admin" element={<RegisterAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registrar-pasantia" element={<RegistrarPasantia />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/oportunidades" element={<ModuloOportunidades />} />
      <Route path="/empresa" element={<EmpresaHome />} />
      <Route path="/estudiante" element={<EstudianteHome />} />
    </Routes>
  );
}
