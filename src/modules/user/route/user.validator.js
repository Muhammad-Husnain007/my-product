import Joi from "joi";

export const userPostValidator = {
  body: Joi.object({
    phone: Joi.object({
      countryCode: Joi.string().required(),
      phoneNumber: Joi.string().required(),
    }).required(),
  }),
};

export const userParamsValidator = Joi.object({
  userId: Joi.string().required(),
});
export const userUpdateParamsValidator = {
  body: Joi.object({
    phone: Joi.object({
      countryCode: Joi.string().required(),
      number: Joi.string().required(),
    }).required(),
  }),
};
