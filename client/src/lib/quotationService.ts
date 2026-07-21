import api from "./api";

export const getQuotations = async () => {
  const { data } = await api.get("/quotations");
  return data;
};

export const getQuotationById = async (id: string) => {
  const { data } = await api.get(`/quotations/${id}`);
  return data;
};

export const createQuotation = async (quotationData: any) => {
  const { data } = await api.post("/quotations", quotationData);
  return data;
};

export const deleteQuotation = async (id: string) => {
  const { data } = await api.delete(`/quotations/${id}`);
  return data;
};

export const updateQuotationStatus = async ({ id, status }: { id: string; status: string }) => {
  const { data } = await api.patch(`/quotations/${id}/status`, { status });
  return data;
};

export const convertQuotationToInvoice = async (id: string) => {
  const { data } = await api.post(`/quotations/${id}/convert`, {});
  return data;
};

export const sendQuotationEmail = async (id: string, pdfBase64: string) => {
  const { data } = await api.post(`/quotations/${id}/send-email`, { pdfBase64 });
  return data;
};
