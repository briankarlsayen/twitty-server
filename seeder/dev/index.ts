import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { createUsers } from './user.seed';
import { createPosts } from './post.seed';
import { createComments } from './comment.seed';
import { createTags } from './tag.seed';

const SERVER = process.env.MONGODB_URI ?? '';

const connectDB = async () => {
  console.log('connecting...');
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
      return true;
    }
  } catch (err) {
    console.log('err', err);
  }
};

const createSeedCollections = async () => {
  console.log('Seeding collections:');
  await createUsers();
  console.log('--->>', 'users');
  await createTags();
  console.log('--->>', 'tags');
  await createPosts(20);
  console.log('--->>', 'posts');
  await createComments();
  console.log('--->>', 'comments');

  mongoose.connection.close();
  console.log('Done seeding database');
};

const seedDB = async () => {
  try {
    await connectDB();
    console.log('connected');
    const deleted = await deleteCollections();
    if (deleted) {
      setTimeout(() => createSeedCollections(), 3000);
    } else {
      mongoose.connection.close();
    }
  } catch (err) {
    console.log('Error encountered, please try again');
  }
};

try {
  console.log('seeding...');
  seedDB();
} catch (err) {
  console.log('err', err);
}
