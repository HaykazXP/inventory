const SellingPoint = require('../models/SellingPoint');
const connectDB = require('../config/database');

const sellingPoints = [
  { name: 'Сокол', checkout: 0 },
  { name: 'Михалково', checkout: 0 },
  { name: 'Коптевский бульвар', checkout: 0 },
  { name: 'Тимирязевская', checkout: 0 },
  { name: 'Флотская', checkout: 0 },
  { name: 'Димитровское', checkout: 0 }
];

const seedSellingPoints = async () => {
  try {
    await connectDB();
    
    // Clear existing selling points
    await SellingPoint.deleteMany({});
    console.log('Cleared existing selling points');
    
    // Insert new selling points
    const result = await SellingPoint.insertMany(sellingPoints);
    console.log(`Seeded ${result.length} selling points successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding selling points:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedSellingPoints();
}

module.exports = seedSellingPoints; 