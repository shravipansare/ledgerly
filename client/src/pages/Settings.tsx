import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTaxes, createTax, deleteTax } from "@/lib/taxService";

export default function Settings() {
  const queryClient = useQueryClient();
  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxRate, setNewTaxRate] = useState("");

  const { data: taxes = [], isLoading } = useQuery({
    queryKey: ["taxes"],
    queryFn: getTaxes,
  });

  const createMutation = useMutation({
    mutationFn: createTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      setNewTaxName("");
      setNewTaxRate("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
    },
  });

  const handleAddTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxName || !newTaxRate) return;
    createMutation.mutate({
      name: newTaxName,
      rate: parseFloat(newTaxRate),
      isActive: true,
    });
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-6 max-h-screen overflow-auto bg-[#f8fafc]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
          <p className="text-slate-500">Manage your application preferences and configurations.</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">
        
        {/* Tax Rates Configuration Panel */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Tax Rates</h3>
            <p className="text-sm text-slate-500">Configure global tax rates to use in products and invoices.</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleAddTax} className="flex gap-4 items-end mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-1 grid gap-2">
                <Label htmlFor="taxName">Tax Name (e.g. GST 18%)</Label>
                <Input 
                  id="taxName" 
                  value={newTaxName}
                  onChange={(e) => setNewTaxName(e.target.value)}
                  placeholder="VAT 5%"
                  required
                />
              </div>
              <div className="w-32 grid gap-2">
                <Label htmlFor="taxRate">Rate (%)</Label>
                <Input 
                  id="taxRate" 
                  type="number" 
                  step="0.01"
                  value={newTaxRate}
                  onChange={(e) => setNewTaxRate(e.target.value)}
                  placeholder="5.0"
                  required
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-10" disabled={createMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tax
              </Button>
            </form>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Active Tax Rates</h4>
              {isLoading ? (
                <p className="text-slate-500 text-sm">Loading tax rates...</p>
              ) : taxes.length === 0 ? (
                <p className="text-slate-500 text-sm">No tax rates defined yet.</p>
              ) : (
                <div className="grid gap-3">
                  {taxes.map(tax => (
                    <div key={tax.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-md">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tax.name}</p>
                          <p className="text-sm text-slate-500">{tax.rate}%</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(tax.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Placeholder for future settings */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-60">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Company Profile</h3>
            <p className="text-sm text-slate-500">Coming soon.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
