import { useState, useEffect } from 'react';
import empresasRegistradas from '../../data/empresas.json'; // empresas ya registradas oficialmente
import Layout from '../../components/Layout';
import './RegisterEmpresa.css';

export default function RegisterEmpresa() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(300);
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

  const handlePaso1 = (e) => {
    e.preventDefault();
    setError('');

    const { cuit } = empresa;

    if (!cuit || cuit.length !== 11 || !/^\d+$/.test(cuit)) {
      setError('Ingresá un CUIT válido de 11 dígitos numéricos.');
      return;
    }

    const yaRegistrada = empresasRegistradas.find(e => e.cuit === cuit);

    if (yaRegistrada) {
      setError('Esta empresa ya está registrada en el sistema.');
      return;
    }

    setStep(2);
  };

  const handlePaso2 = (e) => {
    e.preventDefault();
    setError('');

    const { razonSocial, rubro, domicilio, email, telefono, nombreReferente, cargoReferente, ubicacionTrabajo } = empresa;

    if (!razonSocial || !rubro || !domicilio || !email || !telefono || !nombreReferente || !cargoReferente || !ubicacionTrabajo) {
      setError('Todos los campos obligatorios deben estar completos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return;
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(codigo);
    setTiempoRestante(300);
    setIntentosCodigo(0);
    setStep(3);
    alert(`Código de verificación enviado a ${email}: ${codigo} (simulado)`);
  };

  useEffect(() => {
    if (step === 3 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, tiempoRestante]);

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    setError('');

    if (tiempoRestante <= 0) {
      setError('Tiempo agotado. Reenviá el código.');
      return;
    }

    if (codigoIngresado.trim() !== codigoGenerado) {
      setIntentosCodigo(prev => {
        const nuevosIntentos = prev + 1;
        if (nuevosIntentos >= maxIntentosCodigo) {
          setError('Se alcanzó el número máximo de intentos.');
        } else {
          setError('Código incorrecto.');
        }
        return nuevosIntentos;
      });
      return;
    }

    setStep(4);
  };

  const handleReenviarCodigo = () => {
    if (intentosCodigo >= maxIntentosCodigo) {
      setError('No se puede reenviar más códigos.');
      return;
    }
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setTiempoRestante(300);
    setIntentosCodigo(prev => prev + 1);
    alert(`Nuevo código reenviado: ${nuevoCodigo} (simulado)`);
  };

  const handleCrearPassword = (e) => {
    e.preventDefault();
    setError('');

    const pass = empresa.password;
    const valido = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pass);

    if (!pass) {
      setError('Ingresá una contraseña.');
      return;
    }

    if (!valido) {
      setError('Contraseña insegura. Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.');
      return;
    }

    const empresas = JSON.parse(localStorage.getItem('empresasPendientes') || '[]');
    const nuevaEmpresa = { ...empresa, estado: 'pendiente' };
    empresas.push(nuevaEmpresa);
    localStorage.setItem('empresasPendientes', JSON.stringify(empresas));

    setStep(5);
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
            <button type="submit">Validar CUIT</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePaso2}>
            <input
              type="text"
              placeholder="Razón social"
              value={empresa.razonSocial}
              onChange={e => setEmpresa({ ...empresa, razonSocial: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Rubro o actividad"
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
              placeholder="Correo electrónico"
              value={empresa.email}
              onChange={e => setEmpresa({ ...empresa, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={empresa.telefono}
              onChange={e => setEmpresa({ ...empresa, telefono: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nombre del referente"
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
              placeholder="Ubicación del trabajo"
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
            <p>Se envió un código a: <strong>{empresa.email}</strong></p>
            <input
              type="text"
              placeholder="Código de verificación"
              value={codigoIngresado}
              onChange={e => setCodigoIngresado(e.target.value)}
              required
            />
            <p>Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}</p>
            <button type="submit">Verificar código</button>
            <button
              type="button"
              onClick={handleReenviarCodigo}
              disabled={intentosCodigo >= maxIntentosCodigo}
              style={{ marginLeft: '10px' }}
            >
              Reenviar código
            </button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleCrearPassword}>
            <input
              type="password"
              placeholder="Crear contraseña"
              value={empresa.password}
              onChange={e => setEmpresa({ ...empresa, password: e.target.value })}
              required
            />
            <small>
              La contraseña debe contener mínimo 8 caracteres, una mayúscula, un número y un símbolo.
            </small>
            <button type="submit">Finalizar registro</button>
          </form>
        )}

        {step === 5 && (
          <div>
            <h3>Registro completado</h3>
            <p>
              Tu empresa fue registrada y está <strong>pendiente de aprobación</strong> por el administrador
              de la SAU.
            </p>
            <p>Recibirás una notificación por email cuando tu cuenta sea activada.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
