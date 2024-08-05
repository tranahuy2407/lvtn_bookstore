import { Navigate } from 'react-router-dom';
import { useAuth } from '../authencation/UserContext';

const ProtectedRouteUser = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRouteUser;
