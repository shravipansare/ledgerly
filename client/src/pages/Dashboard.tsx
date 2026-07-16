import { ShieldCheck, LayoutDashboard, Users, FileText, Settings, LogOut, Package, ArrowUpRight, DollarSign, Activity, PieChart } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getDashboardData } from "@/lib/dashboardService";
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
      <aside className="w-[240px] bg-white border-r border-slate-200 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center shadow-sm shadow-blue-600/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto px-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main Menu</div>
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <LayoutDashboard className="w-[18px] h-[18px]" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <FileText className="w-[18px] h-[18px]" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/clients') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Users className="w-[18px] h-[18px]" />
            Customers
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/products') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Package className="w-[18px] h-[18px]" />
            Items
          </Link>
          <Link to="/dashboard/reports" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/reports') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <PieChart className="w-[18px] h-[18px]" />
            Reports
          </Link>
          
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-3">System</div>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard/settings') ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10 shadow-sm/50">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-800">Financial Overview</h1>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Help & Support</button>
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-100 transition-all">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0 p-8">
          {location.pathname === "/dashboard" ? (
            <div className="max-w-[1200px] mx-auto space-y-8">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Activity className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Receivables</h3>
                  </div>
                  <p className="text-[28px] font-extrabold text-slate-900 relative z-10">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-medium cursor-pointer hover:underline relative z-10">View Outstanding Invoices →</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <DollarSign className="w-16 h-16 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
                  </div>
                  <p className="text-[28px] font-extrabold text-slate-900 relative z-10">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2 font-medium relative z-10">Paid this fiscal year</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <FileText className="w-16 h-16 text-red-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Overdue</h3>
                  </div>
                  <p className="text-[28px] font-extrabold text-red-600 relative z-10">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                  <p className="text-xs text-red-600 mt-2 font-medium cursor-pointer hover:underline relative z-10">Send Reminders →</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Users className="w-16 h-16 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Customers</h3>
                  </div>
                  <p className="text-[28px] font-extrabold text-slate-900 relative z-10">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                  <p className="text-xs text-indigo-600 mt-2 font-medium cursor-pointer hover:underline relative z-10" onClick={() => navigate('/dashboard/clients')}>Manage Customers →</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-7 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Income and Expense</h3>
                      <p className="text-sm text-slate-500 mt-0.5">Last 6 months of financial activity</p>
                    </div>
                    <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-slate-50 font-medium cursor-pointer outline-none hover:bg-slate-100 transition-colors">
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full mt-6">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">Loading chart data...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '10px 14px', fontSize: '13px' }}
                            formatter={(value: number) => [<span className="font-bold text-slate-900">{formatCurrency(value)}</span>, <span className="text-slate-500 font-medium">Income</span>]}
                          />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center text-slate-400 py-8 text-sm font-medium">Loading transactions...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-slate-400 py-8 text-sm font-medium">No recent transactions</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {dashboardData?.recentActivity?.map((invoice: any) => (
                          <div 
                            key={invoice.id} 
                            onClick={() => navigate(`/dashboard/invoices`)}
                            className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-[14px] hover:text-blue-600 transition-colors">{invoice.client?.name}</p>
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
    </div>
  );
}
