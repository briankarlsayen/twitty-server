import mongoose from 'mongoose';
import User from '../../src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const SERVER = process.env.MONGODB_URI ?? '';

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(SERVER);
  console.log('MongoDB is Connected');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

const deleteCollections = async () => {
  try {
    const names = await mongoose.connection.db.collections();
    if (names) {
      console.log('Deleting collections:');
      Promise.all(
        names.map(async function (name: any) {
          const colName = name?.s?.namespace?.collection;
          mongoose.connection.db.dropCollection(colName);
          console.log('--->>', colName);
        })
      );
    }
  } catch (err) {
    console.log('err', err);
  }
};

const adminAcc = {
  fullName: 'admin',
  email: 'admin@mail.com',
  role: 'admin',
  password: '123',
  birthDate: '01/01/2000',
  isActive: true,
  bio: 'I am atomic',
};

const seedDB = async () => {
  await connectDB();
  await deleteCollections();
  await User.create(adminAcc);
  mongoose.connection.close();
  console.log('Done seeding database');
};

try {
  seedDB();
} catch (err) {
  console.log('err', err);
}
