import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getProducts, addProductToSellingPoint } from '../services/api';

const AddStockReplenishmentModal = ({ isOpen, onClose, sellingPointId, sellingPointName, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            resetForm();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const { data } = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Ошибка загрузки товаров');
        }
    };

    const resetForm = () => {
        setSelectedProduct('');
        setQuantity(1);
        setNotes('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await addProductToSellingPoint({
                sellingPointId,
                productId: selectedProduct,
                quantity,
                notes
            });
            
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || 'Ошибка при добавлении закупки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Добавить закупку в "${sellingPointName}"`}
        >
            <form onSubmit={handleSubmit} className="modal-form">
                {error && (
                    <div style={{ color: '#dc3545', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="product">Товар</label>
                    <select
                        id="product"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="form-input"
                        required
                    >
                        <option value="">Выберите товар</option>
                        {products.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.name} - {product.price} руб.
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Количество</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="form-input"
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Примечания (необязательно)</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="form-input"
                        rows="3"
                        placeholder="Дополнительная информация..."
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
                        disabled={loading || !selectedProduct}
                    >
                        {loading ? 'Добавление...' : 'Добавить закупку'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStockReplenishmentModal;