import { ShieldCheck, LayoutDashboard, Users, FileText, Settings, LogOut, Package } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Ledgerly</span>
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-900">Welcome back, {user?.firstName}</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        {location.pathname === "/dashboard" ? (
          <div className="flex-1 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">$0.00</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Outstanding Invoices</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Active Clients</h3>
                <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
