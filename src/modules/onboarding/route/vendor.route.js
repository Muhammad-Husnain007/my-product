import { Router } from "express";
import classBasedAccess from '../../../middlewares/classBA.middleware.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validate.middleware.js';
import create from "../controllers/post.controller.js";
import verifyOTP from "../controllers/patch.controller.js";
import { getVendorById } from "../controllers/get.controller.js";
import { deleteVendor } from "../controllers/delete.controller.js";
import { createVendorValidator } from "./vendor.validator.js";
import Joi from "joi";

const router = Router()

router.post('/create',
    authMiddleware,
    classBasedAccess("user"),
    validate(createVendorValidator),
    create
)
router.patch('/verify',
    authMiddleware,
    classBasedAccess("user"),
    validate({
        body: Joi.object({
            otp: Joi.number().min(4).required()
        })
    }),
    verifyOTP
    
)

router.get('/:vendorId',
    authMiddleware,
    validate({
        params: Joi.object({
            vendorId: Joi.string().hex().length(24).required()
        })
    }),
    getVendorById
)

router.delete('/:vendorId',
    authMiddleware,
    validate({
        params: Joi.object({
            vendorId: Joi.string().hex().length(24).required()
        })
    }),
    deleteVendor
)

// router.post('/create',
//     classBasedAccess("user"),
//     authMiddleware,
//     validate(),
//     create
// )
// router.post('/create',
//     classBasedAccess("user"),
//     authMiddleware,
//     validate(),
//     create
// )

export default router;