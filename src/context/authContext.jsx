import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cookies] = useCookies(['jwt']);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!cookies.jwt) return;
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error('Auth fetch failed:', err);
            }
        };
        fetchUser();
    }, [cookies.jwt]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);