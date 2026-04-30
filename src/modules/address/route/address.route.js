import express from "express";
import { createAddressValidator, updateAddressValidator } from "./address.validator.js";
import { createAddress } from "../controllers/post.controller.js";
import { getAddresses } from "../controllers/get.controller.js";
import { updateAddress } from "../controllers/patch.controller.js";
import { deleteAddress } from "../controllers/delete.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import {authMiddleware} from "../../../middlewares/auth.middleware.js";
import Joi from "joi";
import classBasedAccess from './../../../middlewares/classBA.middleware.js';

const router = express.Router();


router.post(
  "/create",
  authMiddleware,
  validate(createAddressValidator),
  classBasedAccess(["user", "vendor"]),
  createAddress
);

router.get(
  "/",
  authMiddleware,
  classBasedAccess(["user", "vendor"]),
  getAddresses
);

router.patch(
  "/update/:addressId",
  authMiddleware,
  validate(updateAddressValidator),
  classBasedAccess(["user", "vendor"]),
  updateAddress
);

router.delete(
  "/del/:addressId",
  authMiddleware,
  validate(Joi.object({
    params: Joi.object({
      addressId: Joi.string().hex().length(24).required()
    })
  })),
  classBasedAccess(["user", "vendor"]),
  deleteAddress
);

export default router;