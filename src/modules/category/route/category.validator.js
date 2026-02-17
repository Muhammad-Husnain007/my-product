import Joi from "joi";

export const categoryValidator = Joi.object({
  name: Joi.string().trim().required(),
  userId: Joi.string().trim().required(),

});

