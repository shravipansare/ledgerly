import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken as any);

router.get("/", getProducts as any);
router.post("/", createProduct as any);
router.put("/:id", updateProduct as any);
router.delete("/:id", deleteProduct as any);

export default router;
