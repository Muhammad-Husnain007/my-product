import { Router } from "express";
import { authMiddleware } from './../../../middlewares/auth.middleware.js';
import classBasedAccess from './../../../middlewares/classBA.middleware.js';
import validate from './../../../middlewares/validate.middleware.js';
import Joi from "joi";
import { createPayment } from "../controllers/create.controller.js";

const router = Router()

router.post("/create-payment",
    authMiddleware,
    classBasedAccess("user", "vendor"),
    validate({
        body: Joi.object({
            bookingId: Joi.string().length(24).hex().required(),
            type: Joi.string().valid("advanced", "full").required(),
        }),
    }),
    createPayment
)   

export default router;
        
  