import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getQuotations,
  createQuotation,
  getQuotationById,
  deleteQuotation,
  updateQuotationStatus,
  convertQuotationToInvoice
} from "../controllers/quotation.controller";

const router = Router();

router.use(authenticate);

router.get("/", getQuotations);
router.post("/", createQuotation);
router.get("/:id", getQuotationById);
router.delete("/:id", deleteQuotation);
router.patch("/:id/status", updateQuotationStatus);
router.post("/:id/convert", convertQuotationToInvoice);

export default router;
