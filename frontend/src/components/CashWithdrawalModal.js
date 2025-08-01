import React, { useState } from 'react';
import { createCashWithdrawal } from '../services/api';
import Modal from './Modal';
import Button from './Button';
import './CashWithdrawalModal.css';

const CashWithdrawalModal = ({ isOpen, onClose, sellingPoint, onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { amount, notes } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || parseFloat(amount) <= 0) {
            setError('Введите корректную сумму');
            return;
        }

        if (parseFloat(amount) > sellingPoint.cash) {
            setError(`Сумма не может превышать доступный остаток: ${sellingPoint.cash.toLocaleString('ru-RU')} руб.`);
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await createCashWithdrawal(sellingPoint._id, {
                amount: parseFloat(amount),
                notes: notes
            });

            // Reset form
            setFormData({
                amount: '',
                notes: ''
            });

            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Ошибка при снятии средств';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            setFormData({
                amount: '',
                notes: ''
            });
            setError('');
            onClose();
        }
    };

    const formatCurrency = (amount) => {
        return `${amount.toLocaleString('ru-RU')} руб.`;
    };

    if (!isOpen || !sellingPoint) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Снять наличные - ${sellingPoint.name}`}>
            <div className="cash-withdraw-modal">
                <div className="available-amount">
                    <span className="available-label">Доступно для снятия:</span>
                    <span className="available-value">{formatCurrency(sellingPoint.cash)}</span>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="withdraw-form">
                    <div className="form-group">
                        <label htmlFor="amount">Сумма для снятия *</label>
                        <input
                            id="amount"
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={handleChange}
                            placeholder="Введите сумму"
                            min="0.01"
                            max={sellingPoint.cash}
                            step="0.01"
                            required
                            disabled={submitting}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes">Примечания</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={notes}
                            onChange={handleChange}
                            placeholder="Дополнительная информация (необязательно)"
                            rows="3"
                            className="form-textarea"
                            disabled={submitting}
                        />
                    </div>

                    <div className="modal-actions">
                        <Button 
                            type="button"
                            variant="secondary" 
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            Отмена
                        </Button>
                        <Button 
                            type="submit"
                            variant="primary"
                            disabled={submitting || !amount || parseFloat(amount) <= 0}
                        >
                            {submitting ? 'Снятие...' : 'Снять средства'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CashWithdrawalModal;