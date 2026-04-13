import express from "express";
import { createAcceptRejectValidator } from "./acceptReject.validator.js";
import { createAcceptReject } from "../controllers/post.controller.js";
import validate from "./../../../../middlewares/validate.middleware.js";
import { authMiddleware } from './../../../../middlewares/auth.middleware.js';


const router = express.Router();

router.post(
  "/acc-rej-vendoor",
  authMiddleware,
  validate(createAcceptRejectValidator),
  createAcceptReject
);

export default router;
