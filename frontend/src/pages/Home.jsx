import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Layout from '../components/Layout';


export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioActual');
    if (sesion) {
      setUsuario(JSON.parse(sesion));
    } else {
      setUsuario(null);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <Layout showBackButton={false}>
      <section className="home-container">
        {usuario ? (
          <>
            <h1>Bienvenido, {usuario.nombre || usuario.razonSocial} ({usuario.tipo})</h1>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <h1>Bienvenido a la página pública</h1>
            <p>Por favor, <a href="/login">inicia sesión</a> o <a href="/register">regístrate</a>.</p>
          </>
        )}
      </section>
      </Layout>
    );
}
