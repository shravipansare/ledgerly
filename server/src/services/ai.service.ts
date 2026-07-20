// This is a Mock AI Service for demonstration purposes.
// In a production environment, this would call OpenAI or Gemini APIs with strict JSON schemas.

interface AIParsedIntent {
  action: "CREATE_INVOICE" | "CREATE_QUOTATION" | "UNKNOWN";
  clientName?: string;
  totalAmount?: number;
  description?: string;
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
      const clientMatch = text.match(/for\s+([A-Za-z\s]+?)(?:\s+for|\s+\$|\s+₹|$)/);
      if (clientMatch) {
        intent.clientName = clientMatch[1].trim();
      }
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
