import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Inventory</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                <NavLink to="/products" className="nav-link">Products</NavLink>
                <NavLink to="/selling-points" className="nav-link">Selling Points</NavLink>
                <NavLink to="/inventory" className="nav-link">Inventory</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;

