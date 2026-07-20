import { Request, Response } from "express";
import { prisma } from "../db";
import { sendQuotationEmailService } from "../services/email.service";

interface AuthRequest extends Request {
  user?: any;
}

export const getQuotations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const quotations = await prisma.quotation.findMany({
      where: { userId },
      include: {
        client: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { clientId, quotationNumber, issueDate, validUntil, subtotal, taxTotal, total, notes, status, items } = req.body;

    const quotation = await prisma.quotation.create({
      data: {
        userId,
        clientId,
        quotationNumber,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        validUntil: new Date(validUntil),
        subtotal,
        taxTotal,
        total,
        notes,
        status: status || "DRAFT",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.status(201).json(quotation);
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuotationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
      },
    });

    if (!quotation || quotation.userId !== userId) {
      res.status(404).json({ error: "Quotation not found" });
      return;
    }

    res.json(quotation);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteQuotation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.quotation.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Quotation not found" });
      return;
    }

    await prisma.quotation.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuotationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const existing = await prisma.quotation.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: "Quotation not found" });
      return;
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: { status },
      include: {
        client: true,
        items: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating quotation status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const convertQuotationToInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!quotation || quotation.userId !== userId) {
      res.status(404).json({ error: "Quotation not found" });
      return;
    }
    
    // Check if it's already accepted to prevent duplicate conversion issues, though we can allow it
    if (quotation.status === "ACCEPTED") {
      // Just a warning, not blocking
    }

    // Mark quotation as accepted
    await prisma.quotation.update({
      where: { id },
      data: { status: "ACCEPTED" }
    });

    // Create a new invoice from the quotation data
    const newInvoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: quotation.userId,
        clientId: quotation.clientId,
        invoiceNumber: newInvoiceNumber,
        issueDate: new Date(),
        dueDate: quotation.validUntil, // default due date to validUntil, user can edit later
        subtotal: quotation.subtotal,
        taxTotal: quotation.taxTotal,
        total: quotation.total,
        notes: quotation.notes,
        status: "DRAFT",
        items: {
          create: quotation.items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          }))
        }
      },
    });

    res.json({
      message: "Quotation converted to invoice successfully",
      invoice: newInvoice
    });

  } catch (error) {
    console.error("Error converting quotation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendQuotationEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      res.status(400).json({ error: "PDF data is required" });
      return;
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!quotation || quotation.userId !== userId) {
      res.status(404).json({ error: "Quotation not found" });
      return;
    }

    await sendQuotationEmailService({
      to: quotation.client.email,
      clientName: quotation.client.name,
      quotationNumber: quotation.quotationNumber,
      totalAmount: quotation.total,
      pdfBase64,
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending quotation email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
