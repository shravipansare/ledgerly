import api from "./api";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
  billingAddress?: string;
  shippingAddress?: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get("/clients");
  return data;
};

export const createClient = async (clientData: Omit<Client, "id">): Promise<Client> => {
  const { data } = await api.post("/clients", clientData);
  return data;
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  const { data } = await api.put(`/clients/${id}`, clientData);
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}`);
};
