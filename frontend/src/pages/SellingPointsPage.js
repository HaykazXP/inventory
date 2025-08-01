import React, { useState, useEffect } from 'react';
import { getSellingPoints } from '../services/api';
import Card from '../components/Card';
import './Page.css';

const SellingPointsPage = () => {
    const [sellingPoints, setSellingPoints] = useState([]);

    useEffect(() => {
        fetchSellingPoints();
    }, []);

    const fetchSellingPoints = async () => {
        const { data } = await getSellingPoints();
        setSellingPoints(data);
    };

    return (
        <div>
            <h1>Selling Points</h1>
            <Card title="Selling Point List">
                <ul className="list">
                    {sellingPoints.map((sp) => (
                        <li key={sp._id} className="list-item">
                            <span>{sp.name} (Checkout: {sp.checkout})</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default SellingPointsPage;


