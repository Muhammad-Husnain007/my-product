import { Router } from "express";
import { postCategory } from "../controllers/post.category.js";
import validate from "../../../middlewares/validate.middleware.js";
import { categoryValidator } from "./category.validator.js";
import { getCategory } from "../controllers/get.category.js";

const router = Router();

router.post("/create", validate(categoryValidator), postCategory);
router.get("/", getCategory);

export default router;
