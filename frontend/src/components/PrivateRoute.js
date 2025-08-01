import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const PrivateRoute = () => {
  const auth = localStorage.getItem('token'); 
  return auth ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/login" />;
};

export default PrivateRoute;
