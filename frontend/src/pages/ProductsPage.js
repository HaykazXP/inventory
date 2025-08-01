import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ProductModal from '../components/ProductModal';
import ConfirmationModal from '../components/ConfirmationModal';
import './Page.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Modal states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Ошибка при загрузке товаров');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setIsEditing(false);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setIsConfirmModalOpen(true);
    };

    const handleProductSubmit = async (productData) => {
        try {
            if (isEditing) {
                const { data } = await updateProduct(selectedProduct._id, productData);
                setProducts(prev => prev.map(p => p._id === selectedProduct._id ? data : p));
            } else {
                const { data } = await createProduct(productData);
                setProducts(prev => [...prev, data]);
            }
        } catch (err) {
            throw err; // Re-throw to be handled by the modal
        }
    };

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await deleteProduct(selectedProduct._id);
            setProducts(prev => prev.filter(p => p._id !== selectedProduct._id));
            setIsConfirmModalOpen(false);
            setSelectedProduct(null);
        } catch (err) {
            setError('Ошибка при удалении товара');
            console.error(err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeModals = () => {
        setIsProductModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedProduct(null);
        setIsEditing(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Товары</h1>
                <Button onClick={handleCreateProduct}>
                    Добавить товар
                </Button>
            </div>

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

            <Card title="Список товаров">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Загрузка...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        Товары не найдены. Добавьте первый товар.
                    </div>
                ) : (
                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Название товара</th>
                                    <th>Цена</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td style={{ textAlign: 'left' }}>{product.name}</td>
                                        <td style={{ textAlign: 'center' }}>{product.price} руб.</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.8rem',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Изменить
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.8rem',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={closeModals}
                onSuccess={handleProductSubmit}
                product={selectedProduct}
                isEditing={isEditing}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={closeModals}
                onConfirm={confirmDelete}
                title="Удаление товара"
                message={`Вы уверены, что хотите удалить товар "${selectedProduct?.name}"? Это действие нельзя отменить.`}
                confirmText="Удалить"
                loading={deleteLoading}
            />
        </div>
    );
};

export default ProductsPage;


