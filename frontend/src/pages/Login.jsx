import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    const empresas = JSON.parse(localStorage.getItem('empresas')) || [];
    const administradores = JSON.parse(localStorage.getItem('administradores')) || [];

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
        navigate('/inicio-estudiante');
      } else if (user.tipo === 'empresa') {
        navigate('/inicio-empresa');
      } else if (user.tipo === 'administrador') {
        navigate('/inicio-admin');
      } else {
        navigate('/');
      }
    }, 1000);
  };

  return (
    <section className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="CUIL / CUIT / DNI"
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
  );
};

export default Login;
