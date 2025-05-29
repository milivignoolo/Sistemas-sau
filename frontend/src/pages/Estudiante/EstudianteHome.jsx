import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EstudianteHome.css';
import Layout from "../../components/Layout";

export default function EstudianteHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <Layout showBackButton={true}>
    <section className="estudiante-home">
      <h2>Bienvenido/a al Portal del Estudiante</h2>
      <div className="acciones">
        <button onClick={() => navigate('/oportunidades')}>
          Ver Oportunidades de Pasantías
        </button>
        <button onClick={handleLogout} className="cerrar">
          Cerrar Sesión
        </button>
      </div>
    </section>
    </Layout>
  );
}
