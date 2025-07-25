import * as mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserSchema } from '../user/user.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory';

async function createUser() {
  await mongoose.connect(MONGO_URI);
  const User = mongoose.model('User', UserSchema);

  const username = 'admin';
  const password = 'admin123'; // Change as needed
  const hash = await bcrypt.hash(password, 10);

  const exists = await User.findOne({ username });
  if (!exists) {
    await User.create({ 
      username, 
      password: hash,
      settings: { language: 'ru' } // Set Russian as default language
    });
    console.log('User created with Russian as default language');
  } else {
    // Update existing user to have settings if they don't exist
    const user = await User.findOne({ username });
    if (!user.settings) {
      await User.findOneAndUpdate(
        { username },
        { settings: { language: 'ru' } },
        { new: true }
      );
      console.log('Updated existing user with default settings');
    } else {
      console.log('User already exists with settings');
    }
  }
  await mongoose.disconnect();
}

createUser();
