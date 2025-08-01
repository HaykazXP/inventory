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
    <ul className="list">
        {products.map((product) => (
            <li key={product._id} className="list-item">
                <span>{product.name} - {product.price} руб.</span>
            </li>
        ))}
    </ul>
</Card>
        </div>
    );
};

export default ProductsPage;


