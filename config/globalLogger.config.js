import { DeviceModel } from '../src/modules/device/model/device.model.js';
import logger from './logger.config.js';

const globalLogger = (req, res, next) => {
  const deviceId = req.body.deviceId || req.headers['device-id'] || 'UnknownDevice';
  const method = req.method;
  const path = req.originalUrl;

  res.on('finish', async() => {
    const device = await DeviceModel.findOne({deviceId: deviceId, del: false}).select("-del -__v")
    logger.info(
      `${method} ${path} device:${device}`
    );
  });

  next();
};

export default globalLogger;
