import api from "./api";
import type { Client } from "./clientService";

export interface InvoiceItem {
  id?: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "PENDING" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
  clientId: string;
  client?: Client;
  items?: InvoiceItem[];
}

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await api.get("/invoices");
  return data;
};

export const createInvoice = async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
  const { data } = await api.post("/invoices", invoiceData);
  return data;
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  const { data } = await api.get(`/invoices/${id}`);
  return data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await api.delete(`/invoices/${id}`);
};
