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
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <FileText className="w-5 h-5" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard/clients') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Users className="w-5 h-5" />
            Clients
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard/products') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${isActive('/dashboard/settings') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">Welcome back, {user?.firstName}</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-50">
          {location.pathname === "/dashboard" ? (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                  <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Collected via Paid Invoices
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-500">Outstanding</h3>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Activity className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                  <p className="text-sm text-amber-600 mt-2">
                    Awaiting Payment
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-500">Overdue</h3>
                    <div className="p-2 bg-red-50 rounded-lg">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Past Due Date
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-500">Active Clients</h3>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    In your workspace
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue Overview (Last 6 Months)</h3>
                  <div className="h-[300px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                          />
                          <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
                    <Link to="/dashboard/invoices" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center text-slate-500 py-4">Loading activity...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-slate-500 py-4">No recent invoices</div>
                    ) : (
                      dashboardData?.recentActivity?.map((invoice: any) => (
                        <div 
                          key={invoice.id} 
                          onClick={() => navigate(`/dashboard/invoices`)}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{invoice.client?.name}</p>
                            <p className="text-xs text-slate-500">{invoice.invoiceNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 text-sm">{formatCurrency(invoice.total)}</p>
                            <span className={`inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold ${getStatusColor(invoice.status)}`}>
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
