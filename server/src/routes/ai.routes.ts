import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { processAIPrompt } from "../controllers/ai.controller";

const router = Router();

router.use(authenticateToken);

router.post("/process", processAIPrompt);

export default router;
