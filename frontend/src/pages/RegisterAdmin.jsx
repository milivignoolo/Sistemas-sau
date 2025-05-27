// src/components/RegisterAdministrador.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterAdmin.css';

export default function RegisterAdministrador() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const [administrador, setAdministrador] = useState(null);
  const [codigo, setCodigo] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tiempoRestante, step]);

  const handlePaso1 = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{7,8}$/.test(dni)) {
      setError('Formato de DNI inválido.');
      return;
    }

    try {
      const res = await fetch('/personal_sau.json');
      const personal = await res.json();
      const encontrado = personal.find(p => p.dni === dni && p.nombre === nombre && p.apellido === apellido);

      if (!encontrado) {
        setError('Datos no encontrados en la base de la SAU.');
        return;
      }

      if (!encontrado.email) {
        setError('No se encontró email asociado. Contacte con la SAU.');
        return;
      }

      setAdministrador(encontrado);
      const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoGenerado(nuevoCodigo);
      setTiempoRestante(300);
      console.log('Código enviado:', nuevoCodigo);
      setStep(2);
    } catch {
      setError('Error al verificar los datos. Intente más tarde.');
    }
  };

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    const limpio = codigo.trim();
    if (tiempoRestante <= 0) {
      setError('Tiempo expirado. Solicite reenvío del código.');
    } else if (limpio !== codigoGenerado) {
      setError('El código no es correcto.');
    } else {
      setError('');
      setStep(3);
    }
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    const valido = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    if (!valido) {
      setError('Contraseña insegura. Usá 8+ caracteres, letras, números y símbolos.');
      return;
    }

    const nuevoAdmin = {
      ...administrador,
      dni,
      username: dni,
      password
    };

    try {
      const registrados = JSON.parse(localStorage.getItem('administradoresRegistrados') || '[]');
      registrados.push(nuevoAdmin);
      localStorage.setItem('administradoresRegistrados', JSON.stringify(registrados));
      alert('¡Registro exitoso!');
      navigate('/');
    } catch {
      setError('Error al registrar los datos. Intente más tarde.');
    }
  };

  return (
    <section className="registro-admin">
      <h2>Registro de Administrador</h2>

      {step === 1 && (
        <form onSubmit={handlePaso1}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
          <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required />
          <button type="submit">Verificar identidad</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerificarCodigo}>
          <p>Se envió un código al correo institucional. Ingresalo aquí:</p>
          <input type="text" placeholder="Código de verificación" value={codigo} onChange={e => setCodigo(e.target.value)} required />
          <p>Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}</p>
          <p><small><i>Código para test: <strong>{codigoGenerado}</strong></i></small></p>
          <button type="submit">Verificar código</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleRegistrar}>
          <input
            type="password"
            placeholder="Crear contraseña segura"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Finalizar registro</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
