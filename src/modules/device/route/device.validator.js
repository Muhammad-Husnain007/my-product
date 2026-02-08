import Joi from 'joi';

export const deviceSyncValidator = Joi.object({
  deviceId: Joi.string().trim().required(),
  ip: Joi.string().trim().required(),
  info: Joi.object({
    os: Joi.string().optional(),
    name: Joi.string().optional(),
    version: Joi.string().optional(),
    model: Joi.string().optional(),
  }).optional(),
});