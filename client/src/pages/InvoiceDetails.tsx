import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInvoiceById, updateInvoiceStatus, sendInvoiceEmail } from "@/lib/invoiceService";
import { ArrowLeft, CheckCircle2, Download, Printer, Mail, MessageCircle, Share2, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id as string),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateInvoiceStatus(id as string, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // Refresh dashboard metrics
    },
  });

  const handleMarkAsPaid = () => {
    updateStatusMutation.mutate("PAID");
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    // Create a canvas from the invoice DOM element
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2, // Higher resolution
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
    pdf.save(`Invoice-${invoice?.invoiceNumber || 'Download'}.pdf`);
  };

  const handleEmailShare = async () => {
    if (!invoice || !invoice.client || !invoiceRef.current) return;
    
    setIsEmailSending(true);
    try {
      // 1. Generate the PDF
      const canvas = await html2canvas(invoiceRef.current, {
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
      
      // 2. Get base64 string
      const pdfBase64 = pdf.output("datauristring");
      
      // 3. Send to our backend
      await sendInvoiceEmail(invoice.id, pdfBase64);
      
      alert("Email sent successfully via SMTP!");
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email: " + (error.response?.data?.error || error.message));
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!invoice || !invoice.client) return;
    const phone = invoice.client.phone ? invoice.client.phone.replace(/\D/g, '') : '';
    const text = encodeURIComponent(`Hello ${invoice.client.name}, this is a reminder for Invoice No. ${invoice.invoiceNumber} for the amount of ₹${invoice.total.toFixed(2)}. Thank you for your business!`);
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500 font-medium">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc]">
        <p className="text-slate-500 font-medium mb-4">Invoice not found</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/invoices")}>
          Back to Invoices
        </Button>
      </div>
    );
  }

  const isPaid = invoice.status === "PAID";

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f8fafc] overflow-auto">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/invoices")} className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Invoice {invoice.invoiceNumber}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                  isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {invoice.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEmailShare} disabled={isEmailSending} className="cursor-pointer py-2">
                {isEmailSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" /> : <Mail className="w-4 h-4 mr-2" />}
                {isEmailSending ? "Sending..." : "Send via Email"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer py-2 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send via WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {!isPaid && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={handleMarkAsPaid} disabled={updateStatusMutation.isPending}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {updateStatusMutation.isPending ? "Updating..." : "Mark as Paid"}
            </Button>
          )}
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="p-8 flex justify-center pb-24">
        {/* The Actual Invoice Document (A4 format) */}
        <div 
          ref={invoiceRef}
          className="bg-white p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 w-full max-w-[850px] min-h-[1100px] text-slate-800"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-1">INVOICE</h2>
              <p className="text-slate-500 font-medium">No. {invoice.invoiceNumber}</p>
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="font-bold text-slate-800 text-base">{invoice.client?.name}</h3>
              <p className="text-sm text-slate-600 mt-1">{invoice.client?.email}</p>
              {invoice.client?.phone && <p className="text-sm text-slate-600">{invoice.client?.phone}</p>}
              {invoice.client?.billingAddress && <p className="text-sm text-slate-600 mt-1 max-w-[200px]">{invoice.client?.billingAddress}</p>}
            </div>
            
            <div className="text-right flex flex-col gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</p>
                <p className="text-sm font-semibold text-slate-800">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-[50%]">Description</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Rate</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-4 px-4 text-right text-slate-600">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-slate-600">₹{item.unitPrice.toFixed(2)}</td>
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
                <span className="font-medium">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-200 mb-2">
                <span>Tax</span>
                <span className="font-medium">₹{invoice.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold text-slate-800">
                <span>Total</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
              
              {isPaid && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center gap-2 text-emerald-700">
                   <CheckCircle2 className="w-5 h-5" />
                   <span className="font-bold">PAID IN FULL</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer/Notes */}
          {invoice.notes && (
            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes & Terms</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
