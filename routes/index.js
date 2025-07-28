const express = require('express');
const { healthCheck, getRoot } = require('../controllers/appController');
const { login } = require('../controllers/authController');
const productRoutes = require('./productRoutes');

const router = express.Router();

router.get('/', healthCheck);
router.get('/api', getRoot);
router.post('/login', login);
router.use('/', productRoutes);

module.exports = router; 