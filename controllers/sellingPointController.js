const SellingPoint = require('../models/SellingPoint');

// Get all selling points
const getAllSellingPoints = async (req, res) => {
  try {
    const sellingPoints = await SellingPoint.find().sort({ name: 1 });
    res.status(200).json(sellingPoints);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching selling points', message: error.message });
  }
};

// Get single selling point
const getSellingPoint = async (req, res) => {
  try {
    const sellingPoint = await SellingPoint.findById(req.params.id);
    if (!sellingPoint) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    res.status(200).json(sellingPoint);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching selling point', message: error.message });
  }
};

// Create selling point
const createSellingPoint = async (req, res) => {
  try {
    const sellingPoint = new SellingPoint(req.body);
    const savedSellingPoint = await sellingPoint.save();
    res.status(201).json(savedSellingPoint);
  } catch (error) {
    res.status(400).json({ error: 'Error creating selling point', message: error.message });
  }
};

// Update selling point
const updateSellingPoint = async (req, res) => {
  try {
    const sellingPoint = await SellingPoint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sellingPoint) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    res.status(200).json(sellingPoint);
  } catch (error) {
    res.status(400).json({ error: 'Error updating selling point', message: error.message });
  }
};

// Delete selling point
const deleteSellingPoint = async (req, res) => {
  try {
    const sellingPoint = await SellingPoint.findByIdAndDelete(req.params.id);
    if (!sellingPoint) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    res.status(200).json({ message: 'Selling point deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting selling point', message: error.message });
  }
};

module.exports = {
  getAllSellingPoints,
  getSellingPoint,
  createSellingPoint,
  updateSellingPoint,
  deleteSellingPoint
}; 