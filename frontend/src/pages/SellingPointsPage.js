import React, { useState, useEffect } from 'react';
import { getSellingPoints, getStockReplenishments, getInventoryLogs } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import AddProductModal from '../components/AddProductModal';
import AddStockReplenishmentModal from '../components/AddStockReplenishmentModal';
import './Page.css';

const SellingPointsPage = () => {
    const [sellingPoints, setSellingPoints] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [activeSubTab, setActiveSubTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockReplenishmentModalOpen, setIsStockReplenishmentModalOpen] = useState(false);
    const [stockReplenishments, setStockReplenishments] = useState([]);
    const [inventoryLogs, setInventoryLogs] = useState([]);

    const subTabs = [
        { id: 0, name: 'Товары' },
        { id: 1, name: 'Закупки' },
        { id: 2, name: 'Расчет по количеству' },
        { id: 3, name: 'Расчет по деньгам' }
    ];

    useEffect(() => {
        fetchSellingPointsInitial();
        fetchStockReplenishments();
        fetchInventoryLogs();
    }, []);

    const fetchSellingPoints = async () => {
        const { data } = await getSellingPoints();
        setSellingPoints(data);
    };

    const fetchSellingPointsInitial = async () => {
        const { data } = await getSellingPoints();
        setSellingPoints(data);
        if (data.length > 0) {
            setActiveTab(0);
        }
    };

    const fetchStockReplenishments = async () => {
        try {
            const { data } = await getStockReplenishments();
            setStockReplenishments(data);
        } catch (error) {
            console.error('Error fetching stock replenishments:', error);
        }
    };

    const fetchInventoryLogs = async () => {
        try {
            const { data } = await getInventoryLogs();
            setInventoryLogs(data);
        } catch (error) {
            console.error('Error fetching inventory logs:', error);
        }
    };

    const handleModalSuccess = () => {
        fetchSellingPoints(); // Refresh data after successful addition without changing tab
        fetchInventoryLogs(); // Refresh inventory logs
    };

    const handleStockReplenishmentSuccess = () => {
        fetchStockReplenishments(); // Refresh stock replenishments after successful addition
        fetchSellingPoints(); // Also refresh selling points to update inventory
        fetchInventoryLogs(); // Refresh inventory logs
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
                    <div className="tabs-list">
                        {sellingPoints.map((sp, index) => (
                            <button
                                key={sp._id}
                                className={`tab-button ${index === activeTab ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(index);
                                    setActiveSubTab(0); // Reset to first sub-tab when changing selling point
                                }}
                            >
                                {sp.name}
                            </button>
                        ))}
                    </div>
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

                    {/* Sub Tabs */}
                    <div className="sub-tabs">
                        <div className="sub-tabs-header">
                            {subTabs.map((subTab) => (
                                <button
                                    key={subTab.id}
                                    className={`sub-tab-button ${subTab.id === activeSubTab ? 'active' : ''}`}
                                    onClick={() => setActiveSubTab(subTab.id)}
                                >
                                    {subTab.name}
                                </button>
                            ))}
                        </div>

                        {/* Sub Tab Content */}
                        <div className="sub-tab-content">
                            {activeSubTab === 0 && (
                                /* Товары Tab */
                                <Card>
                                    <div className="card-header-with-action">
                                        <h3 className="card-title">{`Товары в точке "${activeSellingPoint.name}"`}</h3>
                                        <Button onClick={() => setIsModalOpen(true)}>
                                            Добавить товар
                                        </Button>
                                    </div>
                                    {activeSellingPoint.inventory && activeSellingPoint.inventory.length > 0 ? (
                                        <div className="products-table-container">
                                            <table className="products-table">
                                                <thead>
                                                    <tr>
                                                        <th>Товар</th>
                                                        <th>Количество</th>
                                                        <th>Цена за единицу</th>
                                                        <th>Общая стоимость</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {activeSellingPoint.inventory.map((item) => (
                                                        <tr key={item._id}>
                                                            <td className="product-name-cell">
                                                                {item.productId?.name || 'Неизвестный товар'}
                                                            </td>
                                                            <td className="quantity-cell">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="price-cell">
                                                                {formatCurrency(item.productId?.price || 0)}
                                                            </td>
                                                            <td className="total-cell">
                                                                {formatCurrency((item.productId?.price || 0) * item.quantity)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-products">
                                            <p>В данной точке продаж нет товаров</p>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {activeSubTab === 1 && (
                                /* Закупки Tab */
                                <Card>
                                    <div className="card-header-with-action">
                                        <h3 className="card-title">История закупок</h3>
                                        <Button onClick={() => setIsStockReplenishmentModalOpen(true)}>
                                            Добавить закупку
                                        </Button>
                                    </div>
                                    {stockReplenishments.filter(rep => rep.sellingPointId && rep.sellingPointId._id === activeSellingPoint._id).length > 0 ? (
                                        <div className="stock-replenishments-table-container">
                                            <table className="stock-replenishments-table">
                                                <thead>
                                                    <tr>
                                                        <th>Дата</th>
                                                        <th>Товар</th>
                                                        <th>Количество</th>
                                                        <th>Примечания</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stockReplenishments
                                                        .filter(rep => rep.sellingPointId && rep.sellingPointId._id === activeSellingPoint._id)
                                                        .map((replenishment) => (
                                                        <tr key={replenishment._id}>
                                                            <td className="date-cell">
                                                                {new Date(replenishment.date).toLocaleDateString('ru-RU', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </td>
                                                            <td className="product-name-cell">
                                                                {replenishment.productId?.name || 'Неизвестный товар'}
                                                            </td>
                                                            <td className="quantity-cell">
                                                                {replenishment.quantity}
                                                            </td>
                                                            <td className="notes-cell">
                                                                {replenishment.notes || '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="empty-replenishments">
                                            <p>История закупок для данной точки пуста</p>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {activeSubTab === 2 && (
                                /* Расчет по количеству Tab */
                                <Card title="Расчет по количеству">
                                    <p>Содержимое раздела "Расчет по количеству" будет добавлено позже.</p>
                                </Card>
                            )}

                            {activeSubTab === 3 && (
                                /* Расчет по деньгам Tab */
                                <Card title="Расчет по деньгам">
                                    <p>Содержимое раздела "Расчет по деньгам" будет добавлено позже.</p>
</Card>
                            )}
                        </div>
                    </div>

                    {/* Inventory History Table */}
                    <Card title="История изменений товаров">
                        {inventoryLogs.filter(log => log.sellingPointId && log.sellingPointId._id === activeSellingPoint._id).length > 0 ? (
                            <div className="inventory-logs-table-container">
                                <table className="inventory-logs-table">
                                    <thead>
                                        <tr>
                                            <th>Дата</th>
                                            <th>Товар</th>
                                            <th>Тип изменения</th>
                                            <th>Было</th>
                                            <th>Стало</th>
                                            <th>Изменение</th>
                                            <th>Примечания</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryLogs
                                            .filter(log => log.sellingPointId && log.sellingPointId._id === activeSellingPoint._id)
                                            .map((log) => (
                                            <tr key={log._id}>
                                                <td className="date-cell">
                                                    {new Date(log.date).toLocaleDateString('ru-RU', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="product-name-cell">
                                                    {log.productId?.name || 'Неизвестный товар'}
                                                </td>
                                                <td className="change-type-cell">
                                                    <span className={`change-type ${log.changeType}`}>
                                                        {log.changeType === 'addition' ? 'Пополнение' : 
                                                         log.changeType === 'subtraction' ? 'Списание' : 'Корректировка'}
                                                    </span>
                                                </td>
                                                <td className="quantity-cell">
                                                    {log.oldValue}
                                                </td>
                                                <td className="quantity-cell">
                                                    {log.newValue}
                                                </td>
                                                <td className={`quantity-cell ${log.countChange > 0 ? 'positive' : 'negative'}`}>
                                                    {log.countChange > 0 ? '+' : ''}{log.countChange}
                                                </td>
                                                <td className="notes-cell">
                                                    {log.notes || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-logs">
                                <p>История изменений для данной точки пуста</p>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* Add Product Modal */}
            {activeSellingPoint && (
                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    sellingPointId={activeSellingPoint._id}
                    sellingPointName={activeSellingPoint.name}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Add Stock Replenishment Modal */}
            {activeSellingPoint && (
                <AddStockReplenishmentModal
                    isOpen={isStockReplenishmentModalOpen}
                    onClose={() => setIsStockReplenishmentModalOpen(false)}
                    sellingPointId={activeSellingPoint._id}
                    sellingPointName={activeSellingPoint.name}
                    onSuccess={handleStockReplenishmentSuccess}
                />
            )}
        </div>
    );
};

export default SellingPointsPage;


