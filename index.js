// server.js
import logger from './config/logger.config.js';
import MongoConnection from './config/mongodb/mongoConnection.js';
import { app } from './src/app.js';
import apiRouter from './src/modules/routes/index.js'; 

MongoConnection()
  .then(() => {
    app.use('/api/v1', apiRouter);

    app.listen(process.env.PORT, () => {
      logger.info(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Error in DB connect', err);
  });

app.get('/', (req, res) => {
  res.send('Server is ready');
});
