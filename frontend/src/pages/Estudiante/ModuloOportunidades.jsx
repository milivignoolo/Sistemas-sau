import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModuloOportunidades.css';
import Layout from "../../components/Layout";
import estudianteMock from '../../data/EstudianteMock.json';
import pasantiasMock from '../../data/pasantiasMock.json';


export default function ModuloOportunidades() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');
  const [estudiante, setEstudiante] = useState(estudianteMock);
  const [pasantias, setPasantias] = useState(pasantiasMock);

  useEffect(() => {
    const actual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!actual) {
      navigate('/login');
      return;
    }

    if (actual.tipo !== 'estudiante') {
      setError('Acceso denegado: Solo estudiantes pueden acceder a esta sección.');
      return;
    }

    setUsuario(actual);

    try {
      const todas = JSON.parse(localStorage.getItem('pasantias')) || [];

      const calcularCoincidencia = (p) => {
        let puntos = 0;
        let total = 0;

        // Carrera
        total++;
        if (p.carreras.includes(actual.carrera)) puntos++;

        // Año de cursado
        total++;
        if (actual.anioCursado >= p.anioCursado) puntos++;

        // Habilidades blandas
        const hbEst = Object.keys(actual.habilidadesBlandas || {}).filter(k => actual.habilidadesBlandas[k]);
        const hbReq = Object.keys(p.habilidadesBlandas || {}).filter(k => p.habilidadesBlandas[k]);
        total += hbReq.length;
        puntos += hbReq.filter(h => hbEst.includes(h)).length;

        // Habilidades técnicas
        const htEst = Object.keys(actual.habilidadesTecnicas || {}).filter(k => actual.habilidadesTecnicas[k]);
        const htReq = Object.keys(p.habilidadesTecnicas || {}).filter(k => p.habilidadesTecnicas[k]);
        total += htReq.length;
        puntos += htReq.filter(h => htEst.includes(h)).length;

        // Idiomas
        const idEst = Object.keys(actual.idiomas || {}).filter(k => actual.idiomas[k]);
        const idReq = Object.keys(p.idiomas || {}).filter(k => p.idiomas[k]);
        total += idReq.length;
        puntos += idReq.filter(h => idEst.includes(h)).length;

        return Math.round((puntos / total) * 100);
      };

      const coincidencias = todas.map(p => {
        const porcentaje = calcularCoincidencia(p);
        let etiqueta = 'Baja';
        if (porcentaje >= 80) etiqueta = 'Perfecta';
        else if (porcentaje >= 60) etiqueta = 'Alta';
        else if (porcentaje >= 30) etiqueta = 'Media';

        return {
          ...p,
          coincidencia: porcentaje,
          etiquetaCoincidencia: etiqueta
        };
      });

      setPasantias(coincidencias);
    } catch (err) {
      setError('Error al cargar las pasantías desde la base de datos.');
    }
  }, [navigate]);

  return (
    <Layout showBackButton={true}>
    <section className="modulo-oportunidades">
      <h2>Oportunidades de Pasantías</h2>
      {error && <p className="error">{error}</p>}

      <ul className="lista-pasantias">
        {pasantias.map(p => (
          <li key={p.id} className="card-pasantia">
            <h3>{p.titulo}</h3>
            <p><strong>Empresa:</strong> {p.empresa}</p>
            <p><strong>Ubicación:</strong> {p.ubicacion}</p>
            <p><strong>Modalidad:</strong> {p.modalidad}</p>
            <p><strong>Coincidencia:</strong> {p.coincidencia}% - {p.etiquetaCoincidencia}</p>
            {(p.etiquetaCoincidencia === 'Alta' || p.etiquetaCoincidencia === 'Perfecta') ? (
              <button onClick={() => alert('Postulación enviada.')}>Postularse</button>
            ) : (
              <button disabled>Coincidencia insuficiente</button>
            )}
          </li>
        ))}
      </ul>
    </section>
    </Layout>
  );
}
