import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { usuarios } from '../Data/Usuarios';
import Layout from '../components/Layout';


const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const { estudiantes, empresas, administradores } = usuarios;
    // Buscar usuario en cualquiera de los arrays
    const user = [...estudiantes, ...empresas, ...administradores].find(
      (u) => u.id === userId
    );

    if (!user) {
      setMessage('Usuario no encontrado.');
      return;
    }

    if (user.password !== password) {
      setMessage('Contraseña incorrecta. ¿Olvidaste tu contraseña?');
      return;
    }

    if (user.estado === 'deshabilitado') {
      setMessage('Tu usuario está bloqueado. Contacta a la SAU.');
      return;
    }

    setMessage('Inicio de sesión exitoso. Redirigiendo...');

    // Guardar usuario actual en localStorage para sesiones
    localStorage.setItem('usuarioActual', JSON.stringify(user));

    setTimeout(() => {
      if (user.tipo === 'estudiante') {
        navigate('/estudiante');
      } else if (user.tipo === 'empresa') {
        navigate('/empresa');
      } else if (user.tipo === 'administrador') {
        navigate('/inicio-admin');
      } else {
        navigate('/');
      }
    }, 1000);
  };

  return (
    <Layout showBackButton={true}>
    <section className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {message && <p className="mensaje">{message}</p>}
      </form>
    </section>
    </Layout>
  );
};

export default Login;
