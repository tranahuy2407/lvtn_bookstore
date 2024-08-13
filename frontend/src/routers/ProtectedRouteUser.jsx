import { Navigate } from 'react-router-dom';
import { useAuth } from '../authencation/UserContext';

const ProtectedRouteUser = ({ element }) => {
    const { user, ready } = useAuth();


  if (!ready) {
    return <div>Loading...</div>; 
  }

    return user ? element : <Navigate to="/login" />;
};

export default ProtectedRouteUser;
