import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import Toast from './Toast';

const AuthForm = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', code: '' });
    const [toast, setToast] = useState({ message: '', type: '' });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!form.username || !form.password || (isRegister && !form.code)) {
            showToast('Proszę wypełnić wszystkie wymagane pola', 'error');
            return;
        }

        const endpoint = isRegister ? 'register' : 'login';

        try {
            const res = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, form);
            showToast(res.data.message, 'success');
            if (!isRegister) {
                setTimeout(() => {
                    onLogin(res.data.user);
                }, 1000);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Błąd połączenia z serwerem', 'error');
        }
    };

    return (
        <div className="auth-form-wrapper">
            <h2>{isRegister ? 'Rejestracja' : 'Logowanie'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Login"
                    onChange={handleChange}
                    value={form.username}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Hasło"
                    onChange={handleChange}
                    value={form.password}
                />
                {isRegister && (
                    <input
                        name="code"
                        placeholder="Kod uwierzytelniający"
                        onChange={handleChange}
                        value={form.code}
                    />
                )}
                <button type="submit">{isRegister ? 'Zarejestruj' : 'Zaloguj'}</button>
            </form>
            <button className="toggle-button" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Masz konto?      Zaloguj się' : 'Nie masz konta?      Zarejestruj'}
            </button>

            {toast.message && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
};

export default AuthForm;