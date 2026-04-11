import Joi from "joi";


const createAddressValidator =  Joi.object({
    label: Joi.string().valid("Home", "Work", "Other").optional(),

    fullName: Joi.string().trim().min(3).required(),

    addressLine: Joi.string().trim().min(5).required(),

    city: Joi.string().required(),

    state: Joi.string().optional(),

    postalCode: Joi.string().optional(),

    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }).optional(),
    country: Joi.string().required(),
    active: Joi.boolean().optional()
  });

const updateAddressValidator = {
  body: Joi.object({
    label: Joi.string().valid("Home", "Work", "Other"),
    fullName: Joi.string().trim().min(3),
    addressLine: Joi.string().trim().min(5),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    }),
    active: Joi.boolean(),
    country: Joi.string()
  }).min(1),

  params: Joi.object({
    addressId: Joi.string().hex().length(24).required()
  })
};

export {
  createAddressValidator,
  updateAddressValidator
};