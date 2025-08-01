const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');
const auth = require('../middleware/auth');

// @route   POST api/sales
// @desc    Add a sales record
// @access  Private
router.post('/', auth, async (req, res) => {
    const { sellingPointId, date, cashSales, nonCashSales } = req.body;

    try {
        const newSales = new Sales({
            sellingPointId,
            date,
            cashSales,
            nonCashSales,
        });

        const sales = await newSales.save();
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales
// @desc    Get all sales records
// @access  Public
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.find()
            .populate('sellingPointId', 'name')
            .sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales/daily/:date
// @desc    Get sales for a specific day
// @access  Public
router.get('/daily/:date', async (req, res) => {
    try {
        const startOfDay = new Date(req.params.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(req.params.date);
        endOfDay.setHours(23, 59, 59, 999);

        const sales = await Sales.find({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).populate('sellingPointId', 'name');

        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/sales/weekly/:startDate/:endDate
// @desc    Get sales for a week
// @access  Public
router.get('/weekly/:startDate/:endDate', async (req, res) => {
    try {
        const sales = await Sales.find({
            date: {
                $gte: new Date(req.params.startDate),
                $lte: new Date(req.params.endDate)
            }
        }).populate('sellingPointId', 'name');
        
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
