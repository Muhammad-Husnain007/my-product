import { Router } from "express";
import { createUser } from "../controllers/post.controller.js";
import validate from "../../../middlewares/validate.middleware.js";
import { userParamsValidator, userPostValidator, userUpdateParamsValidator } from "./user.validator.js";
import { patchUser } from "../controllers/patch.controller.js";

const router = Router()

router.post('/create-user', 
    validate(userPostValidator),
    createUser
);
router.patch('/patch/:userId', 
    validate(userUpdateParamsValidator),
    patchUser
);
router.delete('/patch/:userId', 
    validate(userParamsValidator),
    patchUser
);

export default router;