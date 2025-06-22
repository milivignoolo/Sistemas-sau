import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterEstudiante.css';
import Layout from '../../components/Layout';

export default function RegisterEstudiante() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [legajo, setLegajo] = useState('');
  const [dni, setDni] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [intentosCodigo, setIntentosCodigo] = useState(0);
  const maxIntentosCodigo = 3;
  const [password, setPassword] = useState('');
  const [usarOtroEmail, setUsarOtroEmail] = useState(false);
  const [emailEditable, setEmailEditable] = useState('');
  const [datosAdicionales, setDatosAdicionales] = useState({
    disponibilidad: '',
    tecnicas: {},
    blandas: {},
    experiencia: '',
    idiomas: {},
  });

  const navigate = useNavigate();

  const niveles = ['Básico', 'Intermedio', 'Avanzado'];

  const habilidadesOpciones = {
    tecnicas: ['Programación', 'Bases de Datos', 'Redes', 'Seguridad'],
    blandas: ['Comunicación', 'Trabajo en equipo', 'Liderazgo', 'Creatividad'],
    idiomas: ['Inglés', 'Español', 'Francés', 'Alemán'],
  };

  useEffect(() => {
    if (step === 3 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [tiempoRestante, step]);

  const handlePaso1 = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{4,6}$/.test(legajo) || !/^\d{7,8}$/.test(dni)) {
      setError('Formato inválido de legajo o DNI.');
      return;
    }

    try {
      const res = await fetch('/estudiantes_sysacad.json');
      const estudiantes = await res.json();
      const encontrado = estudiantes.find(e => e.legajo === legajo && e.dni === dni);

      if (!encontrado) {
        setError('Legajo y DNI no coinciden.');
        return;
      }

      if (encontrado.estado === 'egresado') {
        setError('Solo estudiantes activos pueden registrarse.');
        return;
      }

      const faltan = ['nombre', 'carrera', 'anio', 'promedio', 'materiasAprobadas', 'materiasRegularizadas', 'email']
        .some(c => !encontrado[c]);
      if (faltan) {
        setError('Datos incompletos en Sysacad. Contactá con la SAU.');
        return;
      }

      const registrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
      if (registrados.some(r => r.legajo === legajo)) {
        setError('Ya estás registrado.');
        return;
      }

      setEstudiante(encontrado);
      setUsarOtroEmail(false);
      setEmailEditable('');
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('Error al verificar los datos. Intente más tarde.');
    }
  };

  const handleEnviarCodigo = (e) => {
    e.preventDefault();
    setError('');

    if (usarOtroEmail) {
      if (!/\S+@\S+\.\S+/.test(emailEditable)) {
        setError('Email alternativo inválido.');
        return;
      }
      setEstudiante(prev => ({ ...prev, email: emailEditable }));
    }

    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setTiempoRestante(300);
    setIntentosCodigo(0);
    setCodigo('');
    console.log('Código enviado:', nuevoCodigo);
    setStep(3);
  };

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    const codigoIngresado = codigo.trim();

    if (tiempoRestante <= 0) {
      setError('Tiempo agotado. Reenviá el código.');
      return;
    }

    if (codigoIngresado !== codigoGenerado) {
      const nuevosIntentos = intentosCodigo + 1;
      setIntentosCodigo(nuevosIntentos);

      if (nuevosIntentos >= maxIntentosCodigo) {
        setError('Se alcanzó el número máximo de intentos.');
      } else {
        setError('El código es incorrecto.');
      }
      return;
    }

    setError('');
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
    setCodigo('');
    setIntentosCodigo(prev => prev + 1);
    console.log('Nuevo código reenviado:', nuevoCodigo);
  };

  const toggleHabilidad = (categoria, habilidad) => {
    setDatosAdicionales(prev => {
      const categoriaActual = { ...prev[categoria] };
      if (categoriaActual[habilidad]) {
        delete categoriaActual[habilidad];
      } else {
        categoriaActual[habilidad] = 'Básico';
      }
      return { ...prev, [categoria]: categoriaActual };
    });
  };

  const cambiarNivel = (categoria, habilidad, nivel) => {
    setDatosAdicionales(prev => {
      const categoriaActual = { ...prev[categoria] };
      categoriaActual[habilidad] = nivel;
      return { ...prev, [categoria]: categoriaActual };
    });
  };

  const handlePaso4 = (e) => {
    e.preventDefault();
    setError('');

    if (!datosAdicionales.disponibilidad.trim()) {
      setError('Por favor, completá la disponibilidad horaria.');
      return;
    }

    const tieneHabilidadSeleccionada =
      Object.keys(datosAdicionales.tecnicas).length > 0 ||
      Object.keys(datosAdicionales.blandas).length > 0 ||
      Object.keys(datosAdicionales.idiomas).length > 0;

    if (!tieneHabilidadSeleccionada) {
      setError('Seleccioná al menos una habilidad técnica, blanda o idioma.');
      return;
    }

    if (!datosAdicionales.experiencia.trim()) {
      setError('Por favor, completá la experiencia previa.');
      return;
    }

    setStep(5);
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    const valido = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    if (!valido) {
      setError('Contraseña insegura. Usá 8+ caracteres, letras, números y símbolos.');
      return;
    }

    const nuevoUsuario = {
      ...estudiante,
      ...datosAdicionales,
      legajo,
      password,
      username: legajo,
    };

    const registrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    registrados.push(nuevoUsuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(registrados));
    alert('¡Registro exitoso!');
    navigate('/');
  };

  const handleBorrarRegistros = () => {
    localStorage.removeItem('usuariosRegistrados');
    alert('Registros borrados. Ya podés volver a registrarte con los mismos datos.');
  };

  return (
    <Layout showBackButton={true}>
      <section className="registro-estudiante">
        <h2>Registro de Estudiante</h2>

        {step === 1 && (
          <form onSubmit={handlePaso1}>
            <input type="text" placeholder="Legajo" value={legajo} onChange={e => setLegajo(e.target.value)} required />
            <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required />
            <button type="submit">Verificar identidad</button>
          </form>
        )}

        {step === 2 && (
          <div className="resumen-estudiante">
            <h3>Datos verificados</h3>
            <p><strong>Nombre:</strong> {estudiante?.nombre}</p>
            <p><strong>Carrera:</strong> {estudiante?.carrera}</p>
            <p><strong>Año:</strong> {estudiante?.anio}</p>
            <p><strong>Promedio:</strong> {estudiante?.promedio}</p>
            <p><strong>Materias aprobadas:</strong> {estudiante?.materiasAprobadas}</p>
            <p><strong>Materias regularizadas:</strong> {estudiante?.materiasRegularizadas}</p>
            <p><strong>Email institucional:</strong> {estudiante?.email}</p>

            <label>
              <input
                type="checkbox"
                checked={usarOtroEmail}
                onChange={(e) => {
                  setUsarOtroEmail(e.target.checked);
                  if (!e.target.checked) setEmailEditable('');
                }}
              />
              Quiero usar otro email
            </label>

            {usarOtroEmail && (
              <input
                type="email"
                placeholder="Ingresá otro correo"
                value={emailEditable}
                onChange={(e) => setEmailEditable(e.target.value)}
                required
              />
            )}

            <button onClick={handleEnviarCodigo} style={{ marginTop: '1rem' }}>
              Enviar código de verificación
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleVerificarCodigo}>
            <p>Se envió un código al correo institucional. Ingresalo aquí:</p>
            <input
              type="text"
              placeholder="Código de verificación"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
            />
            <p>Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}</p>
            <p><small><i>Código para test: <strong>{codigoGenerado}</strong></i></small></p>
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
          <form onSubmit={handlePaso4}>
            <input
              type="text"
              placeholder="Disponibilidad horaria"
              value={datosAdicionales.disponibilidad}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, disponibilidad: e.target.value })}
              required
            />

            {['tecnicas', 'blandas', 'idiomas'].map(cat => (
              <fieldset key={cat}>
                <legend>Habilidades {cat}</legend>
                {habilidadesOpciones[cat].map(habilidad => (
                  <div key={habilidad}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!datosAdicionales[cat][habilidad]}
                        onChange={() => toggleHabilidad(cat, habilidad)}
                      />
                      {habilidad}
                    </label>
                    {datosAdicionales[cat][habilidad] && (
                      <select
                        value={datosAdicionales[cat][habilidad]}
                        onChange={e => cambiarNivel(cat, habilidad, e.target.value)}
                      >
                        {niveles.map(nivel => (
                          <option key={nivel} value={nivel}>{nivel}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </fieldset>
            ))}

            <input
              type="text"
              placeholder="Experiencia previa"
              value={datosAdicionales.experiencia}
              onChange={e => setDatosAdicionales({ ...datosAdicionales, experiencia: e.target.value })}
              required
            />

            <button type="submit">Siguiente</button>
          </form>
        )}

        {step === 5 && (
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

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={handleBorrarRegistros} style={{
            fontSize: '0.85rem',
            background: 'none',
            color: '#666',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}>
            🧹 Borrar registros guardados (para testear de nuevo)
          </button>
        </p>
      </section>
    </Layout>
  );
}
