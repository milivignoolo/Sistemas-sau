import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <header className="main-header">
      <h1>Pasantías UTN</h1>
    </header>
  );
}
