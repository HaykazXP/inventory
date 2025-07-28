const express = require('express');
const { 
  getAllSellingPoints, 
  getSellingPoint, 
  createSellingPoint, 
  updateSellingPoint, 
  deleteSellingPoint 
} = require('../controllers/sellingPointController');

const router = express.Router();

// Selling point routes
router.get('/selling-points', getAllSellingPoints);
router.get('/selling-points/:id', getSellingPoint);
router.post('/selling-points', createSellingPoint);
router.put('/selling-points/:id', updateSellingPoint);
router.delete('/selling-points/:id', deleteSellingPoint);

module.exports = router; 