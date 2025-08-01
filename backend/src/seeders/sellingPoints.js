const mongoose = require('mongoose');
const SellingPoint = require('../models/SellingPoint');

const sellingPoints = [
  { name: 'Сокол' },
  { name: 'Михалково' },
  { name: 'Коптевский бульвар' },
  { name: 'Тимирязевская' },
  { name: 'Флотская' },
  { name: 'Димитровское' },
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
