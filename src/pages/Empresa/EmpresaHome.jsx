import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmpresaHome.css';
import Layout from '../../components/Layout';


export default function EmpresaHome() {
  const [empresa, setEmpresa] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario || usuario.tipo !== 'empresa') {
      navigate('/login');
    } else {
      setEmpresa(usuario);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    navigate('/login');
  };

  const irARegistrar = () => {
    navigate('/registrar-pasantia');
  };

  return (
    <Layout showBackButton={true}>
    <section className="empresa-home">
      {empresa ? (
        <>
          <h1>Bienvenido, {empresa.razonSocial}</h1>
          <p>Este es tu panel de empresa.</p>
          <button onClick={irARegistrar}>Registrar nueva pasantía</button>
          <button onClick={cerrarSesion} className="logout">Cerrar sesión</button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </section>
    </Layout>
  );
}
