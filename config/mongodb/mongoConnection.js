import mongoose from 'mongoose';
import { DB_NAME } from './dbName.js';
import { env } from '../env.config.js';
import logger from '../logger.config.js';

const MongoConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${env.MONGO_URI}${DB_NAME}`)
    logger.info(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.info("MONGODB connection FAILED ", error);
    process.exit(1)
  }
};

export default MongoConnection;