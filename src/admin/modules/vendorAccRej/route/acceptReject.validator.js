import Joi from "joi";

export const createAcceptRejectValidator = Joi.object({
  vendor: Joi.string().required().messages({
    "string.empty": "Vendor ID is required",
    "any.required": "Vendor ID is required",
  }),
  status: Joi.string()
    .valid("accepted", "rejected")
    .required()
    .messages({
      "any.only": "Status must be either 'accepted' or 'rejected'",
      "any.required": "Status is required",
    }),
  reason: Joi.string().optional().allow("").trim(),
});
