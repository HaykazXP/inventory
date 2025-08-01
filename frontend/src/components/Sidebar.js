import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
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
</nav>
        </div>
    );
};

export default Sidebar;

