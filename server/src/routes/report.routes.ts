import { Router } from "express";
import { getReportsData } from "../controllers/report.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken as any);

router.get("/", getReportsData as any);

export default router;
