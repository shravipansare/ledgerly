import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, CheckCircle2, Upload, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTaxes, createTax, deleteTax } from "@/lib/taxService";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import api from "@/lib/api";

export default function Settings() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxRate, setNewTaxRate] = useState("");
  
  const [profileData, setProfileData] = useState({
    companyName: user?.companyName || "",
    companyAddress: user?.companyAddress || "",
    companyPhone: user?.companyPhone || "",
    companyTaxId: user?.companyTaxId || "",
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage({ type: "", text: "" });
    
    try {
      const res = await api.put("/users/profile", profileData);
      updateUser(res.data.user);
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.response?.data?.error || "Failed to update profile." });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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
        
        {/* Company Profile Configuration Panel */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Company Profile</h3>
            <p className="text-sm text-slate-500">These details will automatically appear on your generated invoices and quotations.</p>
          </div>
          
          <div className="p-6">
            {profileMessage.text && (
              <div className={`mb-6 p-3 rounded-md text-sm ${profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {profileMessage.text}
              </div>
            )}
            
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Business Name</Label>
                  <Input 
                    id="companyName" 
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="companyPhone">Business Phone</Label>
                  <Input 
                    id="companyPhone" 
                    value={profileData.companyPhone}
                    onChange={(e) => setProfileData({...profileData, companyPhone: e.target.value})}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="companyTaxId">Tax ID / GSTIN / PAN</Label>
                  <Input 
                    id="companyTaxId" 
                    value={profileData.companyTaxId}
                    onChange={(e) => setProfileData({...profileData, companyTaxId: e.target.value})}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                  />
                </div>
                
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="companyAddress">Business Address</Label>
                  <Input 
                    id="companyAddress" 
                    value={profileData.companyAddress}
                    onChange={(e) => setProfileData({...profileData, companyAddress: e.target.value})}
                    placeholder="e.g. 123 Tech Avenue, Mumbai, MH 400001"
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Profile</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
