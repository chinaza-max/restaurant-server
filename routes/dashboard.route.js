import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import authMiddleware  from "../middleware/auth.js";

const router = Router();
router.get("/", authMiddleware,getDashboardSummary);

export default router;