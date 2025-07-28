const Product = require('../models/Product');
const connectDB = require('../config/database');

const products = [
  { name: 'Булочка', price: 150 },
  { name: 'Вата', price: 200 },
  { name: 'Вафельный стаканчик ванильный 80г', price: 140 },
  { name: 'Вафельный стаканчик крем-брюле 80г', price: 140 },
  { name: 'Вафельный стаканчик радуга 90г', price: 150 },
  { name: 'Вафельный стаканчик шоколадный 80г', price: 140 },
  { name: 'Веселый кактус фисташковый в белой глазури', price: 250 },
  { name: 'Веселый кактус фисташковый в шок глазури', price: 250 },
  { name: 'Вода 0,5 коптево', price: 50 },
  { name: 'Вода 0,5', price: 70 },
  { name: 'Гав гав', price: 200 },
  { name: 'Детский пломбир ванильный дойпак 70гр', price: 180 },
  { name: 'Добрый сок', price: 100 },
  { name: 'Домик в деревне', price: 140 },
  { name: 'Домик в деревне с крошкой', price: 140 },
  { name: 'Единорожка', price: 150 },
  { name: 'Кактус арахис-карамель 70г', price: 170 },
  { name: 'Кактус малиновый с кусочками малины 80гр', price: 170 },
  { name: 'Кактус пекан', price: 250 },
  { name: 'Кактус с кусочками клубники 80гр', price: 170 },
  { name: 'Кукуруза', price: 150 },
  { name: 'Лакомка московская 80г', price: 170 },
  { name: 'Леденец', price: 50 },
  { name: 'Липтон', price: 120 },
  { name: 'Мармелад', price: 50 },
  { name: 'Мини-шарики 65г', price: 200 },
  { name: 'Мини-шарики радуга 65г', price: 200 },
  { name: 'Мороженое-смузи гранат и вишня 70г', price: 180 },
  { name: 'Новый замороженный чай "барбарис с соком вишни и с яблоком" 50г', price: 200 },
  { name: 'Новый замороженный чай "клюкв, пунш с кусочками апельсина" 50г', price: 200 },
  { name: 'Новый замороженный чай "яблоко с корицей и облепихой" 50г', price: 200 },
  { name: 'Новый замороженный чай апельсин с облепихой 50г', price: 200 },
  { name: 'Новый замороженный чай малина с брусникой и чабрецом 50г', price: 200 },
  { name: 'Новый замороженный чай манго с маракуйей и апельсином', price: 200 },
  { name: 'Новый замороженный чай облепиха с розмарином 50г', price: 200 },
  { name: 'Палочки для ваты', price: 200 },
  { name: 'Пломбир "ванильный" 70 г', price: 100 },
  { name: 'Пломбир в апельсиновом соке 70г', price: 100 },
  { name: 'Пломбир в клубничном соке 70г', price: 100 },
  { name: 'Пломбир манго с пюре и кусочками 70гр', price: 200 },
  { name: 'Попкорн', price: 150 },
  { name: 'Пралине', price: 250 },
  { name: 'Рожок ванильный в пергаменте 110г', price: 170 },
  { name: 'Рожок фисташковый в пергаменте 110г', price: 190 },
  { name: 'Рожок шоколадный в пергаменте 110г', price: 190 },
  { name: 'Сахарная трубочка 70г', price: 150 },
  { name: 'Сок', price: 250 },
  { name: 'Сок с шариками', price: 250 },
  { name: 'Сорбет кактус 65г', price: 100 },
  { name: 'Сорбет лето-фест зеленый 65 г', price: 180 },
  { name: 'Сорбет лето-фест клубника и голубика-банан 65 г', price: 180 },
  { name: 'Сорбет лето-фест манго и клубника 65г', price: 180 },
  { name: 'Сорбет лето-фест розовый 65 г', price: 180 },
  { name: 'Сосиски', price: 150 },
  { name: 'Соу фреш', price: 250 },
  { name: 'Соу фреш клубника', price: 250 },
  { name: 'Соу фреш малина личи', price: 250 },
  { name: 'Соу фрешмалина манго', price: 250 },
  { name: 'Фреш мороженое', price: 250 },
  { name: 'Эскимо "российское" ванильное 80г', price: 170 },
  { name: 'Эскимо волшебный фонарь 80г', price: 170 },
  { name: 'Эскимо крем-брюле с арахисом 80г', price: 170 },
  { name: 'Эскимо с миндалем 80г', price: 200 },
  { name: 'Манго', price: 200 },
  { name: 'Кола', price: 150 }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`Seeded ${result.length} products successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts; 