import api from "./api";

export interface ClientRevenue {
  id: string;
  name: string;
  totalRevenue: number;
  outstanding: number;
  invoiceCount: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
}

export interface ReportSummary {
  totalRevenue: number;
  totalTaxCollected: number;
  outstandingAmount: number;
  overdueAmount: number;
  totalInvoices: number;
}

export interface ReportData {
  summary: ReportSummary;
  clientRevenue: ClientRevenue[];
  revenueTrend: RevenueTrend[];
}

export const getReportsData = async (): Promise<ReportData> => {
  const { data } = await api.get("/reports");
  return data;
};
