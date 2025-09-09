import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB!');
    } catch (error) {
      console.error('Database connection error:', error);
      process.exit(1);
    }
}