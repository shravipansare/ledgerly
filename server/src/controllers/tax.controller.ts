import { Request, Response } from "express";
import { prisma } from "../db";

interface AuthRequest extends Request {
  user?: any;
}

export const getTaxes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const taxes = await prisma.taxRate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(taxes);
  } catch (error) {
    console.error("Error fetching taxes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTax = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, rate, description, isActive } = req.body;

    const tax = await prisma.taxRate.create({
      data: {
        userId,
        name,
        rate: parseFloat(rate),
        description,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    res.status(201).json(tax);
  } catch (error) {
    console.error("Error creating tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTax = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, rate, description, isActive } = req.body;

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Tax rate not found" });
      return;
    }

    const updated = await prisma.taxRate.update({
      where: { id },
      data: {
        name,
        rate: rate !== undefined ? parseFloat(rate) : undefined,
        description,
        isActive,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTax = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Tax rate not found" });
      return;
    }

    await prisma.taxRate.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
