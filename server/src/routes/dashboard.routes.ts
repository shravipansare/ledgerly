import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken as any);

router.get("/metrics", getDashboardMetrics as any);

export default router;
