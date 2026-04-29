
import Joi from "joi";


// ======================================================
// CREATE NEGOTIATION VALIDATOR
// ======================================================

export const createNegotiationValidator = Joi.object({
  hall: Joi.string().hex().length(24).required(),
  receiver: Joi.string().hex().length(24).required(),
  percentage: Joi.number()
    .valid(5, 10, 15)
    .optional()
    .allow(null),

}).or("percentage", "amount");


// ======================================================
// UPDATE NEGOTIATION STATUS VALIDATOR
// ======================================================

export const updateNegotiationStatusValidator = Joi.object({
  status: Joi.string()
    .valid("accepted", "rejected", "cancelled")
    .required(),
});