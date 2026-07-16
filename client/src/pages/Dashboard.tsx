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
  return (
    <div className="min-h-screen flex bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* Sidebar - Vercel Style */}
      <aside className="w-[240px] bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
        <div className="h-14 flex items-center gap-3 px-6 border-b border-gray-200">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">MartechAdda</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
            <FileText className="w-4 h-4" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard/clients') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
            <Users className="w-4 h-4" />
            Clients
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard/products') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
            <Package className="w-4 h-4" />
            Products
          </Link>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive('/dashboard/settings') ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}>
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-black text-white flex items-center justify-center font-medium text-xs">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-black truncate">{user?.firstName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAFA]">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">MartechAdda</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-black">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-black transition-colors">Feedback</button>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-medium text-xs cursor-pointer hover:opacity-80 transition-opacity">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0">
          {location.pathname === "/dashboard" ? (
            <div className="p-8 max-w-[1000px] mx-auto space-y-8">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight text-black">Overview</h2>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex flex-col hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <h3 className="text-sm font-medium">Total Revenue</h3>
                  </div>
                  <p className="text-3xl font-semibold text-black tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex flex-col hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <h3 className="text-sm font-medium">Outstanding</h3>
                  </div>
                  <p className="text-3xl font-semibold text-black tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex flex-col hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <h3 className="text-sm font-medium">Overdue</h3>
                  </div>
                  <p className="text-3xl font-semibold text-black tracking-tight">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex flex-col hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 mb-3">
                    <h3 className="text-sm font-medium">Clients</h3>
                  </div>
                  <p className="text-3xl font-semibold text-black tracking-tight">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-black">Revenue</h3>
                  </div>
                  <div className="h-[250px] w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Loading chart...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#888', fontSize: 12 }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#888', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            cursor={{ fill: '#fafafa' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                            formatter={(value: number) => [<span className="font-semibold text-black">{formatCurrency(value)}</span>, <span className="text-gray-500 text-sm">Revenue</span>]}
                          />
                          <Bar dataKey="revenue" fill="#000" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-black">Recent Activity</h3>
                    <Link to="/dashboard/invoices" className="text-xs text-gray-500 hover:text-black transition-colors">
                      View All
                    </Link>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {isLoading ? (
                      <div className="text-center text-gray-400 py-8 text-sm">Loading...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-sm">No recent activity</div>
                    ) : (
                      dashboardData?.recentActivity?.map((invoice: any) => (
                        <div 
                          key={invoice.id} 
                          onClick={() => navigate(`/dashboard/invoices`)}
                          className="flex items-center justify-between py-2 cursor-pointer group"
                        >
                          <div>
                            <p className="font-medium text-black text-sm group-hover:underline decoration-gray-300 underline-offset-4">{invoice.client?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{invoice.invoiceNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-black text-sm">{formatCurrency(invoice.total)}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
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
