import { Router } from "express";
import { getInvoices, createInvoice, getInvoiceById, deleteInvoice, updateInvoiceStatus, sendInvoiceEmail } from "../controllers/invoice.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken as any);

router.get("/", getInvoices as any);
router.post("/", createInvoice as any);
router.get("/:id", getInvoiceById as any);
router.patch("/:id/status", updateInvoiceStatus as any);
router.delete("/:id", deleteInvoice as any);
router.post("/:id/send-email", sendInvoiceEmail as any);

export default router;
