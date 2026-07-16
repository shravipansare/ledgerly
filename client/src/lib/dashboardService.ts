import api from "./api";

export interface DashboardMetrics {
  totalRevenue: number;
  outstandingAmount: number;
  overdueAmount: number;
  totalClients: number;
  totalInvoices: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: any[];
  chartData: { name: string; revenue: number }[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const { data } = await api.get("/dashboard/metrics");
  return data;
};
