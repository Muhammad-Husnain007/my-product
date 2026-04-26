import Joi from "joi";

export const createVendorValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),

    address: Joi.string().hex().length(24).required(),
    document: Joi.string().hex().length(24).optional(),

    otp: Joi.string().length(4).optional().allow(null),
    otpExpiresAt: Joi.date().optional().allow(null)
  })
};

export const updateVendorValidator = {
  body: Joi.object({
    email: Joi.string().email(),

    address: Joi.string().hex().length(24),

    emailVerified: Joi.boolean(),
    emailVerifiedAt: Joi.date().allow(null),

    document: Joi.string().hex().length(24),

    otp: Joi.string().length(4).allow(null),
    otpExpiresAt: Joi.date().allow(null)
  }).min(1)
};