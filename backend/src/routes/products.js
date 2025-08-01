const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Create a new product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ msg: 'Название и цена товара обязательны' });
    }

    if (price < 0) {
      return res.status(400).json({ msg: 'Цена не может быть отрицательной' });
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct) {
      return res.status(400).json({ msg: 'Товар с таким названием уже существует' });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price)
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({ msg: 'Название и цена товара обязательны' });
    }

    if (price < 0) {
      return res.status(400).json({ msg: 'Цена не может быть отрицательной' });
    }

    // Check if product exists
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Товар не найден' });
    }

    // Check if another product with same name already exists (excluding current product)
    const existingProduct = await Product.findOne({ 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingProduct) {
      return res.status(400).json({ msg: 'Товар с таким названием уже существует' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name: name.trim(), price: Number(price) },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Товар не найден' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Товар не найден' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Товар удален' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Товар не найден' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
