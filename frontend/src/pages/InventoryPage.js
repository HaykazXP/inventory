import React, { useState, useEffect } from 'react';
import { getInventory, getProducts, getSellingPoints, addProductToSellingPoint, updateInventoryCount, removeProductFromSellingPoint } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import './Page.css';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [sellingPoints, setSellingPoints] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSellingPoint, setSelectedSellingPoint] = useState('');
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        fetchInventory();
        fetchProducts();
        fetchSellingPoints();
    }, []);

    const fetchInventory = async () => {
    const { data } = await getInventory();
    const flattenedInventory = data.flatMap(sp => 
        sp.inventory.map(item => ({
            ...item,
            sellingPointName: sp.name
        }))
    );
    setInventory(flattenedInventory);
};

    const fetchProducts = async () => {
        const { data } = await getProducts();
        setProducts(data);
    };

    const fetchSellingPoints = async () => {
        const { data } = await getSellingPoints();
        setSellingPoints(data);
    };

    const handleAddProduct = async (e) => {
    e.preventDefault();
    await addProductToSellingPoint({
        productId: selectedProduct,
        sellingPointId: selectedSellingPoint,
        quantity,
    });
    fetchInventory();
};

    const handleUpdateCount = async (id, newCount) => {
        await updateInventoryCount(id, newCount);
        fetchInventory();
    };
    
    const handleRemove = async (id) => {
        await removeProductFromSellingPoint(id);
        fetchInventory();
    }

    return (
        <div>
            <h1>Inventory</h1>
            <Card title="Add Product to Selling Point">
                <form onSubmit={handleAddProduct} className="form-inline">
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required className="form-input">
                        <option value="">Select Product</option>
                        {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <select value={selectedSellingPoint} onChange={(e) => setSelectedSellingPoint(e.target.value)} required className="form-input">
                        <option value="">Select Selling Point</option>
                        {sellingPoints.map(sp => <option key={sp._id} value={sp._id}>{sp.name}</option>)}
                    </select>
                    <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    className="form-input"
/>
                    <Button type="submit">Add</Button>
                </form>
            </Card>

            <Card title="Current Inventory">
                <ul className="list">
                    {inventory.map(item => (
                        <li key={item._id} className="list-item">
                            <span>{item.productId.name} at {item.sellingPointName}</span>
                            <div>
                                <input 
                                    type="number" 
                                    defaultValue={item.quantity} 
                                    onBlur={(e) => handleUpdateCount(item._id, Number(e.target.value))}
                                    className="form-input"
                                />
                                <Button onClick={() => handleRemove(item._id)} variant="danger">Remove</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default InventoryPage;

