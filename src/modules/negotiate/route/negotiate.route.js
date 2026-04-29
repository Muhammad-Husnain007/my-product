import { Router } from "express";
import { authMiddleware } from './../../../middlewares/auth.middleware.js';
import classBasedAccess from './../../../middlewares/classBA.middleware.js';
import validate from './../../../middlewares/validate.middleware.js';
import { createNegotiation } from "../controllers/create.controller.js";
import { createNegotiationValidator, updateNegotiationStatusValidator } from "./negotiatae.validator.js";
import { getNegotiateForUser, getNegotiateForVendor } from "../controllers/get.controller.js";
import { cancelNegotiation } from "../controllers/cancel.controller.js";
import { updateNegotiationStatus } from "../controllers/accept-reject.controller.js";


const router = Router();

router.post("/create-negotiate", 
    authMiddleware,
    classBasedAccess("user", "vendor"),
    validate(createNegotiationValidator),
    createNegotiation
)

router.get("/for-vendor",
    authMiddleware,
    classBasedAccess("user"),
    getNegotiateForVendor
)
router.get("/for-user",
    authMiddleware,
    classBasedAccess("user"),
    getNegotiateForUser
)

router.patch("/cancel/:id",
    authMiddleware,
    classBasedAccess("user", "vendor"),
    // validate(updateNegotiationStatusValidator),
    cancelNegotiation
)

router.patch("/accept-reject/:id",
    authMiddleware,
    classBasedAccess("vendor", "user"),
    validate(updateNegotiationStatusValidator),
    updateNegotiationStatus
)

export default router;