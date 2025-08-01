import React, { useState, useEffect } from 'react';
import { getNonCashSummary, getNonCashRecords } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import WithdrawNonCashModal from '../components/WithdrawNonCashModal';
import Pagination from '../components/Pagination';
import './Page.css';
import './NonCashPage.css';

const NonCashPage = () => {
    const [summary, setSummary] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [summaryResponse, recordsResponse] = await Promise.all([
                getNonCashSummary(),
                getNonCashRecords()
            ]);
            
            setSummary(summaryResponse.data);
            setRecords(recordsResponse.data);
        } catch (error) {
            setError('Ошибка при загрузке данных');
            console.error('Error fetching non-cash data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawSuccess = () => {
        fetchData(); // Refresh data after successful withdrawal
    };

    const formatCurrency = (amount) => {
        return `${amount.toLocaleString('ru-RU')} руб.`;
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecords = records.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="non-cash-page">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Загрузка данных...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="non-cash-page">
                <div className="error-state">
                    <p className="error-message">{error}</p>
                    <Button onClick={fetchData}>Попробовать снова</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="non-cash-page">
            <div className="page-header">
                <h1>Управление безналичными средствами</h1>
                <p className="page-description">
                    Просмотр и управление безналичными поступлениями от продаж
                </p>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <Card title="Общая статистика" className="summary-card">
                    <div className="summary-stats">
                        <div className="stat-item">
                            <span className="stat-label">Всего безналичных продаж:</span>
                            <span className="stat-value positive">
                                {formatCurrency(summary?.totalNonCashSales || 0)}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Снято средств:</span>
                            <span className="stat-value negative">
                                {formatCurrency(summary?.totalWithdrawals || 0)}
                            </span>
                        </div>
                        <div className="stat-item current-total">
                            <span className="stat-label">Текущий остаток:</span>
                            <span className={`stat-value ${(summary?.currentTotal || 0) >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(summary?.currentTotal || 0)}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card title="Действия" className="actions-card">
                    <div className="action-buttons">
                        <Button 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            variant="primary"
                            disabled={(summary?.currentTotal || 0) <= 0}
                        >
                            Снять средства
                        </Button>
                        <Button 
                            onClick={fetchData}
                            variant="secondary"
                        >
                            Обновить данные
                        </Button>
                    </div>
                    {(summary?.currentTotal || 0) <= 0 && (
                        <p className="no-funds-message">
                            Нет доступных средств для снятия
                        </p>
                    )}
                </Card>
            </div>

            {/* Records Table */}
            <Card title="История операций">
                {records.length > 0 ? (
                    <>
                        <div className="table-container">
                            <table className="records-table">
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Тип операции</th>
                                        <th>Описание</th>
                                        <th>Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((record) => (
                                        <tr key={`${record.type}-${record._id}`}>
                                            <td className="date-cell">
                                                {formatDate(record.date)}
                                            </td>
                                            <td className="type-cell">
                                                <span className={`operation-type ${record.type}`}>
                                                    {record.type === 'income' ? 'Поступление' : 'Снятие'}
                                                </span>
                                            </td>
                                            <td className="description-cell">
                                                {record.description}
                                                {record.notes && (
                                                    <div className="notes">
                                                        {record.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`amount-cell ${record.amount >= 0 ? 'positive' : 'negative'}`}>
                                                {record.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(record.amount))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalItems={records.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </>
                ) : (
                    <div className="no-records">
                        <p>Нет записей о безналичных операциях</p>
                        <p>Записи появятся после добавления продаж или снятия средств.</p>
                    </div>
                )}
            </Card>

            {/* Withdraw Modal */}
            <WithdrawNonCashModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                availableAmount={summary?.currentTotal || 0}
                onSuccess={handleWithdrawSuccess}
            />
        </div>
    );
};

export default NonCashPage;