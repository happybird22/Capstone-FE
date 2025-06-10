import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from './AuthForm.module.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setCookie] = useCookies(['jwt']);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {email, password }, { withCredentials: true, });
            setCookie('jwt', res.data.token, { path: '/' });
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed. Check your credentials and try again.');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;