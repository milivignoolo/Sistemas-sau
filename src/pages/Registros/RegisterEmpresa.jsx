import { useState, useEffect } from 'react';
import empresasBase from '../../data/empresas_para_registro.json';
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

  const [empresaBase, setEmpresaBase] = useState(null);
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

  // Paso 1: Validar CUIT contra el archivo JSON base
  const handlePaso1 = (e) => {
    e.preventDefault();
    setError('');

    if (!empresa.cuit) {
      setError('Ingresá el CUIT.');
      return;
    }

    const empresaEncontrada = empresasBase.find(e => e.cuit === empresa.cuit);

    if (!empresaEncontrada) {
      setError('CUIT no habilitado para registrarse.');
      return;
    }

    // Precargamos la razón social desde el archivo
    setEmpresa({ ...empresa, razonSocial: empresaEncontrada.razonSocial });
    setEmpresaBase(empresaEncontrada);
    setStep(2);
  };

  // Paso 2: Completar datos adicionales
  const handlePaso2 = (e) => {
    e.preventDefault();
    setError('');

    const { rubro, domicilio, email, telefono, nombreReferente, cargoReferente, ubicacionTrabajo } = empresa;

    if (!rubro || !domicilio || !email || !telefono || !nombreReferente || !cargoReferente || !ubicacionTrabajo) {
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
    alert(`Código de verificación: ${codigo} (simulado)`); // Eliminar en producción
  };

  // Paso 3: Verificación del código
  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    setError('');

    if (tiempoRestante <= 0) {
      setError('Tiempo agotado. Reenviá el código.');
      return;
    }

    if (codigoIngresado.trim() !== codigoGenerado) {
      setIntentosCodigo(intentosCodigo + 1);
      if (intentosCodigo + 1 >= maxIntentosCodigo) {
        setError('Se alcanzó el número máximo de intentos.');
        return;
      }
      setError('Código incorrecto.');
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
    setIntentosCodigo(intentosCodigo + 1);
    alert(`Nuevo código reenviado: ${nuevoCodigo} (simulado)`);
  };

  // Paso 4: Crear contraseña
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
      setError('Contraseña insegura. Debe tener al menos 8 caracteres, mayúscula, número y símbolo.');
      return;
    }

    // Aquí debería ir un POST real al backend
    console.log('Empresa registrada:', { ...empresa, estado: 'pendiente' });

    setStep(5);
  };

  useEffect(() => {
    if (step === 3 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, tiempoRestante]);

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
              value={empresa.razonSocial}
              disabled
              placeholder="Razón social"
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
            <button type="submit">Enviar código</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerificarCodigo}>
            <p>Se envió un código a: {empresa.email}</p>
            <input
              type="text"
              placeholder="Código"
              value={codigoIngresado}
              onChange={e => setCodigoIngresado(e.target.value)}
              required
            />
            <p>Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}</p>
            <button type="submit">Verificar</button>
            <button type="button" onClick={handleReenviarCodigo} disabled={intentosCodigo >= maxIntentosCodigo}>
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
            <p>Tu empresa fue registrada y está pendiente de aprobación.</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
