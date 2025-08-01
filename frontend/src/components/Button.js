import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
    return (
        <button onClick={onClick} type={type} className={`btn btn-${variant}`}>
            {children}
        </button>
    );
};

export default Button;
