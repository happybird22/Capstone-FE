import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;