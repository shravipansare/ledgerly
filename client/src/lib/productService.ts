import api from "./api";

export interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  taxCategory?: string;
  unit?: string;
  description?: string;
  isActive: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products");
  return data;
};

export const createProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
