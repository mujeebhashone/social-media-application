import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = () => {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Error:', err));
};
