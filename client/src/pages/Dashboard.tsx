import { ShieldCheck, LayoutDashboard, Users, FileText, Settings, LogOut, Package, ArrowUpRight, DollarSign, Activity } from "lucide-react";
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
    <div className="min-h-screen flex bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar - Modern Catalyst Style */}
      <aside className="w-[280px] bg-slate-50 border-r border-slate-200 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-200/50">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 px-4 py-8 flex flex-col gap-1.5 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-4">Overview</div>
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard') ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'}`}>
            <FileText className="w-4 h-4" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard/clients') ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'}`}>
            <Users className="w-4 h-4" />
            Clients
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard/products') ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'}`}>
            <Package className="w-4 h-4" />
            Products & Services
          </Link>
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-8 px-4">Settings</div>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive('/dashboard/settings') ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'}`}>
            <Settings className="w-4 h-4" />
            Preferences
          </Link>
        </nav>
        
        <div className="p-4 m-4 mt-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-sm">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors border border-slate-200">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-xl flex items-center justify-between px-10 flex-shrink-0 z-10 sticky top-0 border-b border-slate-200">
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Here is what's happening with your finances today.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">Help Center</button>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 cursor-pointer hover:-translate-y-0.5 transition-transform">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0">
          {location.pathname === "/dashboard" ? (
            <div className="p-10 max-w-[1400px] mx-auto space-y-8">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">Collected successfully</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Outstanding</h3>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-amber-600 bg-amber-50 w-fit px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">Awaiting payment</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overdue</h3>
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-red-600 bg-red-50 w-fit px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">Requires attention</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Clients</h3>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-slate-600 bg-slate-100 w-fit px-2.5 py-1 rounded-lg">
                    <span className="flex items-center gap-1">Total in workspace</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="xl:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900">Revenue Overview</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Earnings collected over the last 6 months</p>
                  </div>
                  <div className="h-[320px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-bold">Loading chart...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                            dy={15}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            formatter={(value: number) => [<span className="font-extrabold text-slate-900 text-lg">{formatCurrency(value)}</span>, <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">Revenue</span>]}
                          />
                          <defs>
                            <linearGradient id="colorRevenueModern" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity={1}/>
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <Bar dataKey="revenue" fill="url(#colorRevenueModern)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Latest generated invoices</p>
                    </div>
                    <Link to="/dashboard/invoices" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {isLoading ? (
                      <div className="text-center text-slate-400 py-8 text-sm font-bold">Loading...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-slate-400 py-8 text-sm font-bold">No recent activity</div>
                    ) : (
                      dashboardData?.recentActivity?.map((invoice: any) => (
                        <div 
                          key={invoice.id} 
                          onClick={() => navigate(`/dashboard/invoices`)}
                          className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{invoice.client?.name}</p>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">{invoice.invoiceNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-slate-900 text-sm">{formatCurrency(invoice.total)}</p>
                            <span className={`inline-block px-2 py-1 mt-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                              invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                              invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
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
