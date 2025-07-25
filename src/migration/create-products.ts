import * as mongoose from 'mongoose';
import { ProductSchema } from '../product/product.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory';

async function createProducts() {
  await mongoose.connect(MONGO_URI);
  const Product = mongoose.model('Product', ProductSchema);

  // Sample products data
  const sampleProducts = [
    {
      name: 'Laptop',
      price: 999.99,
      oldPrices: {
        '2024-01-15': 1099.99,
        '2024-02-01': 1049.99
      }
    },
    {
      name: 'Smartphone',
      price: 699.99,
      oldPrices: {
        '2024-01-20': 799.99
      }
    },
    {
      name: 'Headphones',
      price: 199.99,
      oldPrices: {}
    },
    {
      name: 'Tablet',
      price: 449.99,
      oldPrices: {
        '2024-01-10': 499.99,
        '2024-02-15': 479.99
      }
    },
    {
      name: 'Wireless Mouse',
      price: 29.99,
      oldPrices: {
        '2024-01-25': 34.99
      }
    }
  ];

  console.log('Creating sample products...');
  
  for (const productData of sampleProducts) {
    const exists = await Product.findOne({ name: productData.name });
    if (!exists) {
      await Product.create(productData);
      console.log(`Created product: ${productData.name}`);
    } else {
      console.log(`Product already exists: ${productData.name}`);
    }
  }

  const totalProducts = await Product.countDocuments();
  console.log(`Total products in database: ${totalProducts}`);
  
  await mongoose.disconnect();
  console.log('Products migration completed');
}

createProducts().catch(console.error); 