import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../services/api';
import './Sidebar.css';

const Sidebar = () => {
    const handleLogout = () => {
        if (window.confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Инвентарь</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="nav-link">Главная</NavLink>
                <NavLink to="/products" className="nav-link">Товары</NavLink>
                <NavLink to="/selling-points" className="nav-link">Точки продаж</NavLink>
                <NavLink to="/stock-history" className="nav-link">История закупок</NavLink>
                <NavLink to="/non-cash" className="nav-link">Безналичные</NavLink>
                <NavLink to="/cash" className="nav-link">Наличные</NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

