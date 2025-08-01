import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import './Page.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await getProducts();
        setProducts(data);
    };

    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    return (
        <div>
            <h1>Товары</h1>
            <Card title="Список товаров">
                <ul className="list">
                    {getPaginatedProducts().map((product) => (
                        <li key={product._id} className="list-item">
                            <span>{product.name} - {product.price} руб.</span>
                        </li>
                    ))}
                </ul>
                
                {products.length > 10 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={products.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </Card>
        </div>
    );
};

export default ProductsPage;


