import Joi from "joi";

export const createDocumentValidator = Joi.object({
  type: Joi.string().valid("id_card").required(),

  imageFrontSide: Joi.string().uri().allow("", null),
  imageBackSide: Joi.string().uri().allow("", null),

  issueDate: Joi.date().required(),
  expiryDate: Joi.date().required(),
});

export const updateDocumentValidator = {
  body: Joi.object({
    type: Joi.string().valid("id_card"),

    imageFrontSide: Joi.string().uri().allow("", null),
    imageBackSide: Joi.string().uri().allow("", null),

    issueDate: Joi.date(),
    expiryDate: Joi.date(),
  }).min(1),
  params: Joi.object({
    documentId: Joi.string().hex().length(24).required(),
  }),
};
