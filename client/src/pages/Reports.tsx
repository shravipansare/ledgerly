import { useQuery } from "@tanstack/react-query";
import { Download, PieChart, TrendingUp, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportsData } from "@/lib/reportService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Reports() {
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["reportsData"],
    queryFn: getReportsData,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleExportCSV = () => {
    if (!reportsData) return;
    
    // Simple CSV Export for Revenue by Client
    const headers = ["Client Name", "Total Revenue", "Outstanding", "Invoices"];
    const rows = reportsData.clientRevenue.map(c => [
      c.name,
      c.totalRevenue.toString(),
      c.outstanding.toString(),
      c.invoiceCount.toString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "client_revenue_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-8 max-h-screen overflow-auto bg-[#f8fafc]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports</h2>
          <p className="text-slate-500">Analyze your revenue, taxes, and client performance.</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="bg-white border-slate-300 text-slate-700 shadow-sm hover:bg-slate-50">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Gross Revenue</h3>
          </div>
          <p className="text-[28px] font-extrabold text-slate-900">
            {isLoading ? "..." : formatCurrency(reportsData?.summary.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <PieChart className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Tax Collected</h3>
          </div>
          <p className="text-[28px] font-extrabold text-slate-900">
            {isLoading ? "..." : formatCurrency(reportsData?.summary.totalTaxCollected || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Outstanding</h3>
          </div>
          <p className="text-[28px] font-extrabold text-slate-900">
            {isLoading ? "..." : formatCurrency(reportsData?.summary.outstandingAmount || 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Total Invoices</h3>
          </div>
          <p className="text-[28px] font-extrabold text-slate-900">
            {isLoading ? "..." : (reportsData?.summary.totalInvoices || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Trend Chart */}
        <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-800">Revenue Trend (12 Months)</h3>
            <p className="text-sm text-slate-500">Monthly revenue growth</p>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">Loading chart data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportsData?.revenueTrend?.slice().reverse() || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '10px 14px', fontSize: '13px' }}
                    formatter={(value: number) => [<span className="font-bold text-slate-900">{formatCurrency(value)}</span>, <span className="text-slate-500 font-medium">Revenue</span>]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Client Revenue Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h3 className="text-base font-bold text-slate-800">Revenue by Client</h3>
            <p className="text-sm text-slate-500">Your top performing clients</p>
          </div>
          <div className="flex-1 overflow-auto max-h-[300px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Client</TableHead>
                  <TableHead className="font-semibold text-slate-600">Invoices</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">Outstanding</TableHead>
                  <TableHead className="font-semibold text-slate-600 text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500 font-medium">
                      Loading client data...
                    </TableCell>
                  </TableRow>
                ) : reportsData?.clientRevenue?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500 font-medium">
                      No client revenue data available
                    </TableCell>
                  </TableRow>
                ) : (
                  reportsData?.clientRevenue?.map((client) => (
                    <TableRow key={client.id} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-slate-900">{client.name}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{client.invoiceCount}</TableCell>
                      <TableCell className="text-right text-slate-600 font-medium">{formatCurrency(client.outstanding)}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">{formatCurrency(client.totalRevenue)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </div>
  );
}
