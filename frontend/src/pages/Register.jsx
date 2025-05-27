import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <section className="register-section">
      <h2 className="register-title">Registrarse como:</h2>
      <div className="register-button-group">
        <button className="register-button" onClick={() => handleSelect('estudiante')}>
          Estudiante
        </button>
        <button className="register-button" onClick={() => handleSelect('empresa')}>
          Empresa
        </button>
        <button className="register-button" onClick={() => handleSelect('admin')}>
          Administrador
        </button>
      </div>
    </section>
  );
}
