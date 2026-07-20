import api from "./api";

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export const getTaxes = async (): Promise<TaxRate[]> => {
  const response = await api.get("/taxes");
  return response.data;
};

export const createTax = async (data: Omit<TaxRate, "id" | "createdAt">): Promise<TaxRate> => {
  const response = await api.post("/taxes", data);
  return response.data;
};

export const updateTax = async (data: { id: string } & Partial<TaxRate>): Promise<TaxRate> => {
  const { id, ...rest } = data;
  const response = await api.put(`/taxes/${id}`, rest);
  return response.data;
};

export const deleteTax = async (id: string): Promise<void> => {
  await api.delete(`/taxes/${id}`);
};
