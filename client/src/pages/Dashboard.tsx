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
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans selection:bg-blue-100">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-200/50">
          <ShieldCheck className="w-5 h-5 text-gray-900" />
          <span className="text-lg font-semibold tracking-tight text-gray-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Main</div>
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <FileText className="w-4 h-4" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/clients') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Users className="w-4 h-4" />
            Clients
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/products') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Package className="w-4 h-4" />
            Products & Services
          </Link>
          
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-3">System</div>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded bg-gray-100 text-gray-700 border border-gray-200 flex items-center justify-center font-medium text-xs">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors border border-transparent hover:border-gray-200">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Overview</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Support</button>
            <div className="w-px h-4 bg-gray-200"></div>
            <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900">Sign out</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0">
          {location.pathname === "/dashboard" ? (
            <div className="p-8 max-w-[1200px] mx-auto space-y-6">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Total Revenue</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Activity className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Outstanding</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <FileText className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Overdue</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Users className="w-4 h-4" />
                    <h3 className="text-sm font-medium">Active Clients</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-900">Revenue Overview</h3>
                  </div>
                  <div className="h-[300px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Loading chart...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{ borderRadius: '6px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                            formatter={(value: number) => [<span className="font-semibold text-gray-900">{formatCurrency(value)}</span>, <span className="text-gray-500 text-sm">Revenue</span>]}
                          />
                          <Bar dataKey="revenue" fill="#111827" radius={[2, 2, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-900">Recent Invoices</h3>
                    <Link to="/dashboard/invoices" className="text-xs font-medium text-gray-500 hover:text-gray-900">
                      View all
                    </Link>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1">
                    {isLoading ? (
                      <div className="text-center text-gray-400 py-8 text-sm">Loading activity...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-sm">No recent invoices</div>
                    ) : (
                      dashboardData?.recentActivity?.map((invoice: any) => (
                        <div 
                          key={invoice.id} 
                          onClick={() => navigate(`/dashboard/invoices`)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{invoice.client?.name}</p>
                            <p className="text-[11px] text-gray-500">{invoice.invoiceNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 text-sm">{formatCurrency(invoice.total)}</p>
                            <span className={`inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-medium ${
                              invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                              invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
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
