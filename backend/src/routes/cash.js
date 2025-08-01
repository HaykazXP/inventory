const express = require('express');
const router = express.Router();
const SellingPoint = require('../models/SellingPoint');
const Sales = require('../models/Sales');
const CashWithdrawal = require('../models/CashWithdrawal');
const auth = require('../middleware/auth');

// @route   GET api/cash/summary
// @desc    Get cash summary and totals
// @access  Private
router.get('/summary', auth, async (req, res) => {
    try {
        // Get all selling points with their current cash
        const sellingPoints = await SellingPoint.find({}, 'name cash');
        
        // Get total cash sales from all selling points
        const totalCashSales = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    totalCash: { $sum: '$cashSales' }
                }
            }
        ]);

        // Get total withdrawals
        const totalWithdrawals = await CashWithdrawal.aggregate([
            {
                $group: {
                    _id: null,
                    totalWithdrawals: { $sum: '$amount' }
                }
            }
        ]);

        const cashSalesTotal = totalCashSales.length > 0 ? totalCashSales[0].totalCash : 0;
        const withdrawalsTotal = totalWithdrawals.length > 0 ? totalWithdrawals[0].totalWithdrawals : 0;
        const totalCurrentCash = sellingPoints.reduce((sum, sp) => sum + sp.cash, 0);

        res.json({
            sellingPoints: sellingPoints,
            totalCashSales: cashSalesTotal,
            totalWithdrawals: withdrawalsTotal,
            totalCurrentCash: totalCurrentCash
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cash/records
// @desc    Get all cash records (sales and withdrawals)
// @access  Private
router.get('/records', auth, async (req, res) => {
    try {
        // Get all cash sales
        const cashSales = await Sales.find({ cashSales: { $gt: 0 } })
            .populate('sellingPointId', 'name')
            .sort({ date: -1 });

        // Get all withdrawals
        const withdrawals = await CashWithdrawal.find()
            .populate('sellingPointId', 'name')
            .sort({ date: -1 });

        // Combine and format records
        const salesRecords = cashSales.map(sale => ({
            _id: sale._id,
            type: 'income',
            date: sale.date,
            amount: sale.cashSales,
            description: `Наличная продажа - ${sale.sellingPointId.name}`,
            sellingPointId: sale.sellingPointId._id,
            sellingPointName: sale.sellingPointId.name,
            createdAt: sale.createdAt
        }));

        const withdrawalRecords = withdrawals.map(withdrawal => ({
            _id: withdrawal._id,
            type: 'withdrawal',
            date: withdrawal.date,
            amount: -withdrawal.amount, // Negative for withdrawals
            description: withdrawal.description,
            notes: withdrawal.notes,
            sellingPointId: withdrawal.sellingPointId._id,
            sellingPointName: withdrawal.sellingPointId.name,
            createdAt: withdrawal.createdAt
        }));

        // Combine and sort by date
        const allRecords = [...salesRecords, ...withdrawalRecords]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(allRecords);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/cash/withdraw/:sellingPointId
// @desc    Create a cash withdrawal from specific selling point
// @access  Private
router.post('/withdraw/:sellingPointId', auth, async (req, res) => {
    const { sellingPointId } = req.params;
    const { amount, notes } = req.body;

    try {
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: 'Сумма должна быть больше нуля' });
        }

        // Get selling point
        const sellingPoint = await SellingPoint.findById(sellingPointId);
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Точка продаж не найдена' });
        }

        // Check if there are sufficient cash funds
        if (amount > sellingPoint.cash) {
            return res.status(400).json({ 
                msg: `Недостаточно средств. Доступно: ${sellingPoint.cash.toFixed(2)} руб.` 
            });
        }

        // Create withdrawal record
        const newWithdrawal = new CashWithdrawal({
            sellingPointId: sellingPointId,
            amount: parseFloat(amount),
            description: `Снятие наличных - ${sellingPoint.name}`,
            notes: notes || ''
        });

        const withdrawal = await newWithdrawal.save();

        // Update selling point cash
        sellingPoint.cash -= parseFloat(amount);
        await sellingPoint.save();

        // Populate the response
        const populatedWithdrawal = await CashWithdrawal.findById(withdrawal._id)
            .populate('sellingPointId', 'name cash');

        res.json(populatedWithdrawal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cash/withdrawals
// @desc    Get all cash withdrawals
// @access  Private
router.get('/withdrawals', auth, async (req, res) => {
    try {
        const withdrawals = await CashWithdrawal.find()
            .populate('sellingPointId', 'name')
            .sort({ date: -1 });
        res.json(withdrawals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/cash/selling-point/:id
// @desc    Get cash records for specific selling point
// @access  Private
router.get('/selling-point/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get selling point
        const sellingPoint = await SellingPoint.findById(id, 'name cash');
        if (!sellingPoint) {
            return res.status(404).json({ msg: 'Точка продаж не найдена' });
        }

        // Get cash sales for this selling point
        const cashSales = await Sales.find({ 
            sellingPointId: id,
            cashSales: { $gt: 0 } 
        }).sort({ date: -1 });

        // Get withdrawals for this selling point
        const withdrawals = await CashWithdrawal.find({ sellingPointId: id })
            .sort({ date: -1 });

        // Calculate totals
        const totalCashSales = cashSales.reduce((sum, sale) => sum + sale.cashSales, 0);
        const totalWithdrawals = withdrawals.reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

        res.json({
            sellingPoint,
            totalCashSales,
            totalWithdrawals,
            currentCash: sellingPoint.cash,
            cashSales,
            withdrawals
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;