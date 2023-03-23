import mongoose from 'mongoose';
import config from 'config';

const dbURI = config.get<string>('dbURI');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbURI);
    console.log('Database connected!');
  } catch (error: any) {
    console.error(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
