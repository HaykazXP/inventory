const express = require('express');
const { healthCheck, getRoot } = require('./controllers/appController');
const { login } = require('./controllers/authController');

const router = express.Router();

router.get('/', healthCheck);
router.get('/api', getRoot);
router.post('/login', login);

module.exports = router; 