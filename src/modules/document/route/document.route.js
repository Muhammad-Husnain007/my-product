import { Router } from "express";
import { createDocument } from "../controllers/post.controller.js";
import { getDocument } from "../controllers/get.controller.js";
import { deleteDocument } from "../controllers/delete.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import { createDocumentValidator, updateDocumentValidator } from "./document.validator.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { updateDocument } from "../controllers/patch.controller.js";
import Joi from "joi";
import classBasedAccess from './../../../middlewares/classBA.middleware.js';
const router = Router();

router.post(
  "/create",
  authMiddleware,
  validate(createDocumentValidator),
  classBasedAccess("admin", "user", "vendor"),
  createDocument,
);

router.patch(
  "/:documentId",
  authMiddleware,
  validate(updateDocumentValidator),
  classBasedAccess("admin", "user", "vendor"),
  updateDocument,
);

router.get(
  "/:documentId",
  authMiddleware,
  classBasedAccess("admin", "user", "vendor"),
  validate(
    Joi.object({
      params: Joi.object({
        documentId: Joi.string().hex().length(24).required(),
      }),
    }),
  ),
  getDocument,
);

router.delete(
  "/:documentId",
  authMiddleware,
  deleteDocument,
  classBasedAccess("admin", "user", "vendor"),
  validate(
    Joi.object({
      params: Joi.object({
        documentId: Joi.string().hex().length(24).required(),
      }),
    }),
  ),
);

export default router;
