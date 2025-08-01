import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import Card from '../components/Card';
import './Page.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await getProducts();
        setProducts(data);
    };

    return (
        <div>
            <h1>Товары</h1>
            <Card title="Список товаров">
                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Название товара</th>
                                <th>Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td style={{ textAlign: 'left' }}>{product.name}</td>
                                    <td style={{ textAlign: 'center' }}>{product.price} руб.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ProductsPage;


