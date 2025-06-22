import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrarPasantia.css';
import Layout from '../../components/Layout';


const HABILIDADES_BLANDAS = ['Comunicación', 'Trabajo en equipo', 'Responsabilidad', 'Adaptabilidad'];
const HABILIDADES_TECNICAS = ['JavaScript', 'React', 'Node.js', 'SQL', 'Python'];
const IDIOMAS = ['Inglés', 'Portugués', 'Francés', 'Alemán'];
const NIVELES = ['Básico', 'Intermedio', 'Avanzado'];

export default function RegistrarPasantia() {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    area: '',
    vacantes: 1,
    fechaInicio: '',
    fechaFin: '',
    remuneracion: '',
    modalidad: '',
    ubicacion: '',
    duracion: '',
    horarios: '',
    tareas: '',
    carreras: '',
    anioCursado: '',
    habilidadesBlandas: {},
    habilidadesTecnicas: {},
    experiencia: '',
    idiomas: {},
    urgencia: 1
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const actual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!actual || actual.tipo !== 'empresa') {
      navigate('/login');
    } else {
      setEmpresa(actual);
    }
  }, [navigate]);

  const validar = () => {
    const nuevosErrores = {};
    if (!form.titulo.trim()) nuevosErrores.titulo = 'Título requerido';
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'Descripción requerida';
    if (form.vacantes <= 0) nuevosErrores.vacantes = 'Vacantes debe ser mayor a 0';
    if (form.fechaInicio > form.fechaFin) nuevosErrores.fechaFin = 'Fecha fin debe ser posterior a inicio';
    if (!form.carreras.trim()) nuevosErrores.carreras = 'Carreras requeridas';
    if (form.anioCursado < 1 || form.anioCursado > 7) nuevosErrores.anioCursado = 'Año de cursado inválido';
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresDetectados = validar();
    if (Object.keys(erroresDetectados).length > 0) {
      setErrores(erroresDetectados);
      return;
    }

    const nuevaPasantia = {
      ...form,
      id: crypto.randomUUID(),
      empresaId: empresa.id,
      carreras: form.carreras.split(',').map(c => c.trim()),
      estado: 'pendiente'
    };

    try {
      const pasantias = JSON.parse(localStorage.getItem('pasantias')) || [];
      pasantias.push(nuevaPasantia);
      localStorage.setItem('pasantias', JSON.stringify(pasantias));
      setMensaje('Pasantía enviada para revisión');
      setForm({
        titulo: '',
        descripcion: '',
        area: '',
        vacantes: 1,
        fechaInicio: '',
        fechaFin: '',
        remuneracion: '',
        modalidad: '',
        ubicacion: '',
        duracion: '',
        horarios: '',
        tareas: '',
        carreras: '',
        anioCursado: '',
        habilidadesBlandas: {},
        habilidadesTecnicas: {},
        experiencia: '',
        idiomas: {},
        urgencia: 1
      });
    } catch (error) {
      setMensaje('Error al guardar. Intente nuevamente.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (categoria, valor) => {
    setForm(prevForm => {
      const nuevaCategoria = { ...prevForm[categoria] };
      if (nuevaCategoria[valor]) {
        delete nuevaCategoria[valor];
      } else {
        nuevaCategoria[valor] = 'Básico';
      }
      return { ...prevForm, [categoria]: nuevaCategoria };
    });
  };

  const handleNivelChange = (categoria, valor, nivel) => {
    setForm(prevForm => ({
      ...prevForm,
      [categoria]: {
        ...prevForm[categoria],
        [valor]: nivel
      }
    }));
  };

  const renderCheckboxes = (titulo, categoria, opciones) => (
    <div className="checkbox-group">
      <label>{titulo}</label>
      {opciones.map((op) => (
        <div key={op} className="checkbox-item">
          <input
            type="checkbox"
            checked={!!form[categoria][op]}
            onChange={() => handleCheckboxChange(categoria, op)}
          />
          <span>{op}</span>
          {form[categoria][op] && (
            <select
              value={form[categoria][op]}
              onChange={(e) => handleNivelChange(categoria, op, e.target.value)}
            >
              {NIVELES.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Layout showBackButton={true}>
    <section className="form-container">
      <h2>Registrar Nueva Pasantía</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Título del Puesto', name: 'titulo' },
          { label: 'Descripción', name: 'descripcion' },
          { label: 'Área', name: 'area' },
          { label: 'Vacantes', name: 'vacantes', type: 'number' },
          { label: 'Fecha de Inicio', name: 'fechaInicio', type: 'date' },
          { label: 'Fecha de Fin', name: 'fechaFin', type: 'date' },
          { label: 'Remuneración', name: 'remuneracion'},
          { label: 'Modalidad', name: 'modalidad' },
          { label: 'Ubicación', name: 'ubicacion' },
          { label: 'Duración', name: 'duracion' },
          { label: 'Horarios Estimados', name: 'horarios' },
          { label: 'Tareas a Realizar', name: 'tareas' },
          { label: 'Carreras (separadas por coma)', name: 'carreras' },
          { label: 'Año de Cursado', name: 'anioCursado', type: 'number' },
          { label: 'Experiencia Requerida', name: 'experiencia' },
          { label: 'Urgencia (1-3)', name: 'urgencia', type: 'number' }
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name] || ''}
              onChange={handleChange}
            />
            {errores[name] && <p className="error">{errores[name]}</p>}
          </div>
        ))}

        {renderCheckboxes('Habilidades Blandas', 'habilidadesBlandas', HABILIDADES_BLANDAS)}
        {renderCheckboxes('Habilidades Técnicas', 'habilidadesTecnicas', HABILIDADES_TECNICAS)}
        {renderCheckboxes('Idiomas', 'idiomas', IDIOMAS)}

        <button type="submit">Enviar Pasantía</button>
      </form>
    </section>
    </Layout>
  );
}
