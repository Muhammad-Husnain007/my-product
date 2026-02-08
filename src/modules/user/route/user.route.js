import { Router } from "express";
import { createUser } from "../controllers/post.controller.js";
import classBasedAccess from "../../../middlewares/classBA.middleware.js";
import { ROLES } from "../../../../constans/role.constant.js";
import validate from "../../../middlewares/validate.middleware.js";
import { userPostValidator } from "./user.validator.js";

const router = Router()

router.post('/create-user', 
    validate(userPostValidator),
    createUser
);

export default router;