import { Router } from "express";
import { getClients, createClient, updateClient, deleteClient } from "../controllers/client.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Protect all client routes
router.use(authenticateToken as any);

router.get("/", getClients as any);
router.post("/", createClient as any);
router.put("/:id", updateClient as any);
router.delete("/:id", deleteClient as any);

export default router;
