const express = require('express');
const router = express.Router();
const WeeklyInventory = require('../models/WeeklyInventory');
const SellingPoint = require('../models/SellingPoint');
const Product = require('../models/Product');
const Sales = require('../models/Sales');
const auth = require('../middleware/auth');

// @route   GET api/weekly-inventory/data/:sellingPointId
// @desc    Get selling point inventory data for weekly check
// @access  Private
router.get('/data/:sellingPointId', auth, async (req, res) => {
    try {
        const sellingPoint = await SellingPoint.findById(req.params.sellingPointId)
            .populate('inventory.productId', 'name price');
        
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Selling point not found' });
        }

        // Get the last weekly inventory date for this selling point
        const lastWeeklyCheck = await WeeklyInventory.findOne({
            sellingPointId: req.params.sellingPointId
        }).sort({ date: -1 });

        const lastCheckDate = lastWeeklyCheck ? lastWeeklyCheck.date : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Calculate sales total from last check to today
        const salesData = await Sales.find({
            sellingPointId: req.params.sellingPointId,
            date: { $gte: lastCheckDate, $lte: new Date() }
        });

        const weekSalesTotal = salesData.reduce((acc, sale) => acc + sale.totalSales, 0);

        // Prepare inventory data
        const inventoryData = sellingPoint.inventory.map(item => ({
            _id: item._id,
            productId: item.productId._id,
            productName: item.productId.name,
            productPrice: item.productId.price,
            currentQuantity: item.quantity,
            lastUpdated: item.lastUpdated
        }));

        res.json({
            sellingPoint: {
                _id: sellingPoint._id,
                name: sellingPoint.name
            },
            inventory: inventoryData,
            weekSalesTotal,
            lastCheckDate: lastCheckDate
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/weekly-inventory/check
// @desc    Perform a weekly inventory check
// @access  Private
router.post('/check', auth, async (req, res) => {
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

// @route   GET api/weekly-inventory/checks
// @desc    Get all weekly inventory checks
// @access  Public
router.get('/checks', async (req, res) => {
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

// @route   GET api/weekly-inventory/discrepancies
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
