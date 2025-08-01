import React from 'react';
import Card from '../components/Card';

const DashboardPage = () => {
    return (
        <div>
            <h1>Главная</h1>
            <Card title="Добро пожаловать">
                <p>Добро пожаловать в систему управления инвентарем.</p>
                <p>Используйте боковую панель для навигации по разделам приложения.</p>
            </Card>
        </div>
    );
};

export default DashboardPage;

