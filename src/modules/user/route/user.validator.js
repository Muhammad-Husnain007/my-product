import Joi from "joi";

export const userPostValidator = 
Joi.object({
  body: Joi.object({
    phone: Joi.object({
      countryCode: Joi.string().required(),
      phoneNumber: Joi.string().required(),
  }).required(),
  })

});

export const userParamsValidator = Joi.object({
  userId: Joi.string().required(), 
});
export const userUpdateParamsValidator = Joi.object({
  // email: Joi.string().trim().required(),
  // deviceId: Joi.string().trim().required(),
  phone: Joi.object({
    countryCode: Joi.string().required(),
    number: Joi.string().required(),
  }).required(),
  // userId: Joi.string().required(), 
});
