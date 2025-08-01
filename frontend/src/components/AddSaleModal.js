import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { addSalesRecord } from '../services/api';

const AddSaleModal = ({ isOpen, onClose, sellingPointId, sellingPointName, onSuccess }) => {
    const [formData, setFormData] = useState({
        cashSales: '',
        nonCashSales: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const cashAmount = parseFloat(formData.cashSales) || 0;
            const nonCashAmount = parseFloat(formData.nonCashSales) || 0;
            
            if (cashAmount === 0 && nonCashAmount === 0) {
                setError('Необходимо указать сумму хотя бы одного вида продаж');
                setIsSubmitting(false);
                return;
            }

            if (cashAmount < 0 || nonCashAmount < 0) {
                setError('Суммы продаж не могут быть отрицательными');
                setIsSubmitting(false);
                return;
            }

            const salesData = {
                sellingPointId,
                date: new Date().toISOString(), // Use current date
                cashSales: cashAmount,
                nonCashSales: nonCashAmount
            };

            await addSalesRecord(salesData);
            
            // Reset form
            setFormData({
                cashSales: '',
                nonCashSales: ''
            });
            
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding sales record:', error);
            setError('Ошибка при добавлении записи о продажах');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Добавить продажи - ${sellingPointName}`}>
            <form onSubmit={handleSubmit} className="form">
                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}
                
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#495057'
                    }}>
                        Сумма продаж наличными (рублей)
                    </label>
                    <input
                        type="number"
                        name="cashSales"
                        value={formData.cashSales}
                        onChange={handleChange}
                        placeholder="Введите сумму наличных продаж"
                        min="0"
                        step="0.01"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '500',
                        color: '#495057'
                    }}>
                        Сумма безналичных продаж (рублей)
                    </label>
                    <input
                        type="number"
                        name="nonCashSales"
                        value={formData.nonCashSales}
                        onChange={handleChange}
                        placeholder="Введите сумму безналичных продаж"
                        min="0"
                        step="0.01"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
                    {isSubmitting ? 'Сохранение...' : 'Сохранить продажи'}
                </Button>
            </form>
        </Modal>
    );
};

export default AddSaleModal;