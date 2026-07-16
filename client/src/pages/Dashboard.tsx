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
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-800">
      {/* Sidebar - Enterprise Utility Style */}
      <aside className="w-[220px] bg-white border-r border-gray-200 hidden md:flex flex-col z-20 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-gray-200">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span className="text-base font-bold tracking-tight text-gray-900">MartechAdda</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col overflow-y-auto">
          <Link to="/dashboard" className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive('/dashboard') ? 'bg-blue-50/50 text-blue-700 border-l-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to="/dashboard/invoices" className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive('/dashboard/invoices') || isActive('/dashboard/invoices/new') ? 'bg-blue-50/50 text-blue-700 border-l-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
            <FileText className="w-4 h-4" />
            Invoices
          </Link>
          <Link to="/dashboard/clients" className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive('/dashboard/clients') ? 'bg-blue-50/50 text-blue-700 border-l-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
            <Users className="w-4 h-4" />
            Customers
          </Link>
          <Link to="/dashboard/products" className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive('/dashboard/products') ? 'bg-blue-50/50 text-blue-700 border-l-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
            <Package className="w-4 h-4" />
            Items
          </Link>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/dashboard/settings" className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive('/dashboard/settings') ? 'bg-blue-50/50 text-blue-700 border-l-4 border-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}>
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-xs">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs text-gray-600 hover:text-red-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-blue-600 hover:underline">Help</button>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-sm cursor-pointer border border-blue-200">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto relative z-0 p-6">
          {location.pathname === "/dashboard" ? (
            <div className="max-w-[1200px] mx-auto space-y-6">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Receivables</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.outstandingAmount || 0)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-medium cursor-pointer hover:underline">View Outstanding Invoices →</p>
                </div>

                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Revenue</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">Paid this fiscal year</p>
                </div>

                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Overdue</h3>
                  <p className="text-2xl font-semibold text-red-600">
                    {isLoading ? "..." : formatCurrency(dashboardData?.metrics.overdueAmount || 0)}
                  </p>
                  <p className="text-xs text-red-600 mt-2 font-medium cursor-pointer hover:underline">Send Reminders →</p>
                </div>

                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Customers</h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {isLoading ? "..." : (dashboardData?.metrics.totalClients || 0)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-medium cursor-pointer hover:underline" onClick={() => navigate('/dashboard/clients')}>Manage Customers →</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-sm border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <h3 className="text-sm font-semibold text-gray-800">Income and Expense</h3>
                    <select className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-600 bg-white cursor-pointer outline-none">
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-[280px] w-full mt-4">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Loading chart data...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
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
                            contentStyle={{ borderRadius: '4px', border: '1px solid #d1d5db', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '8px 12px', fontSize: '12px' }}
                            formatter={(value: number) => [<span className="font-semibold text-gray-900">{formatCurrency(value)}</span>, <span className="text-gray-500">Income</span>]}
                          />
                          <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-800">Recent Transactions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center text-gray-400 py-8 text-sm">Loading transactions...</div>
                    ) : dashboardData?.recentActivity?.length === 0 ? (
                      <div className="text-center text-gray-400 py-8 text-sm">No recent transactions</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {dashboardData?.recentActivity?.map((invoice: any) => (
                          <div 
                            key={invoice.id} 
                            onClick={() => navigate(`/dashboard/invoices`)}
                            className="flex items-center justify-between p-4 hover:bg-blue-50/30 cursor-pointer transition-colors"
                          >
                            <div>
                              <p className="font-medium text-gray-900 text-sm hover:text-blue-600">{invoice.client?.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{invoice.invoiceNumber}</span>
                                <span className="text-gray-300 text-xs">•</span>
                                <span className="text-xs text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 text-sm">{formatCurrency(invoice.total)}</p>
                              <span className={`inline-block px-1.5 py-0.5 mt-1 rounded-sm text-[10px] font-medium border ${
                                invoice.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' :
                                invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}>
                                {invoice.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center bg-gray-50/50">
                     <Link to="/dashboard/invoices" className="text-xs text-blue-600 hover:underline font-medium">
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
