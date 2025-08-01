const express = require('express');
const router = express.Router();
const WeeklyInventory = require('../models/WeeklyInventory');
const SellingPoint = require('../models/SellingPoint');
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const auth = require('../middleware/auth');

// @route   POST api/inventory/weekly-check
// @desc    Perform a weekly inventory check
// @access  Private
router.post('/weekly-check', auth, async (req, res) => {
    const { sellingPointId, date, inventoryItems } = req.body;

    try {
        const sellingPoint = await SellingPoint.findById(sellingPointId).populate('inventory.productId');
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Selling point not found' });
        }
        
        let totalSoldValue = 0;
        let processedInventoryItems = [];

        for (const item of inventoryItems) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            const inventoryItem = sellingPoint.inventory.find(i => i.productId.id.toString() === item.productId);
            const previousQuantity = inventoryItem ? inventoryItem.quantity : 0;
            
            // This is a simplified calculation. A more accurate calculation would need to factor in replenishments during the week.
            const soldQuantity = previousQuantity - item.currentQuantity;
            const soldValue = soldQuantity * product.price;
            totalSoldValue += soldValue;
            
            processedInventoryItems.push({
                productId: item.productId,
                previousQuantity: previousQuantity,
                currentQuantity: item.currentQuantity,
                soldQuantity: soldQuantity,
                soldValue: soldValue
            });
            
            // Update the main inventory with the new current quantity
            if(inventoryItem) {
                inventoryItem.quantity = item.currentQuantity;
            }
        }

        // Get total sales for the week
        const weekStartDate = new Date(date);
        weekStartDate.setDate(weekStartDate.getDate() - 7);
        
        const salesData = await Sales.find({
            sellingPointId: sellingPointId,
            date: { $gte: weekStartDate, $lte: new Date(date) }
        });

        const weekSalesTotal = salesData.reduce((acc, sale) => acc + sale.totalSales, 0);

        const discrepancy = weekSalesTotal - totalSoldValue;
        const hasDiscrepancy = discrepancy !== 0;

        const newWeeklyCheck = new WeeklyInventory({
            sellingPointId,
            date,
            inventoryItems: processedInventoryItems,
            totalSoldValue,
            weekSalesTotal,
            discrepancy,
            hasDiscrepancy,
            notes: req.body.notes || ''
        });

        await newWeeklyCheck.save();
        
        // After check, update the SellingPoint's main inventory quantities and total value
        await sellingPoint.save();
        
        // Recalculate total inventory value
        let totalValue = 0;
        for (const item of sellingPoint.inventory) {
            const p = await Product.findById(item.productId);
            if (p) {
                totalValue += item.quantity * p.price;
            }
        }
        sellingPoint.inventoryTotalValue = totalValue;
        await sellingPoint.save();


        res.json(newWeeklyCheck);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inventory/weekly-checks
// @desc    Get all weekly inventory checks
// @access  Public
router.get('/weekly-checks', async (req, res) => {
    try {
        const checks = await WeeklyInventory.find()
            .populate('sellingPointId', 'name')
            .populate('inventoryItems.productId', 'name')
            .sort({ date: -1 });
        res.json(checks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inventory/discrepancies
// @desc    Get inventory checks with discrepancies
// @access  Public
router.get('/discrepancies', async (req, res) => {
    try {
        const discrepancies = await WeeklyInventory.find({ hasDiscrepancy: true })
            .populate('sellingPointId', 'name')
            .populate('inventoryItems.productId', 'name')
            .sort({ date: -1 });
        res.json(discrepancies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
