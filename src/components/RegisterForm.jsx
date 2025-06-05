import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
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
    const [, setCookie] = useCookies(['jwt']);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Passwords must match');
            return;
        }

        try {
            const { username, email, password, role } = form;
            const res = await api.post('/auth/register', {
                username,
                email,
                password,
                role,
            });

            setCookie('jwt', res.data.token, { path: '/' });
            navigate('/dashboard');
        } catch (err) {
            alert('Registration failed. Try again.');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />

            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />

            <label>Confirm Password</label>
            <input name="confimrPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />

            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
            <option value="player">Player</option>
            <option value="gm">Game Master</option>
            </select>

            <button type="Submit">Create Account</button>
        </form>
    );
};

export default RegisterForm;