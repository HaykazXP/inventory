const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');
const NonCashWithdrawal = require('../models/NonCashWithdrawal');
const auth = require('../middleware/auth');

// @route   GET api/non-cash/summary
// @desc    Get non-cash summary and total
// @access  Private
router.get('/summary', auth, async (req, res) => {
    try {
        // Get total non-cash sales from all selling points
        const totalNonCashSales = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    totalNonCash: { $sum: '$nonCashSales' }
                }
            }
        ]);

        // Get total withdrawals
        const totalWithdrawals = await NonCashWithdrawal.aggregate([
            {
                $group: {
                    _id: null,
                    totalWithdrawals: { $sum: '$amount' }
                }
            }
        ]);

        const nonCashSalesTotal = totalNonCashSales.length > 0 ? totalNonCashSales[0].totalNonCash : 0;
        const withdrawalsTotal = totalWithdrawals.length > 0 ? totalWithdrawals[0].totalWithdrawals : 0;
        const currentTotal = nonCashSalesTotal - withdrawalsTotal;

        res.json({
            totalNonCashSales: nonCashSalesTotal,
            totalWithdrawals: withdrawalsTotal,
            currentTotal: currentTotal
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/non-cash/records
// @desc    Get all non-cash records (sales and withdrawals)
// @access  Private
router.get('/records', auth, async (req, res) => {
    try {
        // Get all non-cash sales
        const nonCashSales = await Sales.find({ nonCashSales: { $gt: 0 } })
            .populate('sellingPointId', 'name')
            .sort({ date: -1 });

        // Get all withdrawals
        const withdrawals = await NonCashWithdrawal.find()
            .sort({ date: -1 });

        // Combine and format records
        const salesRecords = nonCashSales.map(sale => ({
            _id: sale._id,
            type: 'income',
            date: sale.date,
            amount: sale.nonCashSales,
            description: `Безналичная продажа - ${sale.sellingPointId.name}`,
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

// @route   POST api/non-cash/withdraw
// @desc    Create a non-cash withdrawal
// @access  Private
router.post('/withdraw', auth, async (req, res) => {
    const { amount, description, notes } = req.body;

    try {
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: 'Сумма должна быть больше нуля' });
        }

        // Check if there are sufficient non-cash funds
        const totalNonCashSales = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    totalNonCash: { $sum: '$nonCashSales' }
                }
            }
        ]);

        const totalWithdrawals = await NonCashWithdrawal.aggregate([
            {
                $group: {
                    _id: null,
                    totalWithdrawals: { $sum: '$amount' }
                }
            }
        ]);

        const nonCashSalesTotal = totalNonCashSales.length > 0 ? totalNonCashSales[0].totalNonCash : 0;
        const withdrawalsTotal = totalWithdrawals.length > 0 ? totalWithdrawals[0].totalWithdrawals : 0;
        const availableFunds = nonCashSalesTotal - withdrawalsTotal;

        if (amount > availableFunds) {
            return res.status(400).json({ 
                msg: `Недостаточно средств. Доступно: ${availableFunds.toFixed(2)} руб.` 
            });
        }

        // Create withdrawal record
        const newWithdrawal = new NonCashWithdrawal({
            amount: parseFloat(amount),
            description: description || 'Снятие безналичных средств',
            notes: notes || ''
        });

        const withdrawal = await newWithdrawal.save();
        res.json(withdrawal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/non-cash/withdrawals
// @desc    Get all withdrawals
// @access  Private
router.get('/withdrawals', auth, async (req, res) => {
    try {
        const withdrawals = await NonCashWithdrawal.find()
            .sort({ date: -1 });
        res.json(withdrawals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;