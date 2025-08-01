import React from 'react';
import Card from '../components/Card';

const DashboardPage = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Card title="Welcome">
                <p>Welcome to the Inventory Management System.</p>
                <p>Use the sidebar to navigate to different sections of the application.</p>
            </Card>
        </div>
    );
};

export default DashboardPage;

