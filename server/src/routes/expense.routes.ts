import { Router } from "express";
import { getExpenses, createExpense, getExpenseById, deleteExpense } from "../controllers/expense.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken as any);

router.get("/", getExpenses as any);
router.post("/", createExpense as any);
router.get("/:id", getExpenseById as any);
router.delete("/:id", deleteExpense as any);

export default router;
