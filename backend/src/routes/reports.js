const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');
const Product = require('../models/Product');
const WeeklyInventory = require('../models/WeeklyInventory');

// @route   GET api/reports/financial
// @desc    Get financial report
// @access  Public
router.get('/financial', async (req, res) => {
    try {
        const { startDate, endDate, sellingPointId } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (sellingPointId) {
            query.sellingPointId = sellingPointId;
        }

        const sales = await Sales.find(query).populate('sellingPointId', 'name');
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/products
// @desc    Get product performance report
// @access  Public
router.get('/products', async (req, res) => {
    try {
        // This is a simplified report. A more advanced one might aggregate sales data.
        const products = await Product.find();
        const weeklyChecks = await WeeklyInventory.find().populate('inventoryItems.productId');

        let productSales = {};

        weeklyChecks.forEach(check => {
            check.inventoryItems.forEach(item => {
                if (item.productId) {
                    const productId = item.productId._id.toString();
                    if (!productSales[productId]) {
                        productSales[productId] = {
                            name: item.productId.name,
                            soldQuantity: 0,
                            soldValue: 0
                        };
                    }
                    productSales[productId].soldQuantity += item.soldQuantity;
                    productSales[productId].soldValue += item.soldValue;
                }
            });
        });

        res.json(Object.values(productSales).sort((a,b) => b.soldQuantity - a.soldQuantity));

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/selling-points
// @desc    Get selling points performance report
// @access  Public
router.get('/selling-points', async (req, res) => {
    try {
        const salesByPoint = await Sales.aggregate([
            {
                $group: {
                    _id: '$sellingPointId',
                    totalSales: { $sum: '$totalSales' },
                    totalCashSales: { $sum: '$cashSales' },
                    totalNonCashSales: { $sum: '$nonCashSales' }
                }
            },
            {
                $lookup: {
                    from: 'sellingpoints',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'sellingPoint'
                }
            },
            {
                $unwind: '$sellingPoint'
            },
            {
                $project: {
                    _id: 0,
                    sellingPointName: '$sellingPoint.name',
                    totalSales: '$totalSales',
                    totalCashSales: '$totalCashSales',
                    totalNonCashSales: '$totalNonCashSales'
                }
            }
        ]);

        res.json(salesByPoint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
