import { Router } from "express";
import { createUser, verifyOTP } from "../controllers/post.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import { userParamsValidator, userPostValidator, userUpdateParamsValidator } from "./user.validator.js";
import { patchUser } from "../controllers/patch.controller.js";
import Joi from "joi";

const router = Router()

router.post('/create-user', 
    validate(userPostValidator),
    createUser
);
router.post('/verify-otp',
    validate(
        Joi.object({
            body: Joi.object({
                phone: Joi.object({
                    countryCode: Joi.string().required(),
                    phoneNumber: Joi.string().required(),
                }).required(),
                otp: Joi.number().integer().min(1000).max(9999).required(), // string → number
            })
        })
    ),
    verifyOTP
);

router.patch('/patch/:userId', 
    validate(userUpdateParamsValidator),
    patchUser
);
router.delete('/patch/:userId', 
    validate(userParamsValidator),
    patchUser
);

export default router;