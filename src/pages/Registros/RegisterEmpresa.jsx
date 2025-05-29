import { useState, useEffect } from 'react';
import './RegisterEmpresa.css';
import Layout from '../../components/Layout';



export default function RegisterEmpresa() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(300); // 5 min
  const [intentosCodigo, setIntentosCodigo] = useState(0);
  const maxIntentosCodigo = 3;

  const [empresa, setEmpresa] = useState({
    cuit: '',
    razonSocial: '',
    rubro: '',
    domicilio: '',
    email: '',
    telefono: '',
    nombreReferente: '',
    cargoReferente: '',
    ubicacionTrabajo: '',
    sitioWeb: '',
    redesSociales: '',
    password: '',
  });

  // Validar navegador y https al iniciar
  useEffect(() => {
    // Chequeo navegador simple (ejemplo, detectamos solo Chrome)
    const esChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!esChrome) {
      alert('Atención: Este navegador no es oficialmente compatible.');
    }

    // Chequeo HTTPS
    if (window.location.protocol !== 'https:') {
      alert('Advertencia: La conexión no es segura (HTTPS). Por seguridad, el registro puede ser bloqueado.');
    }
  }, []);

  // Temporizador para el código
  useEffect(() => {
    if (step === 4 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tiempoRestante, step]);

  // Función para validar CUIT con patrón nacional básico
  const validarCUIT = (cuit) => {
    // Simple regex: XX-XXXXXXXX-X o sin guiones 11 dígitos
    const regex = /^\d{11}$/;
    return regex.test(cuit.replace(/-/g, ''));
  };

  // Simulación: verificar si CUIT ya existe
  const cuitExiste = (cuit) => {
    // Aquí iría llamada backend
    // Simulamos con localStorage:
    const empresasRegistradas = JSON.parse(localStorage.getItem('empresasRegistradas') || '[]');
    return empresasRegistradas.some(e => e.cuit === cuit);
  };

  // Simulación: verificar si email ya existe
  const emailExiste = (email) => {
    const empresasRegistradas = JSON.parse(localStorage.getItem('empresasRegistradas') || '[]');
    return empresasRegistradas.some(e => e.email === email);
  };

  // Paso 1 -> paso 2: validar CUIT y Razón social
  const handlePaso1 = (e) => {
    e.preventDefault();
    setError('');
    if (!empresa.cuit || !empresa.razonSocial) {
      setError('Completa CUIT y Razón social.');
      return;
    }
    if (!validarCUIT(empresa.cuit)) {
      setError('CUIT inválido. Debe ser 11 dígitos.');
      return;
    }
    if (cuitExiste(empresa.cuit)) {
      alert('CUIT ya registrado. Se te redirige al inicio de sesión.');
      navigate('/login');
      return;
    }
    setStep(2);
  };

  // Paso 2 -> paso 3: validar campos adicionales y email
  const handlePaso2 = (e) => {
    e.preventDefault();
    setError('');
    const { rubro, domicilio, email, telefono, nombreReferente, cargoReferente, ubicacionTrabajo } = empresa;
    if (!rubro || !domicilio || !email || !telefono || !nombreReferente || !cargoReferente || !ubicacionTrabajo) {
      setError('Completa todos los campos obligatorios.');
      return;
    }
    // Validación simple email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido.');
      return;
    }
    if (emailExiste(email)) {
      setError('El email ya está registrado.');
      return;
    }
    // Podrías validar teléfono y otros formatos aquí también
    setStep(3);

    // Simular envío de código
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setTiempoRestante(300);
    setIntentosCodigo(0);
    alert(`Código enviado al correo: ${nuevoCodigo} (simulado)`); // Mostrar para testing
  };

  // Paso 3 -> paso 4: verificar código
  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    setError('');
    const codigoLimpio = codigoIngresado.trim();
    if (tiempoRestante <= 0) {
      setError('Tiempo agotado. Reenviá el código.');
      return;
    }
    if (codigoLimpio !== codigoGenerado) {
      setIntentosCodigo(intentosCodigo + 1);
      if (intentosCodigo + 1 >= maxIntentosCodigo) {
        setError('Número máximo de intentos alcanzado. Reenviá código.');
        return;
      }
      setError('Código incorrecto.');
      return;
    }
    setStep(4);
  };

  // Reenviar código
  const handleReenviarCodigo = () => {
    if (intentosCodigo >= maxIntentosCodigo) {
      setError('Ya alcanzaste el máximo de reenvíos.');
      return;
    }
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setTiempoRestante(300);
    setIntentosCodigo(intentosCodigo + 1);
    alert(`Código reenviado: ${nuevoCodigo} (simulado)`);
  };

  // Paso 4 -> paso 5: crear contraseña y validar
  const handleCrearPassword = (e) => {
    e.preventDefault();
    setError('');
    const pass = empresa.password;
    const valido = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);
    if (!pass) {
      setError('Debes crear una contraseña.');
      return;
    }
    if (!valido) {
      setError('Contraseña débil. Mínimo 8 caracteres, mayúscula, número y símbolo.');
      return;
    }
    // Guardar empresa (simulado localStorage)
    try {
      const empresasRegistradas = JSON.parse(localStorage.getItem('empresasRegistradas') || '[]');
      empresasRegistradas.push({ ...empresa, estado: 'pendiente' });
      localStorage.setItem('empresasRegistradas', JSON.stringify(empresasRegistradas));
      alert('Registro enviado para aprobación. ¡Gracias!');
      setStep(5); // paso final
    } catch {
      setError('Error al guardar datos. Reintentá más tarde.');
    }
  };

  return (
    <Layout showBackButton={true}>
    <section className="registro-empresa">
      <h2>Registro de Empresa</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {step === 1 && (
        <form onSubmit={handlePaso1}>
          <input
            type="text"
            placeholder="CUIT (11 dígitos)"
            value={empresa.cuit}
            onChange={e => setEmpresa({ ...empresa, cuit: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Razón Social"
            value={empresa.razonSocial}
            onChange={e => setEmpresa({ ...empresa, razonSocial: e.target.value })}
            required
          />
          <button type="submit">Continuar</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePaso2}>
          <input
            type="text"
            placeholder="Rubro o actividad principal"
            value={empresa.rubro}
            onChange={e => setEmpresa({ ...empresa, rubro: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Domicilio legal"
            value={empresa.domicilio}
            onChange={e => setEmpresa({ ...empresa, domicilio: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email de contacto"
            value={empresa.email}
            onChange={e => setEmpresa({ ...empresa, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Teléfono de contacto"
            value={empresa.telefono}
            onChange={e => setEmpresa({ ...empresa, telefono: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nombre del referente responsable"
            value={empresa.nombreReferente}
            onChange={e => setEmpresa({ ...empresa, nombreReferente: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cargo del referente"
            value={empresa.cargoReferente}
            onChange={e => setEmpresa({ ...empresa, cargoReferente: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Ubicación del lugar de trabajo"
            value={empresa.ubicacionTrabajo}
            onChange={e => setEmpresa({ ...empresa, ubicacionTrabajo: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="Sitio web (opcional)"
            value={empresa.sitioWeb}
            onChange={e => setEmpresa({ ...empresa, sitioWeb: e.target.value })}
          />
          <input
            type="text"
            placeholder="Redes sociales (opcional)"
            value={empresa.redesSociales}
            onChange={e => setEmpresa({ ...empresa, redesSociales: e.target.value })}
          />
          <button type="submit">Enviar código de verificación</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleVerificarCodigo}>
          <p>Se ha enviado un código de verificación al correo: {empresa.email}</p>
          <input
            type="text"
            placeholder="Ingresá el código"
            value={codigoIngresado}
            onChange={e => setCodigoIngresado(e.target.value)}
            required
          />
          <p>
            Tiempo restante: {Math.floor(tiempoRestante / 60)}:
            {(tiempoRestante % 60).toString().padStart(2, '0')}
          </p>
          <button type="submit">Verificar código</button>
          <button type="button" onClick={handleReenviarCodigo} disabled={intentosCodigo >= maxIntentosCodigo}>
            Reenviar código
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleCrearPassword}>
          <input
            type="password"
            placeholder="Crear contraseña segura"
            value={empresa.password}
            onChange={e => setEmpresa({ ...empresa, password: e.target.value })}
            required
          />
          <small>
            La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.
          </small>
          <button type="submit">Finalizar registro</button>
        </form>
      )}

      {step === 5 && (
        <div>
          <h3>Registro completado y pendiente de aprobación.</h3>
          <p>Recibirás un correo con la confirmación cuando la empresa sea aprobada.</p>
        </div>
      )}
    </section>
    </Layout>
  );
}
