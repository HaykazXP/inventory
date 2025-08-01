const express = require('express');
const router = express.Router();
const SellingPoint = require('../models/SellingPoint');
const Product = require('../models/Product');
const StockReplenishment = require('../models/StockReplenishment');
const auth = require('../middleware/auth');

// @route   GET api/inventory
// @desc    Get all inventory
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sellingPoints = await SellingPoint.find().populate('inventory.productId', 'name price');
        res.json(sellingPoints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inventory/:id
// @desc    Get inventory for a selling point
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const sellingPoint = await SellingPoint.findById(req.params.id).populate('inventory.productId', 'name price');
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Selling point not found' });
        }
        res.json(sellingPoint.inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/inventory/replenish
// @desc    Replenish stock for a selling point
// @access  Private
router.post('/replenish', auth, async (req, res) => {
    const { sellingPointId, productId, quantity, notes } = req.body;

    try {
        const sellingPoint = await SellingPoint.findById(sellingPointId);
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Selling point not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Update inventory in SellingPoint
        const itemIndex = sellingPoint.inventory.findIndex(p => p.productId.toString() === productId);
        if (itemIndex > -1) {
            sellingPoint.inventory[itemIndex].quantity += quantity;
            sellingPoint.inventory[itemIndex].lastUpdated = Date.now();
        } else {
            sellingPoint.inventory.push({ productId, quantity, lastUpdated: Date.now() });
        }
        
        let totalValue = 0;
        for (const item of sellingPoint.inventory) {
            const p = await Product.findById(item.productId);
            if (p) {
                totalValue += item.quantity * p.price;
            }
        }
        sellingPoint.inventoryTotalValue = totalValue;

        await sellingPoint.save();
        
        // Create a record in stock replenishment history
        const newReplenishment = new StockReplenishment({
            sellingPointId,
            productId,
            quantity,
            notes
        });

        const replenishment = await newReplenishment.save();
        res.json(replenishment);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inventory/history
// @desc    Get stock replenishment history
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const history = await StockReplenishment.find()
            .populate('sellingPointId', 'name')
            .populate('productId', 'name')
            .sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
