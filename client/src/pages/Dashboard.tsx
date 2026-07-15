import { ShieldCheck, LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";
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

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Ledgerly</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors">
            <FileText className="w-5 h-5" />
            Invoices
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors">
            <Users className="w-5 h-5" />
            Clients
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
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
      </main>
    </div>
  );
}
