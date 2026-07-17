import api from "./api";

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: "SOFTWARE" | "MARKETING" | "SALARY" | "UTILITIES" | "OFFICE" | "TRAVEL" | "OTHER";
  merchant?: string;
  description?: string;
  receiptUrl?: string;
}

export const getExpenses = async (): Promise<Expense[]> => {
  const { data } = await api.get("/expenses");
  return data;
};

export const createExpense = async (expenseData: Partial<Expense>): Promise<Expense> => {
  const { data } = await api.post("/expenses", expenseData);
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};
