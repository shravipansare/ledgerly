import { useQuery } from "@tanstack/react-query";
import { Plus, Search, FileSignature } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { getQuotations } from "@/lib/quotationService";

export default function Quotations() {
  const navigate = useNavigate();
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: getQuotations,
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700';
      case 'SENT': return 'bg-blue-100 text-blue-700';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'EXPIRED': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-6 max-h-screen overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quotations & Estimates</h2>
          <p className="text-slate-500">Create and send estimates to potential clients.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/dashboard/quotations/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quotation
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input placeholder="Search quotations..." className="pl-8 bg-white" />
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0">
            <TableRow>
              <TableHead>Quotation No.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Loading quotations...
                </TableCell>
              </TableRow>
            ) : quotations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <FileSignature className="h-8 w-8 mb-2 text-slate-300" />
                    <p>No quotations found. Create your first estimate!</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              quotations.map((quotation: any) => (
                <TableRow key={quotation.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/dashboard/quotations/${quotation.id}`)}>
                  <TableCell className="font-medium text-slate-900">{quotation.quotationNumber}</TableCell>
                  <TableCell>{quotation.client?.name}</TableCell>
                  <TableCell>{new Date(quotation.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{quotation.total.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
