const mongoose = require('mongoose');
const SellingPoint = require('../models/SellingPoint');

const sellingPoints = [
  { name: 'Сокол', cash: 15000 },
  { name: 'Михалково', cash: 12500 },
  { name: 'Коптевский бульвар', cash: 18750 },
  { name: 'Тимирязевская', cash: 21000 },
  { name: 'Флотская', cash: 16800 },
  { name: 'Димитровское', cash: 14200 },
];

const seedSellingPoints = async () => {
  try {
    await mongoose.connect(process.argv[2], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await SellingPoint.deleteMany({});
    console.log('Selling points cleared');

    await SellingPoint.insertMany(sellingPoints);
    console.log('Selling points seeded');

    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSellingPoints();
