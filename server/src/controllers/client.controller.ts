import { Request, Response } from "express";
import { prisma } from "../db";

// Extend Request to include our authenticated user
interface AuthRequest extends Request {
  user?: any;
}

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const clients = await prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, email, phone, gstNumber, panNumber, billingAddress, shippingAddress } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        gstNumber,
        panNumber,
        billingAddress,
        shippingAddress,
        userId,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    // Verify ownership
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Client not found" });
      return;
    }

    await prisma.client.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
