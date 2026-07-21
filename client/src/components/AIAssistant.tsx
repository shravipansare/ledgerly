import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hi! I am your Ledgerly AI Assistant. Try saying: "Create an invoice for ABC Corp for ₹5000".' }
  ]);
  
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/process",
        { prompt: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: 'ai', text: res.data.message }]);
      
      // Give the user a moment to read the success message, then navigate
      setTimeout(() => {
        if (res.data.type === "invoice") {
          navigate(`/dashboard/invoices/${res.data.data.id}`);
          setIsOpen(false);
        } else if (res.data.type === "quotation") {
          navigate(`/dashboard/quotations/${res.data.data.id}`);
          setIsOpen(false);
        } else if (res.data.type === "client") {
          navigate(`/dashboard/clients`);
          setIsOpen(false);
        } else if (res.data.type === "expense") {
          navigate(`/dashboard/expenses`);
          setIsOpen(false);
        }
      }, 1500);

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Sorry, I couldn't process that request right now.";
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-300 z-50 flex items-center justify-center 
          ${isOpen ? 'bg-slate-800 text-white rotate-90 scale-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-110'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[450px] bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl flex flex-col z-50 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3 shrink-0">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Ledgerly AI</h3>
              <p className="text-indigo-100 text-xs opacity-90">Powered by Ledgerly</p>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="text-xs font-medium text-slate-500">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 shrink-0 flex items-center gap-2">
            <Input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create an invoice for ABC for ₹5000..."
              className="border-none bg-slate-100/50 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-full"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !prompt.trim()} 
              className="shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
