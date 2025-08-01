import React, { useState } from 'react';
import { login as loginAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await loginAPI({ login, password });
            
            // Store both tokens
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            
            // Store token expiry time
            const expiryTime = Date.now() + res.data.expiresIn;
            localStorage.setItem('tokenExpiry', expiryTime.toString());
            
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Вход</h2>
{error && <p style={{ color: 'red' }}>{error}</p>}
<form onSubmit={onSubmit}>
    <div>
        <input
            type="text"
            placeholder="Логин"
            name="login"
            value={login}
            onChange={onChange}
            required
        />
    </div>
    <div>
        <input
            type="password"
            placeholder="Пароль"
            name="password"
            value={password}
            onChange={onChange}
            required
        />
    </div>
    <button type="submit">Войти</button>
</form>
        </div>
    );
};

export default Login;
