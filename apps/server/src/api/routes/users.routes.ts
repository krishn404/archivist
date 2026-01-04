import express, { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validateUpdateName } from "../validators/users.validator";
import { updateName } from "../controllers/users.controller";

const router: express.Router = Router();

// POST /api/users/update-name
router.post("/update-name", authenticate, validateUpdateName, updateName);

export default router;
