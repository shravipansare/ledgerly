import { Request, Response } from "express";
import { prisma } from "../db";
import { processNaturalLanguage } from "../services/ai.service";

interface AuthRequest extends Request {
  user?: any;
}

export const processAIPrompt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    // 1. Fetch user context (clients)
    const clients = await prisma.client.findMany({
      where: { userId },
      select: { id: true, name: true }
    });

    // 2. Process with AI (Mocked)
    const intent = await processNaturalLanguage(prompt, clients);

    if (intent.action === "UNKNOWN") {
      res.status(400).json({ error: "I couldn't understand what you want me to do. Try saying 'Create an invoice for ABC Corp for $500'." });
      return;
    }

    // Handle GET_REVENUE first as it doesn't need a client
    if (intent.action === "GET_REVENUE") {
      const paidInvoices = await prisma.invoice.findMany({
        where: { userId, status: "PAID" },
        select: { total: true }
      });
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue);
      
      res.json({ 
        message: `Your total revenue from all paid invoices is ${formattedRevenue}. Great job!`, 
        type: "revenue", 
        data: { total: totalRevenue } 
      });
      return;
    }

    if (!intent.clientName && intent.action !== "LOG_EXPENSE") {
      res.status(400).json({ error: "I couldn't identify the client name in your request." });
      return;
    }

    // 3. Resolve Client
    let client = null;
    if (intent.clientName) {
      client = await prisma.client.findFirst({
        where: { 
          userId, 
          name: { contains: intent.clientName, mode: 'insensitive' } 
        }
      });

      // Create client if doesn't exist
      if (!client) {
        client = await prisma.client.create({
          data: {
            userId,
            name: intent.clientName,
            email: intent.email || `${intent.clientName.replace(/\s+/g, '').toLowerCase()}@example.com`
          }
        });
      }
    }

    const amount = intent.totalAmount || 0;
    const description = intent.description || "Services Rendered";

    // 4. Create the Entity
    
    if (intent.action === "ADD_CLIENT") {
      res.json({ message: `Successfully added ${client?.name} as a new client!`, type: "client", data: client });
      return;
    }

    if (intent.action === "LOG_EXPENSE") {
      const newExpense = await prisma.expense.create({
        data: {
          userId,
          category: description,
          amount,
          date: new Date(),
          description: intent.description ? `AI Logged: ${intent.description}` : "AI Logged Expense",
          receiptUrl: null
        }
      });
      res.json({ message: `Logged an expense of ₹${amount} for ${description}.`, type: "expense", data: newExpense });
      return;
    }
    if (intent.action === "CREATE_INVOICE") {
      const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      const newInvoice = await prisma.invoice.create({
        data: {
          userId,
          clientId: client.id,
          invoiceNumber,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // +14 days
          subtotal: amount,
          taxTotal: 0,
          total: amount,
          status: "DRAFT",
          items: {
            create: [
              {
                description,
                quantity: 1,
                unitPrice: amount,
                total: amount
              }
            ]
          }
        }
      });
      res.json({ message: "Invoice created successfully", type: "invoice", data: newInvoice });
      return;
    }

    if (intent.action === "CREATE_QUOTATION") {
      const quotationNumber = `EST-${Math.floor(1000 + Math.random() * 9000)}`;
      const newQuotation = await prisma.quotation.create({
        data: {
          userId,
          clientId: client.id,
          quotationNumber,
          issueDate: new Date(),
          validUntil: new Date(new Date().setDate(new Date().getDate() + 30)), // +30 days
          subtotal: amount,
          taxTotal: 0,
          total: amount,
          status: "DRAFT",
          items: {
            create: [
              {
                description,
                quantity: 1,
                unitPrice: amount,
                total: amount
              }
            ]
          }
        }
      });
      res.json({ message: "Quotation created successfully", type: "quotation", data: newQuotation });
      return;
    }

  } catch (error) {
    console.error("Error processing AI prompt:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
};
