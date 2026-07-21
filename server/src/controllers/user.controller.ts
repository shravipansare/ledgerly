import { Request, Response } from "express";
import { prisma } from "../db";

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { companyName, companyAddress, companyPhone, companyTaxId, companyLogo } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        companyName,
        companyAddress,
        companyPhone,
        companyTaxId,
        companyLogo,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        companyName: true,
        companyAddress: true,
        companyPhone: true,
        companyTaxId: true,
        companyLogo: true,
      }
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
