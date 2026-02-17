import Joi from "joi";

export const userPostValidator = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  deviceId: Joi.string().trim().required(),
//   profile: Joi.object({
//     currency: Joi.string().required(),
//     country: Joi.string().required(),
//   }).required(),
  phone: Joi.object({
    countryCode: Joi.string().required(),
    number: Joi.string().required(),
  }).required(),

});

export const userParamsValidator = Joi.object({
  userId: Joi.string().required(), 
});
export const userUpdateParamsValidator = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  deviceId: Joi.string().trim().required(),
  phone: Joi.object({
    countryCode: Joi.string().required(),
    number: Joi.string().required(),
  }).required(),
  userId: Joi.string().required(), 
});
