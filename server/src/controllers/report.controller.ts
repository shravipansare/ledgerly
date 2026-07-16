import { Request, Response } from "express";
import { prisma } from "../db";

interface AuthRequest extends Request {
  user?: any;
}

export const getReportsData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    // Fetch all invoices for aggregation
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
      orderBy: { issueDate: "desc" },
    });

    let totalRevenue = 0;
    let totalTaxCollected = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;
    
    // Revenue by Client aggregation
    const clientRevenueMap = new Map<string, { id: string, name: string, totalRevenue: number, outstanding: number, invoiceCount: number }>();

    invoices.forEach(inv => {
      // Client tracking
      if (!clientRevenueMap.has(inv.clientId)) {
        clientRevenueMap.set(inv.clientId, {
          id: inv.clientId,
          name: inv.client?.name || "Unknown",
          totalRevenue: 0,
          outstanding: 0,
          invoiceCount: 0
        });
      }
      
      const clientStats = clientRevenueMap.get(inv.clientId)!;
      clientStats.invoiceCount += 1;

      // Aggregations based on status
      if (inv.status === "PAID") {
        totalRevenue += inv.total;
        totalTaxCollected += inv.taxTotal;
        clientStats.totalRevenue += inv.total;
      } else if (inv.status === "SENT" || inv.status === "PENDING" || inv.status === "PARTIALLY_PAID") {
        outstandingAmount += inv.total;
        clientStats.outstanding += inv.total;
      } else if (inv.status === "OVERDUE" || (new Date(inv.dueDate) < new Date() && inv.status !== "PAID" && inv.status !== "CANCELLED" && inv.status !== "DRAFT")) {
        overdueAmount += inv.total;
        clientStats.outstanding += inv.total;
      }
    });

    const clientRevenue = Array.from(clientRevenueMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by highest revenue

    // Revenue over time (Last 12 months)
    const revenueByMonth = new Map();
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().substring(2);
      revenueByMonth.set(monthStr, 0);
    }

    invoices.forEach(inv => {
      if (inv.status === "PAID") {
        const d = new Date(inv.issueDate);
        const diffTime = Math.abs(today.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 365) {
          const monthStr = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().substring(2);
          if (revenueByMonth.has(monthStr)) {
            revenueByMonth.set(monthStr, revenueByMonth.get(monthStr) + inv.total);
          }
        }
      }
    });

    const revenueTrend = Array.from(revenueByMonth, ([month, revenue]) => ({ month, revenue }));

    res.json({
      summary: {
        totalRevenue,
        totalTaxCollected,
        outstandingAmount,
        overdueAmount,
        totalInvoices: invoices.length
      },
      clientRevenue,
      revenueTrend,
    });
  } catch (error) {
    console.error("Error fetching reports data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
