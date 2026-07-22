import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Protect payment routes
router.use(authenticateToken);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;
