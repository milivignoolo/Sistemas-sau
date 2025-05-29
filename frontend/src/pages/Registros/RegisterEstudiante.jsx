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
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Temporizador para el código
  useEffect(() => {
    if (step === 2 && tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
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
      const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
      setCodigoGenerado(nuevoCodigo);
      setTiempoRestante(300);
      console.log('Código enviado:', nuevoCodigo); // Simula envío
      setStep(2);
    } catch {
      setError('Error al verificar los datos. Intente más tarde.');
    }
  };

  const handleVerificarCodigo = (e) => {
    e.preventDefault();
    const codigoIngresado = codigo.trim();
    if (tiempoRestante <= 0) {
      setError('Tiempo agotado. Reenviá el código.');
    } else if (codigoIngresado !== codigoGenerado) {
      setError('El código es incorrecto.');
    } else {
      setError('');
      setStep(3);
    }
  };

 // En el componente RegisterEstudiante:

const niveles = ['Básico', 'Intermedio', 'Avanzado'];

const habilidadesOpciones = {
  tecnicas: ['Programación', 'Bases de Datos', 'Redes', 'Seguridad'],
  blandas: ['Comunicación', 'Trabajo en equipo', 'Liderazgo', 'Creatividad'],
  idiomas: ['Inglés', 'Español', 'Francés', 'Alemán'],
};


const [datosAdicionales, setDatosAdicionales] = useState({
  disponibilidad: '',
  tecnicas: {},
  blandas: {},
  experiencia: '',
  idiomas: {},
});

const toggleHabilidad = (categoria, habilidad) => {
  setDatosAdicionales(prev => {
    const categoriaActual = { ...prev[categoria] };
    if (categoriaActual[habilidad]) {
      // Si ya está seleccionada, la quitamos
      delete categoriaActual[habilidad];
    } else {
      // Si no, la agregamos con nivel básico por defecto
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

const handlePaso3 = (e) => {
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
  
    setStep(4);
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
      password, // Simulación: se guarda como texto plano
      username: legajo,
    };

    const registrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    registrados.push(nuevoUsuario);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(registrados));
    alert('¡Registro exitoso!');
    navigate('/');
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
        <form onSubmit={handleVerificarCodigo}>
          <p>Se envió un código al correo institucional. Ingresalo aquí:</p>
          <input type="text" placeholder="Código de verificación" value={codigo} onChange={e => setCodigo(e.target.value)} required />
          <p>Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}</p>
          {/* Mostrar código en pantalla para test */}
    <p><small><i>Código para test: <strong>{codigoGenerado}</strong></i></small></p>
          <button type="submit">Verificar código</button>
        </form>
      )}

{step === 3 && (
  <form onSubmit={handlePaso3}>
    <input
      type="text"
      placeholder="Disponibilidad horaria"
      value={datosAdicionales.disponibilidad}
      onChange={e => setDatosAdicionales({ ...datosAdicionales, disponibilidad: e.target.value })}
      required
    />

    {/* Habilidades Técnicas */}
    <fieldset>
      <legend>Habilidades técnicas</legend>
      {habilidadesOpciones.tecnicas.map(habilidad => (
        <div key={habilidad}>
          <label>
            <input
              type="checkbox"
              checked={!!datosAdicionales.tecnicas[habilidad]}
              onChange={() => toggleHabilidad('tecnicas', habilidad)}
            />
            {habilidad}
          </label>

          {datosAdicionales.tecnicas[habilidad] && (
            <select
              value={datosAdicionales.tecnicas[habilidad]}
              onChange={e => cambiarNivel('tecnicas', habilidad, e.target.value)}
            >
              {niveles.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </fieldset>

    {/* Habilidades Blandas */}
    <fieldset>
      <legend>Habilidades blandas</legend>
      {habilidadesOpciones.blandas.map(habilidad => (
        <div key={habilidad}>
          <label>
            <input
              type="checkbox"
              checked={!!datosAdicionales.blandas[habilidad]}
              onChange={() => toggleHabilidad('blandas', habilidad)}
            />
            {habilidad}
          </label>

          {datosAdicionales.blandas[habilidad] && (
            <select
              value={datosAdicionales.blandas[habilidad]}
              onChange={e => cambiarNivel('blandas', habilidad, e.target.value)}
            >
              {niveles.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </fieldset>

    {/* Idiomas */}
    <fieldset>
      <legend>Idiomas</legend>
      {habilidadesOpciones.idiomas.map(idioma => (
        <div key={idioma}>
          <label>
            <input
              type="checkbox"
              checked={!!datosAdicionales.idiomas[idioma]}
              onChange={() => toggleHabilidad('idiomas', idioma)}
            />
            {idioma}
          </label>

          {datosAdicionales.idiomas[idioma] && (
            <select
              value={datosAdicionales.idiomas[idioma]}
              onChange={e => cambiarNivel('idiomas', idioma, e.target.value)}
            >
              {niveles.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </fieldset>

    {/* Experiencia previa */}
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


      {step === 4 && (
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
    </Layout>
  );
}
