import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import { useAuth } from "../../context/authContext";
import styles from './AuthForm.module.css';

const RegisterForm = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'player',
    });

    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords must match');
            return;
        }

        try {
            const { username, email, password, role } = form;
            await registerUser({ username, email, password, role });
        } catch (err) {
            setError(err.message || 'Registration failed. Try again.');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Register for an account here!</h1>
            {error && <p className={styles.error}>{error}</p>}
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />

            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />

            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
            <option value="player">Player</option>
            <option value="gm">Game Master</option>
            </select>

            <button type="submit">Create Account</button>
        </form>
    );
};

export default RegisterForm;
