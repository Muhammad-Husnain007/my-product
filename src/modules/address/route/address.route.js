import express from "express";
import { createAddressValidator, updateAddressValidator } from "./address.validator.js";
import { createAddress } from "../controllers/post.controller.js";
import { getAddresses } from "../controllers/get.controller.js";
import { updateAddress } from "../controllers/patch.controller.js";
import { deleteAddress } from "../controllers/delete.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import {authMiddleware} from "../../../middlewares/auth.middleware.js";
import Joi from "joi";

const router = express.Router();


router.post(
  "/create",
  authMiddleware,
  validate(createAddressValidator),
  createAddress
);

router.get(
  "/",
  authMiddleware,
  getAddresses
);

router.patch(
  "/update/:addressId",
  authMiddleware,
  validate(updateAddressValidator),
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
  deleteAddress
);

export default router;