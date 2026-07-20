import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  getTaxes,
  createTax,
  updateTax,
  deleteTax
} from "../controllers/tax.controller";

const router = Router();

router.use(authenticateToken);

router.get("/", getTaxes);
router.post("/", createTax);
router.put("/:id", updateTax);
router.delete("/:id", deleteTax);

export default router;
