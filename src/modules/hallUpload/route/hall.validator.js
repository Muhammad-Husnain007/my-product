import Joi from "joi";

export const createHallValidator = Joi.object({
  hallName: Joi.string().required().trim().messages({
    "string.empty": "Hall name is required",
    "any.required": "Hall name is required",
  }),
  description: Joi.string().optional().trim(),
  address: Joi.string().hex().length(24).required(),
  pricePerSlot: Joi.number().required().messages({
    "number.base": "Price per slot must be a number",
    "any.required": "Price per slot is required",
  }),
  capacity: Joi.number().required().messages({
    "number.base": "Capacity must be a number",
    "any.required": "Capacity is required",
  }),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string().hex().length(24)).required()
});

export const updateHallValidator = {
  body: Joi.object({
    hallName: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    address: Joi.string().optional(),
    pricePerSlot: Joi.number().optional(),
    capacity: Joi.number().optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    isAvailable: Joi.boolean().optional(),
  }),
  params: Joi.object({
    hallId: Joi.string().hex().length(24).required(),
  }),
};
