const express = require('express');
const { healthCheck, getRoot } = require('../controllers/appController');
const { login } = require('../controllers/authController');
const productRoutes = require('./productRoutes');
const sellingPointRoutes = require('./sellingPointRoutes');

const router = express.Router();

router.get('/', healthCheck);
router.get('/api', getRoot);
router.post('/login', login);
router.use('/', productRoutes);
router.use('/', sellingPointRoutes);

module.exports = router; 