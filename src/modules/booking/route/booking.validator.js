import Joi from "joi";

const createBookingValidator = Joi.object({
  hall: Joi.string()
    .hex()
    .length(24)
    .required(),

  eventType: Joi.string()
    .valid("wedding", "birthday", "corporate", "party", "other")
    .required(),

  guestCount: Joi.number()
    .integer()
    .min(1)
    .required(),

  specialRequests: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .optional()
    .allow(null, ""),

  bookingDate: Joi.date()
    .greater("now")
    .required(),

  slot: Joi.object({
    startTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),

    endTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
  })
    .required()
   
});
const updateBookingValidator = Joi.object({
  hall: Joi.string()
    .hex()
    .length(24)
    .optional(),

  eventType: Joi.string()
    .valid("wedding", "birthday", "corporate", "party", "other")
    .optional(),

  guestCount: Joi.number()
    .integer()
    .min(1)
    .optional(),

  specialRequests: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .optional()
    .allow(null, ""),

  bookingDate: Joi.date()
    .greater("now")
    .optional(),

  slot: Joi.object({
    startTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),

    endTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .optional(),
  })
    .optional()
   
});



export {
  createBookingValidator,
  updateBookingValidator
};