import { Router } from "express";
import { authMiddleware } from './../../../middlewares/auth.middleware.js';
import classBasedAccess from './../../../middlewares/classBA.middleware.js';
import createBooking from './../controllers/booking.controller.js';
import validate from './../../../middlewares/validate.middleware.js';
import { createBookingValidator, updateBookingValidator } from "./booking.validator.js";
import { getBookingForUser, getBookingForVendor } from "../controllers/getBooking.controller.js";
import { cancelBooking } from "../controllers/cancel.controller.js";
import { updateBooking } from "../controllers/updateBooking.controller.js";
import { updateBookingStatus } from "../controllers/accept-reject.controller.js";
import Joi from "joi";

const router = Router();

router.post("/create-booking", 
    authMiddleware,
    classBasedAccess("user", "vendor"),
    validate(createBookingValidator),
    createBooking
)
router.get("/for-vendor/:id", 
    authMiddleware,
    classBasedAccess( "vendor"),
    getBookingForVendor,
)
router.get("/for-user/:id", 
    authMiddleware,
    classBasedAccess("user"),
    getBookingForUser,
)

router.patch("/cancel/:id",
    authMiddleware,
    classBasedAccess("user"),
    cancelBooking
)

router.patch("/update/:id",
    authMiddleware,
    classBasedAccess("user"),
    validate(updateBookingValidator),
    updateBooking
)

router.patch("/accept-reject/:id",
     authMiddleware, 
     classBasedAccess("user"),
     validate({
        body: Joi.object({
            status: Joi.string().valid("accepted", "rejected").required(),
            rejectReason: Joi.string().when("status", {
                is: "rejected",
                then: Joi.string().trim().min(3).max(500).required(),
                // otherwise: Joi.string().optional().allow(null, ""),
            }),
            hall: Joi.string().hex().length(24)
            
     })
    }),
     updateBookingStatus
    )

export default router;