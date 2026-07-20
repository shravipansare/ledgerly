import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuotationById, updateQuotationStatus, convertQuotationToInvoice } from "@/lib/quotationService";
import { ArrowLeft, CheckCircle2, Download, XCircle, FileText, Share2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const quotationRef = useRef<HTMLDivElement>(null);

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: () => getQuotationById(id as string),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateQuotationStatus({ id: id as string, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotation", id] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: () => convertQuotationToInvoice(id as string),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      // Navigate to the newly created invoice
      navigate(`/dashboard/invoices/${data.invoice.id}`);
    },
  });

  const handleMarkAsAccepted = () => {
    updateStatusMutation.mutate("ACCEPTED");
  };

  const handleMarkAsRejected = () => {
    updateStatusMutation.mutate("REJECTED");
  };

  const handleConvertToInvoice = () => {
    if (confirm("Are you sure you want to convert this quotation into a live invoice?")) {
      convertMutation.mutate();
    }
  };

  const handleDownloadPDF = async () => {
    if (!quotationRef.current) return;
    
    const canvas = await html2canvas(quotationRef.current, {
      scale: 2, 
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Quotation-${quotation?.quotationNumber || 'Download'}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500 font-medium">Loading quotation details...</p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500 font-medium mb-4">Quotation not found</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/quotations")}>
          Back to Quotations
        </Button>
      </div>
    );
  }

  const isAccepted = quotation.status === "ACCEPTED";
  const isRejected = quotation.status === "REJECTED";

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f8fafc] overflow-auto">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/quotations")} className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Estimate {quotation.quotationNumber}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                  isAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  isRejected ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {quotation.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>

          {!isAccepted && !isRejected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
                  Change Status
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAsAccepted} className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Accepted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAsRejected} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
            onClick={handleConvertToInvoice} 
            disabled={convertMutation.isPending}
          >
            <FileText className="w-4 h-4 mr-2" />
            {convertMutation.isPending ? "Converting..." : "Convert to Invoice"}
          </Button>
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="p-8 flex justify-center pb-24">
        {/* The Actual Quotation Document (A4 format) */}
        <div 
          ref={quotationRef}
          className="bg-white p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 w-full max-w-[850px] min-h-[1100px] text-slate-800"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-1">QUOTATION</h2>
              <p className="text-slate-500 font-medium">No. {quotation.quotationNumber}</p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-slate-800 text-lg">MartechAdda</h3>
              <p className="text-sm text-slate-500 mt-1">123 Tech Avenue</p>
              <p className="text-sm text-slate-500">Business City, 10001</p>
              <p className="text-sm text-slate-500 mt-1">contact@martechadda.com</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="flex justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quote For</p>
              <h3 className="font-bold text-slate-800 text-base">{quotation.client?.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{quotation.client?.email}</p>
              {quotation.client?.phone && <p className="text-sm text-slate-600">{quotation.client?.phone}</p>}
              {quotation.client?.billingAddress && <p className="text-sm text-slate-600 mt-1 max-w-[200px]">{quotation.client?.billingAddress}</p>}
            </div>
            
            <div className="text-right flex flex-col gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(quotation.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Until</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(quotation.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-[40%]">Description</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right">Tax</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-4 px-4 text-right text-slate-600">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-slate-600">₹{item.unitPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-slate-500 text-xs">{item.appliedTaxName || "-"}</td>
                    <td className="py-4 px-4 text-right text-slate-800 font-bold">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-72">
              <div className="flex justify-between py-2 text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-200 mb-2">
                <span>Tax</span>
                <span className="font-medium">₹{quotation.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>₹{quotation.total.toFixed(2)}</span>
              </div>
              
              {isAccepted && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center gap-2 text-emerald-700">
                   <CheckCircle2 className="w-5 h-5" />
                   <span className="font-bold">QUOTATION ACCEPTED</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer/Notes */}
          {quotation.notes && (
            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes & Terms</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{quotation.notes}</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
