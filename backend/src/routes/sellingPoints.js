const express = require('express');
const router = express.Router();
const SellingPoint = require('../models/SellingPoint');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET api/selling-points
// @desc    Get all selling points
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

// @route   GET api/selling-points/:id/inventory
// @desc    Get inventory for a specific selling point
// @access  Public
router.get('/:id/inventory', async (req, res) => {
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

// @route   PUT api/selling-points/:id/inventory
// @desc    Update inventory for a selling point (stock replenishment)
// @access  Private
router.put('/:id/inventory', auth, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const sellingPoint = await SellingPoint.findById(req.params.id);
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Selling point not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const itemIndex = sellingPoint.inventory.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            sellingPoint.inventory[itemIndex].quantity += quantity;
            sellingPoint.inventory[itemIndex].lastUpdated = Date.now();
        } else {
            sellingPoint.inventory.push({ productId, quantity, lastUpdated: Date.now() });
        }
        
        // Recalculate inventoryTotalValue
        let totalValue = 0;
        for (const item of sellingPoint.inventory) {
            const p = await Product.findById(item.productId);
            if (p) {
                totalValue += item.quantity * p.price;
            }
        }
        sellingPoint.inventoryTotalValue = totalValue;

        await sellingPoint.save();
        res.json(sellingPoint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
