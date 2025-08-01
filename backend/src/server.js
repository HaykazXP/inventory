require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Define Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/selling-points', require('./routes/sellingPoints'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/weekly-inventory', require('./routes/weeklyInventory'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Inventory Management System API');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
