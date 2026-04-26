import logger from './config/logger.config.js';
import MongoConnection from './config/mongodb/mongoConnection.js';
import { app } from './src/app.js';

MongoConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Error in DB connect', err);
  });