import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getClients } from "@/lib/clientService";
import { getProducts } from "@/lib/productService";
import { getTaxes } from "@/lib/taxService";
import { createQuotation } from "@/lib/quotationService";

export default function CreateQuotation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [clientId, setClientId] = useState("");
  const [quotationNumber, setQuotationNumber] = useState(`EST-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Default valid Until to 30 days from now
  const defaultValid = new Date();
  defaultValid.setDate(defaultValid.getDate() + 30);
  const [validUntil, setValidUntil] = useState(defaultValid.toISOString().split("T")[0]);
  
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<any[]>([
    { id: 1, productId: "", description: "", quantity: 1, unitPrice: 0, total: 0, taxRateId: "" }
  ]);

  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: getClients });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const { data: taxes = [] } = useQuery({ queryKey: ["taxes"], queryFn: getTaxes });

  const createMutation = useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      navigate("/dashboard/quotations");
    },
  });

  // Derived calculations
  const { subtotal, taxTotal, total } = useMemo(() => {
    let sub = 0;
    let tax = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      sub += itemSubtotal;
      
      const taxRateObj = taxes.find((t: any) => t.id === item.taxRateId);
      if (taxRateObj) {
        tax += itemSubtotal * (taxRateObj.rate / 100);
      } else {
        const product = products.find((p: any) => p.id === item.productId);
        if (product && product.taxCategory && !isNaN(parseFloat(product.taxCategory))) {
           tax += itemSubtotal * (parseFloat(product.taxCategory) / 100);
        }
      }
    });

    return {
      subtotal: sub,
      taxTotal: tax,
      total: sub + tax
    };
  }, [items, products, taxes]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), productId: "", description: "", quantity: 1, unitPrice: 0, total: 0, taxRateId: "" }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Auto-fill price and description if product is selected
        if (field === "productId") {
          const product = products.find((p: any) => p.id === value);
          if (product) {
            updated.unitPrice = product.price;
            updated.description = product.name;
            if (taxes.find((t: any) => t.id === product.taxCategory)) {
              updated.taxRateId = product.taxCategory;
            }
          }
        }
        
        // Recalculate total for this line
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert("Please select a client.");
      return;
    }
    
    createMutation.mutate({
      clientId,
      quotationNumber,
      issueDate,
      validUntil,
      notes,
      subtotal,
      taxTotal,
      total,
      status: "DRAFT",
      items: items.map(item => {
        const taxRateObj = taxes.find((t: any) => t.id === item.taxRateId);
        return {
          productId: item.productId || undefined,
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.total),
          appliedTaxName: taxRateObj ? taxRateObj.name : undefined,
          appliedTaxRate: taxRateObj ? taxRateObj.rate : undefined,
        };
      })
    });
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/quotations")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create Quotation</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Bill To (Client)</Label>
                <select 
                  id="client"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  disabled={clients.length === 0}
                >
                  <option value="" disabled>
                    {clients.length === 0 ? "No clients found - Create a client first!" : "Select a client..."}
                  </option>
                  {clients.map((client: any) => (
                    <option key={client.id} value={client.id}>{client.name} - {client.email}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes to Client</Label>
                <Input 
                  id="notes" 
                  placeholder="Thank you for considering our services!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="quotationNumber">Quotation Number</Label>
                <Input 
                  id="quotationNumber" 
                  required
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input 
                    id="issueDate" 
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input 
                    id="validUntil" 
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Line Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 w-[20%]">Product/Service</th>
                    <th className="px-4 py-3 w-[25%]">Description</th>
                    <th className="px-4 py-3 w-20">Qty</th>
                    <th className="px-4 py-3 w-24">Price</th>
                    <th className="px-4 py-3 w-[15%]">Tax</th>
                    <th className="px-4 py-3 w-24">Total</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((item, index) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3">
                        <select 
                          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          value={item.productId}
                          onChange={(e) => handleItemChange(item.id, "productId", e.target.value)}
                        >
                          <option value="">Custom Item</option>
                          {products.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          placeholder="Item description" 
                          className="h-9"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          type="number" 
                          min="1" 
                          className="h-9"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="h-9"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select 
                          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          value={item.taxRateId || ""}
                          onChange={(e) => handleItemChange(item.id, "taxRateId", e.target.value)}
                        >
                          <option value="">No Tax</option>
                          {taxes.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        ₹{item.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Totals Section */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Estimated Tax</span>
                  <span>₹{taxTotal.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-lg text-slate-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/quotations")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createMutation.isPending ? "Generating..." : "Generate Quotation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
