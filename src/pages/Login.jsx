import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log('=== INICIANDO LOGIN ===');
    console.log('Datos enviados:', data);
    
    try {
      console.log('Llamando a login...');
      const result = await login(data.email, data.password);
      console.log('Login exitoso:', result);
      
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: `Ingresando al panel...`,
        timer: 1500,
        showConfirmButton: false,
      });
      
      console.log('Redirigiendo a:', result.role === 'DOCTOR' ? '/PanelDoctor' : '/dashboard');
      
      if (result.role === 'ADMIN') {
        navigate('/dashboard');
      } else if (result.role === 'DOCTOR') {
        navigate('/PanelDoctor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('=== ERROR EN LOGIN ===');
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('========================');
      
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (error.response?.status === 401 ? 'Credenciales inválidas' : null) ||
        error.message ||
        'Error de conexión con el servidor';

      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: errorMsg,
        confirmButtonColor: '#087f7a',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #087f7a 0%, #14213d 100%)' }}>
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-grid rounded-3 mb-3"
            style={{
              width: 64,
              height: 64,
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: 36,
              fontWeight: 700,
              placeItems: 'center',
            }}
          >
            +
          </div>
          <h1 className="text-white fw-bold mb-1">Red Norte Salud</h1>
          <p className="text-white-50 mb-0">Panel de Administración</p>
        </div>

        <div className="card border-0 shadow-lg" style={{ borderRadius: 12 }}>
          <div className="card-body p-4 p-md-5">
            <h5 className="fw-bold mb-4" style={{ color: '#14213d' }}>Iniciar sesión</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="tu@email.com"
                    {...register('email', { required: 'El email es obligatorio' })}
                  />
                </div>
                {errors.email && <small className="text-danger">{errors.email.message}</small>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Tu contraseña"
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                  />
                </div>
                {errors.password && <small className="text-danger">{errors.password.message}</small>}
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                style={{ background: '#087f7a', padding: '12px', fontSize: 16, borderRadius: 8 }}
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white-50 small mt-3 mb-0">
          &copy; 2026 Clínica RedNorte
        </p>
      </div>
    </div>
  );
}
