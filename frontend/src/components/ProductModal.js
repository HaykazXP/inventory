import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const ProductModal = ({ isOpen, onClose, onSuccess, product = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (isEditing && product) {
                setFormData({
                    name: product.name,
                    price: product.price.toString()
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, isEditing, product]);

    const resetForm = () => {
        setFormData({
            name: '',
            price: ''
        });
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                name: formData.name.trim(),
                price: parseFloat(formData.price)
            };

            // Basic validation
            if (!dataToSubmit.name) {
                throw new Error('Название товара обязательно');
            }

            if (isNaN(dataToSubmit.price) || dataToSubmit.price < 0) {
                throw new Error('Цена должна быть положительным числом');
            }

            await onSuccess(dataToSubmit);
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={isEditing ? 'Редактировать товар' : 'Добавить новый товар'}
        >
            <form onSubmit={handleSubmit} className="modal-form">
                {error && (
                    <div style={{ 
                        color: '#dc3545', 
                        marginBottom: '1rem', 
                        padding: '0.5rem', 
                        backgroundColor: '#f8d7da', 
                        border: '1px solid #f5c6cb', 
                        borderRadius: '4px' 
                    }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="name">Название товара</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Введите название товара"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Цена (руб.)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Введите цену"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={loading || !formData.name.trim() || !formData.price}
                    >
                        {loading 
                            ? (isEditing ? 'Сохранение...' : 'Добавление...') 
                            : (isEditing ? 'Сохранить' : 'Добавить')
                        }
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductModal;