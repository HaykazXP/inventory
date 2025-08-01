import React from 'react';
import Login from '../components/Login';
import './LoginPage.css';

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo">
                        <div className="logo-icon">📦</div>
                        <h1>Система управления инвентарем</h1>
                    </div>
                    <p className="login-subtitle">Войдите в систему для управления товарами и продажами</p>
                </div>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
