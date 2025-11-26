import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.2rem',
                color: '#00a884'
            }}>
                <i className="bi bi-hourglass-split" style={{ marginRight: '10px' }}></i>
                Cargando...
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, mostrar el componente hijo
    return children;
};

export default ProtectedRoute;
