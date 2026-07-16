import { Request, Response } from "express";
import { prisma } from "../db";

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    // 1. Total Clients
    const totalClients = await prisma.client.count({
      where: { userId },
    });

    // 2. Fetch all invoices for aggregation
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalInvoices = invoices.length;
    
    let totalRevenue = 0;
    let outstandingAmount = 0;
    let overdueAmount = 0;

    invoices.forEach(inv => {
      if (inv.status === "PAID") {
        totalRevenue += inv.total;
      }
      if (inv.status === "SENT" || inv.status === "PENDING" || inv.status === "PARTIALLY_PAID") {
        outstandingAmount += inv.total;
      }
      if (inv.status === "OVERDUE" || (new Date(inv.dueDate) < new Date() && inv.status !== "PAID" && inv.status !== "CANCELLED")) {
        overdueAmount += inv.total;
      }
    });

    // 3. Recent Activity (Last 5 invoices)
    const recentActivity = invoices.slice(0, 5);

    // 4. Revenue Chart Data (Last 6 months)
    // Group paid invoices by month
    const revenueByMonth = new Map();
    const today = new Date();
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short' });
      revenueByMonth.set(monthStr, 0);
    }

    invoices.forEach(inv => {
      if (inv.status === "PAID") {
        const d = new Date(inv.issueDate);
        // Only include if it's within the last 6 months
        const diffTime = Math.abs(today.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 180) {
          const monthStr = d.toLocaleString('default', { month: 'short' });
          if (revenueByMonth.has(monthStr)) {
            revenueByMonth.set(monthStr, revenueByMonth.get(monthStr) + inv.total);
          }
        }
      }
    });

    const chartData = Array.from(revenueByMonth, ([name, revenue]) => ({ name, revenue }));

    res.json({
      metrics: {
        totalRevenue,
        outstandingAmount,
        overdueAmount,
        totalClients,
        totalInvoices,
      },
      recentActivity,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
