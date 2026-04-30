import { Router } from "express";
import { authMiddleware } from './../../../middlewares/auth.middleware.js';
import classBasedAccess from './../../../middlewares/classBA.middleware.js';
import validate from './../../../middlewares/validate.middleware.js';
import { createWallet } from "../controllers/create.controller.js";
import { getWallet } from "../controllers/get.controller.js";
import { transferBalance } from "../controllers/transfer-balance.controller.js";
import Joi from "joi";
import { deleteWallet } from "../controllers/delete.controller.js";

const router = Router();

router.post("/create", 
    authMiddleware,
    classBasedAccess("user", "vendor"),
    createWallet,

)
router.get("/getWallet/:id", 
    authMiddleware,
    classBasedAccess("user", "vendor"),
    getWallet,
)

router.delete("/delWallet/:id",
    authMiddleware,
    classBasedAccess("user", "vendor"),
    deleteWallet,
)

router.post("/transfer-balance", 
    authMiddleware,
    classBasedAccess("user", "vendor"),
    validate({
        body: Joi.object({
            amount: Joi.number().positive().required(),
            recipientWalletId: Joi.string().hex().length(24).required(),
        }),
    }),
    transferBalance,
)

export default router;