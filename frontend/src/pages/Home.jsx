import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = localStorage.getItem('usuarioActual');
    if (sesion) {
      setUsuario(JSON.parse(sesion));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  return (
    <section className="home-container">
      {usuario ? (
        <>
          <h1 className="bienvenida">
            Bienvenido, {usuario.nombre || usuario.razonSocial} ({usuario.tipo})
          </h1>
          <p className="mensaje">
            Has iniciado sesión correctamente.
          </p>
          <button onClick={cerrarSesion} className="btn-logout">
            Cerrar sesión
          </button>
        </>
      ) : (
        <p className="mensaje">Cargando...</p>
      )}
    </section>
  );
}
