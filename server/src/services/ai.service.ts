// This is a Mock AI Service for demonstration purposes.
// In a production environment, this would call OpenAI or Gemini APIs with strict JSON schemas.

interface AIParsedIntent {
  action: "CREATE_INVOICE" | "CREATE_QUOTATION" | "LOG_EXPENSE" | "ADD_CLIENT" | "GET_REVENUE" | "UNKNOWN";
  clientName?: string;
  totalAmount?: number;
  description?: string;
  email?: string;
}

export const processNaturalLanguage = async (prompt: string, contextClients: any[]): Promise<AIParsedIntent> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const text = prompt.toLowerCase();
  
  const intent: AIParsedIntent = {
    action: "UNKNOWN"
  };

  if (text.includes("invoice") || text.includes("bill")) {
    intent.action = "CREATE_INVOICE";
  } else if (text.includes("quote") || text.includes("quotation") || text.includes("estimate")) {
    intent.action = "CREATE_QUOTATION";
  } else if (text.includes("expense") || text.includes("spent") || text.includes("spend")) {
    intent.action = "LOG_EXPENSE";
  } else if (text.includes("add client") || text.includes("new client") || text.includes("customer")) {
    intent.action = "ADD_CLIENT";
  } else if (text.includes("revenue") || text.includes("income") || text.includes("how much did i make") || text.includes("total sales")) {
    intent.action = "GET_REVENUE";
  }

  // Very naive extraction logic
  const amountMatch = text.match(/(?:for|amount)?\s?\$?₹?(\d+(?:\.\d+)?)/);
  if (amountMatch) {
    intent.totalAmount = parseFloat(amountMatch[1]);
  }

  // Try to find a matching client from context
  for (const client of contextClients) {
    if (text.includes(client.name.toLowerCase())) {
      intent.clientName = client.name;
      break;
    }
  }
  
  if (!intent.clientName) {
      // If we couldn't match a context client, try a basic regex fallback
      const clientMatch = text.match(/(?:for|named|add)\s+([A-Za-z\s]+?)(?:\s+for|\s+\$|\s+₹|\s+with|$)/);
      if (clientMatch) {
        intent.clientName = clientMatch[1].trim();
      }
  }

  // Extract email if present
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) {
    intent.email = emailMatch[1];
  }

  // Extract a description
  const descMatch = text.match(/for\s+(web design|design|development|consulting|marketing|services?)/i);
  if (descMatch) {
    intent.description = descMatch[1].trim();
  } else {
    intent.description = "Professional Services";
  }

  return intent;
};
