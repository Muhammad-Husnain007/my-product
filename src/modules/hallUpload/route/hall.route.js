import express from "express";
import { createHallValidator, updateHallValidator } from "./hall.validator.js";
import { createHall } from "../controllers/post.controller.js";
import { getHallById } from "../controllers/get.controller.js";
import { updateHall } from "../controllers/patch.controller.js";
import { deleteHall } from "../controllers/delete.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import classBasedAccess from "../../../middlewares/classBA.middleware.js";
import Joi from "joi";
import { getAllHalls } from "../controllers/getAll.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  validate(createHallValidator),
  createHall,
);

router.get(
  "/:hallId",
  authMiddleware,
  classBasedAccess("user", "vendor", "admin"),
  validate({
    params: Joi.object({
      hallId: Joi.string().hex().length(24).required(),
    }),
  }),
  getHallById,
);

router.patch(
  "/:hallId",
  authMiddleware,
  validate(updateHallValidator),
  updateHall,
);

router.delete(
  "/:hallId",
  authMiddleware,
  classBasedAccess("user", "vendor", "admin"),
  validate({
    params: Joi.object({
      hallId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteHall,
);

router.get(
  "/get-all",
  authMiddleware,
  classBasedAccess("user", "vendor", "admin"),
  getAllHalls,
);

export default router;
