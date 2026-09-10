import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/authContext";
import styles from './AuthForm.module.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/parties/create');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await loginUser({ email, password });
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials and try again.');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Login Here!</h1>
            {error && <p className={styles.error}>{error}</p>}
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
