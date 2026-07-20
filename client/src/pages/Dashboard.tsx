import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Activity, 
  DollarSign, 
  PieChart, 
  Package, 
  Receipt,
  FileSignature,
  ShieldCheck,
  Bell
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getDashboardData } from "@/lib/dashboardService";
import AIAssistant from "@/components/AIAssistant";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Fetch Dashboard Data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: getDashboardData,
    // Only fetch if we are exactly on the /dashboard route
    enabled: location.pathname === "/dashboard"
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-700';
      case 'SENT': return 'bg-blue-100 text-blue-700';
      case 'PAID': return 'bg-emerald-100 text-emerald-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-800">
      {/* Sidebar - Polished Enterprise Style */}
      <aside className="w-[240px] bg-white/80 backdrop-blur-md border-r border-slate-200/50 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100/50">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto px-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main Menu</div>
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <LayoutDashboard className={`w-[18px] h-[18px] ${isActive('/dashboard') ? 'text-indigo-600' : ''}`} />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <FileText className={`w-[18px] h-[18px] ${isActive('/dashboard/invoices') ? 'text-indigo-600' : ''}`} />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/clients') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Users className={`w-[18px] h-[18px] ${isActive('/dashboard/clients') ? 'text-indigo-600' : ''}`} />
            Customers
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/products') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Package className={`w-[18px] h-[18px] ${isActive('/dashboard/products') ? 'text-indigo-600' : ''}`} />
            Products & Services
          </Link>
          <Link to="/dashboard/quotations" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/quotations') || isActive('/dashboard/quotations/new') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <FileSignature className={`w-[18px] h-[18px] ${isActive('/dashboard/quotations') ? 'text-indigo-600' : ''}`} />
            Quotations
          </Link>
          <Link to="/dashboard/expenses" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/expenses') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Receipt className={`w-[18px] h-[18px] ${isActive('/dashboard/expenses') ? 'text-indigo-600' : ''}`} />
            Expenses
          </Link>
          <Link to="/dashboard/reports" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/reports') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <PieChart className={`w-[18px] h-[18px] ${isActive('/dashboard/reports') ? 'text-indigo-600' : ''}`} />
            Reports
          </Link>
          
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">System</div>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-auto ${isActive('/dashboard/settings') ? 'bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Settings className={`w-[18px] h-[18px] ${isActive('/dashboard/settings') ? 'text-indigo-600' : ''}`} />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100/50 bg-slate-50/30 m-3 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden mesh-bg">
        {/* Header */}
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm/50">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Financial Overview</h1>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Help & Support</button>
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Page Content with Animation Wrapper */}
        <div className="flex-1 overflow-auto animate-fade-in relative z-0">
          {location.pathname === "/dashboard" ? (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: dashboardData?.metrics?.totalRevenue || 0, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50", delay: "0.1s" },
                  { label: "Outstanding", value: dashboardData?.metrics?.outstandingAmount || 0, icon: Activity, color: "text-orange-600", bg: "bg-orange-50", delay: "0.2s" },
                  { label: "Paid Invoices", value: dashboardData?.metrics?.paidCount || 0, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", delay: "0.3s" },
                  { label: "Active Clients", value: dashboardData?.metrics?.totalClients || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50", delay: "0.4s" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: stat.delay }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 ${stat.bg} ${stat.color} rounded-lg`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</h3>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {isLoading ? "..." : stat.label === "Total Revenue" || stat.label === "Outstanding" ? formatCurrency(stat.value) : stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Main Charts & Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Revenue Overview</h3>
                      <p className="text-sm text-slate-500">Monthly revenue for the last 6 months</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart data...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value/1000}k`} />
                          <Tooltip 
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                          />
                          <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-2xl p-0 flex flex-col border border-slate-200">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-8 text-center text-slate-400">Loading...</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {dashboardData?.recentActivity?.map((invoice: any) => (
                          <div key={invoice.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between group cursor-pointer border-b border-slate-50 last:border-0" onClick={() => navigate('/dashboard/invoices')}>
                            <div>
                              <p className="font-bold text-slate-900 text-[14px] group-hover:text-indigo-600 transition-colors">{invoice.client?.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[13px] font-medium text-slate-500">{invoice.invoiceNumber}</span>
                                <span className="text-slate-300 text-xs">•</span>
                                <span className="text-[13px] text-slate-500">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900 text-[15px]">{formatCurrency(invoice.total)}</p>
                              <span className={`inline-block px-2 py-0.5 mt-1.5 rounded-md text-[11px] font-bold border ${
                                invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {invoice.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50 rounded-b-xl">
                     <Link to="/dashboard/invoices" className="text-sm text-blue-600 hover:text-blue-700 font-bold transition-colors">
                        View All Invoices
                     </Link>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full">
              <Outlet />
            </div>
          )}
        </div>
      </main>
      
      {/* Global AI Assistant */}
      <AIAssistant />
    </div>
  );
}
