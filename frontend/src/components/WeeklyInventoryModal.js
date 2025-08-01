import React, { useState, useEffect, useCallback } from 'react';
import { getWeeklyInventoryData, submitWeeklyInventoryCheck } from '../services/api';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import './WeeklyInventoryModal.css';

const WeeklyInventoryModal = ({ isOpen, onClose, sellingPointId, sellingPointName, onSuccess }) => {
    const [inventoryData, setInventoryData] = useState(null);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Generate storage key for this selling point
    const storageKey = `weekly-inventory-${sellingPointId}`;

    // Load saved data from localStorage
    const loadSavedData = useCallback(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsedData = JSON.parse(saved);
                setCounts(parsedData);
            }
        } catch (error) {
            console.error('Error loading saved inventory data:', error);
        }
    }, [storageKey]);

    // Save data to localStorage
    const saveToStorage = useCallback((data) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving inventory data:', error);
        }
    }, [storageKey]);

    // Clear saved data from localStorage
    const clearSavedData = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error clearing saved inventory data:', error);
        }
    }, [storageKey]);

    // Fetch inventory data when modal opens
    useEffect(() => {
        const fetchInventoryData = async () => {
            if (isOpen && sellingPointId) {
                setLoading(true);
                setError('');
                try {
                    const { data } = await getWeeklyInventoryData(sellingPointId);
                    setInventoryData(data);

                    // Initialize counts with current quantities if no saved data
                    const savedCounts = {};
                    try {
                        const saved = localStorage.getItem(storageKey);
                        if (saved) {
                            Object.assign(savedCounts, JSON.parse(saved));
                        }
                    } catch (e) {
                        console.error('Error loading saved data:', e);
                    }

                    // Initialize counts for products not in saved data
                    const initialCounts = {};
                    data.inventory.forEach(item => {
                        if (savedCounts.hasOwnProperty(item.productId)) {
                            initialCounts[item.productId] = savedCounts[item.productId];
                        } else {
                            initialCounts[item.productId] = item.currentQuantity;
                        }
                    });
                    
                    setCounts(initialCounts);
                } catch (error) {
                    setError('Ошибка при загрузке данных инвентаря');
                    console.error('Error fetching inventory data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchInventoryData();
    }, [isOpen, sellingPointId, storageKey]);

    // Save counts to localStorage whenever they change
    useEffect(() => {
        if (Object.keys(counts).length > 0) {
            saveToStorage(counts);
        }
    }, [counts, saveToStorage]);

    const handleCountChange = (productId, value) => {
        const numValue = value === '' ? '' : parseInt(value) || 0;
        setCounts(prev => ({
            ...prev,
            [productId]: numValue
        }));
    };

    const formatCurrency = (amount) => {
        return `${amount.toLocaleString('ru-RU')} руб.`;
    };

    // Calculate differences and totals
    const calculateTotals = () => {
        if (!inventoryData) return { totalDifference: 0, totalDifferenceAmount: 0 };

        let totalDifferenceAmount = 0;

        inventoryData.inventory.forEach(item => {
            const newCount = counts[item.productId] || 0;
            const difference = newCount - item.currentQuantity;
            const differenceAmount = difference * item.productPrice;
            totalDifferenceAmount += differenceAmount;
        });

        return { totalDifferenceAmount };
    };

    const { totalDifferenceAmount } = calculateTotals();
    
    // Calculate discrepancy (sales total vs inventory difference)
    const salesTotal = inventoryData ? inventoryData.weekSalesTotal : 0;
    const discrepancy = salesTotal + totalDifferenceAmount; // Should be 0 if everything matches
    
    const getDiscrepancyText = () => {
        if (Math.abs(discrepancy) < 0.01) return null;
        
        if (discrepancy > 0) {
            return `Излишек: ${formatCurrency(discrepancy)}`;
        } else {
            return `Недостача: ${formatCurrency(Math.abs(discrepancy))}`;
        }
    };

    const handleSubmit = async () => {
        if (!inventoryData) return;

        setSubmitting(true);
        setError('');

        try {
            const inventoryItems = inventoryData.inventory.map(item => ({
                productId: item.productId,
                currentQuantity: counts[item.productId] || 0
            }));

            await submitWeeklyInventoryCheck({
                sellingPointId,
                date: new Date().toISOString(),
                inventoryItems,
                notes: ''
            });

            // Clear saved data after successful submission
            clearSavedData();
            
            onSuccess();
            onClose();
        } catch (error) {
            setError('Ошибка при сохранении инвентаризации');
            console.error('Error submitting inventory check:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        if (inventoryData) {
            const initialCounts = {};
            inventoryData.inventory.forEach(item => {
                initialCounts[item.productId] = item.currentQuantity;
            });
            setCounts(initialCounts);
            clearSavedData();
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Инвентаризация: ${sellingPointName}`}>
            <div className="weekly-inventory-modal">
                {loading ? (
                    <div className="loading">Загрузка данных...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : inventoryData ? (
                    <>
                        {/* Summary Section - Fixed at top */}
                        <div className="inventory-summary">
                            <div className="summary-row">
                                <span className="summary-label">Итого изменение по сумме:</span>
                                <span className={`summary-value ${totalDifferenceAmount >= 0 ? 'positive' : 'negative'}`}>
                                    {totalDifferenceAmount >= 0 ? '+' : ''}{formatCurrency(totalDifferenceAmount)}
                                </span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Продажи за период:</span>
                                <span className="summary-value positive">
                                    +{formatCurrency(salesTotal)}
                                </span>
                            </div>
                            {getDiscrepancyText() && (
                                <div className="summary-row discrepancy">
                                    <span className="summary-label">
                                        {getDiscrepancyText()}
                                    </span>
                                </div>
                            )}
                            <div className="summary-actions">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleClear}
                                    disabled={submitting}
                                >
                                    Очистить
                                </Button>
                            </div>
                        </div>

                        {/* Inventory List - Scrollable */}
                        <div className="inventory-list">
                            {inventoryData.inventory.length > 0 ? (
                                inventoryData.inventory.map(item => {
                                    const newCount = counts[item.productId] || 0;
                                    const difference = newCount - item.currentQuantity;
                                    const differenceAmount = difference * item.productPrice;

                                    return (
                                        <div key={item.productId} className="inventory-item">
                                            <div className="item-info">
                                                <div className="product-name">{item.productName}</div>
                                                <div className="current-quantity">
                                                    Сейчас: {item.currentQuantity} шт.
                                                </div>
                                            </div>
                                            <div className="item-controls">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={counts[item.productId] || ''}
                                                    onChange={(e) => handleCountChange(item.productId, e.target.value)}
                                                    placeholder="Новое количество"
                                                />
                                                <div className="difference-display">
                                                    <div className={`quantity-diff ${difference >= 0 ? 'positive' : 'negative'}`}>
                                                        {difference >= 0 ? '+' : ''}{difference} шт.
                                                    </div>
                                                    <div className={`amount-diff ${differenceAmount >= 0 ? 'positive' : 'negative'}`}>
                                                        {differenceAmount >= 0 ? '+' : ''}{formatCurrency(differenceAmount)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-inventory">
                                    В данной точке продаж нет товаров для инвентаризации
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="modal-actions">
                            <Button 
                                variant="secondary" 
                                onClick={handleClose}
                                disabled={submitting}
                            >
                                Отмена
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleSubmit}
                                disabled={submitting || inventoryData.inventory.length === 0}
                            >
                                {submitting ? 'Сохранение...' : 'Сохранить инвентаризацию'}
                            </Button>
                        </div>
                    </>
                ) : null}
            </div>
        </Modal>
    );
};

export default WeeklyInventoryModal;