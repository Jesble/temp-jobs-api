import mongoose from 'mongoose';

const connectDB = async (url) => {
  await mongoose.connect(url);
  console.log('Verbindung zur Datenbank hergestellt...');
};

export default connectDB;
