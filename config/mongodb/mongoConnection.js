import mongoose from 'mongoose';
import { DB_NAME } from './dbName.js';
import logger from '../logger.config.js';
import dotenv from 'dotenv';
dotenv.config();

const MongoConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`)
    logger.info(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.info("MONGODB connection FAILED ", error);
    process.exit(1)
  }
};

export default MongoConnection;