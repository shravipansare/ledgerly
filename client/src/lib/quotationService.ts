import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getQuotations = async () => {
  const response = await axios.get(`${API_URL}/quotations`, getAuthHeaders());
  return response.data;
};

export const getQuotationById = async (id: string) => {
  const response = await axios.get(`${API_URL}/quotations/${id}`, getAuthHeaders());
  return response.data;
};

export const createQuotation = async (quotationData: any) => {
  const response = await axios.post(`${API_URL}/quotations`, quotationData, getAuthHeaders());
  return response.data;
};

export const deleteQuotation = async (id: string) => {
  const response = await axios.delete(`${API_URL}/quotations/${id}`, getAuthHeaders());
  return response.data;
};

export const updateQuotationStatus = async ({ id, status }: { id: string; status: string }) => {
  const response = await axios.patch(`${API_URL}/quotations/${id}/status`, { status }, getAuthHeaders());
  return response.data;
};

export const convertQuotationToInvoice = async (id: string) => {
  const response = await axios.post(`${API_URL}/quotations/${id}/convert`, {}, getAuthHeaders());
  return response.data;
};

export const sendQuotationEmail = async (id: string, pdfBase64: string) => {
  const response = await axios.post(`${API_URL}/quotations/${id}/send-email`, { pdfBase64 }, getAuthHeaders());
  return response.data;
};
