import React, { useState, useEffect } from 'react';
import { getSellingPoints } from '../services/api';
import Card from '../components/Card';
import './Page.css';

const SellingPointsPage = () => {
    const [sellingPoints, setSellingPoints] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchSellingPoints();
    }, []);

    const fetchSellingPoints = async () => {
        const { data } = await getSellingPoints();
        setSellingPoints(data);
        if (data.length > 0) {
            setActiveTab(0);
        }
    };

    const formatCurrency = (amount) => {
        return `${amount.toLocaleString('ru-RU')} руб.`;
    };

    if (sellingPoints.length === 0) {
        return (
            <div>
                <h1>Точки продаж</h1>
                <Card title="Загрузка...">
                    <p>Загрузка точек продаж...</p>
                </Card>
            </div>
        );
    }

    const activeSellingPoint = sellingPoints[activeTab];

    return (
        <div>
            <h1>Точки продаж</h1>
            
            {/* Tabs */}
            <div className="tabs">
                <div className="tabs-header">
                    {sellingPoints.map((sp, index) => (
                        <button
                            key={sp._id}
                            className={`tab-button ${index === activeTab ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {sp.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Tab Content */}
            {activeSellingPoint && (
                <div className="tab-content">
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <Card title="Касса">
                            <div className="summary-value">
                                {formatCurrency(activeSellingPoint.cash || 0)}
                            </div>
                        </Card>
                        
                        <Card title="Стоимость товаров">
                            <div className="summary-value">
                                {formatCurrency(activeSellingPoint.inventoryTotalValue || 0)}
                            </div>
                        </Card>
                    </div>

                    {/* Products List */}
                    <Card title={`Товары в точке "${activeSellingPoint.name}"`}>
                        {activeSellingPoint.inventory && activeSellingPoint.inventory.length > 0 ? (
                            <ul className="list">
                                {activeSellingPoint.inventory.map((item) => (
                                    <li key={item._id} className="list-item">
                                        <div className="product-info">
                                            <span className="product-name">
                                                {item.productId?.name || 'Неизвестный товар'}
                                            </span>
                                            <span className="product-details">
                                                Количество: {item.quantity} • 
                                                Цена: {formatCurrency(item.productId?.price || 0)} • 
                                                Общая стоимость: {formatCurrency((item.productId?.price || 0) * item.quantity)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>В данной точке продаж нет товаров</p>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SellingPointsPage;


