import React, { useState } from 'react';
import { login as loginAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
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
            setError('Неверный логин или пароль');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-container">
            <div className="login-form-header">
                <h2>Вход в систему</h2>
            </div>
            
            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}
            
            <form onSubmit={onSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="login">Логин</label>
                    <input
                        id="login"
                        type="text"
                        placeholder="Введите логин"
                        name="login"
                        value={login}
                        onChange={onChange}
                        required
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        className="form-input"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={`login-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Вход...
                        </>
                    ) : (
                        'Войти'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;
