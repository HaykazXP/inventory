import React, { useState, useEffect } from 'react';
import { getStockReplenishments } from '../services/api';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import './Page.css';

const StockReplenishmentHistoryPage = () => {
    const [stockReplenishments, setStockReplenishments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchStockReplenishments();
    }, []);

    const fetchStockReplenishments = async () => {
        try {
            setLoading(true);
            const { data } = await getStockReplenishments();
            setStockReplenishments(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching stock replenishments:', error);
            setError('Ошибка загрузки истории закупок');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return stockReplenishments.slice(startIndex, endIndex);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    if (loading) {
        return (
            <div>
                <h1>История закупок</h1>
                <Card title="Загрузка...">
                    <p>Загрузка истории закупок...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>История закупок</h1>
                <Card title="Ошибка">
                    <p>{error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <h1>История закупок</h1>
            
            <Card>
                <div className="card-header-with-action">
                    <h3 className="card-title">Все закупки по всем точкам продаж</h3>
                    <div className="summary-info">
                        <span>Всего записей: {stockReplenishments.length}</span>
                    </div>
                </div>
                
                {stockReplenishments.length > 0 ? (
                    <>
                        <div className="stock-replenishments-table-container">
                            <table className="stock-replenishments-table">
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Точка продаж</th>
                                        <th>Товар</th>
                                        <th>Количество</th>
                                        <th>Сумма</th>
                                        <th>Примечания</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getPaginatedData().map((replenishment) => (
                                        <tr key={replenishment._id}>
                                            <td className="date-cell">
                                                {formatDate(replenishment.date)}
                                            </td>
                                            <td className="selling-point-cell">
                                                {replenishment.sellingPointId?.name || 'Неизвестная точка'}
                                            </td>
                                            <td className="product-name-cell">
                                                {replenishment.productId?.name || 'Неизвестный товар'}
                                            </td>
                                            <td className="quantity-cell">
                                                {replenishment.quantity}
                                            </td>
                                            <td className="amount-cell">
                                                {replenishment.productId?.price 
                                                    ? `${(replenishment.quantity * replenishment.productId.price).toFixed(2)} руб.`
                                                    : '-'
                                                }
                                            </td>
                                            <td className="notes-cell">
                                                {replenishment.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <Pagination
                            currentPage={currentPage}
                            totalItems={stockReplenishments.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </>
                ) : (
                    <div className="empty-replenishments">
                        <p>История закупок пуста</p>
                        <p>Закупки будут отображаться здесь после их добавления через точки продаж.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StockReplenishmentHistoryPage;