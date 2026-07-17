import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Search, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExpenses, createExpense, deleteExpense } from "@/lib/expenseService";
import type { Expense } from "@/lib/expenseService";

const CATEGORIES = ["SOFTWARE", "MARKETING", "SALARY", "UTILITIES", "OFFICE", "TRAVEL", "OTHER"];

export default function Expenses() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "OTHER" as any,
    merchant: "",
    description: "",
  });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      alert("Error saving expense: " + (error.response?.data?.error || error.message));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const resetForm = () => {
    setFormData({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      category: "OTHER",
      merchant: "",
      description: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) {
      alert("Please enter a valid amount.");
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-6 max-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Expenses</h2>
          <p className="text-slate-500">Track and categorize money going out of your business.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Log Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your business expense.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input 
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="merchant">Merchant / Vendor</Label>
                  <Input 
                    id="merchant" 
                    placeholder="e.g. AWS, Facebook Ads"
                    value={formData.merchant}
                    onChange={(e) => setFormData({...formData, merchant: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input 
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    placeholder="What was this for?"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Saving..." : "Save Expense"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border border-slate-200 flex-1 overflow-auto shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Loading expenses...
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Receipt className="w-12 h-12 mb-4 text-slate-300" />
                    <p className="text-base font-medium text-slate-900">No expenses logged yet</p>
                    <p className="text-sm">Click "Add Expense" to track your first expenditure.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-slate-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{expense.merchant || "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md text-[11px] font-bold border bg-slate-100 text-slate-600 border-slate-200">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{expense.description || "-"}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    ₹{expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if(confirm("Are you sure you want to delete this expense?")) {
                            deleteMutation.mutate(expense.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
