import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Newspaper, 
  Image, 
  Briefcase, 
  Heart,
  DollarSign,
  Settings,
  LogOut,
  Shield
} from "lucide-react";
import { logoutAlumni } from "@/store/auth-slice";

function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAlumni());
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/alumni", icon: Users, label: "Alumni Management" },
    { path: "/admin/events", icon: Calendar, label: "Events" },
    { path: "/admin/news", icon: Newspaper, label: "News & Updates" },
    { path: "/admin/gallery", icon: Image, label: "Gallery" },
    { path: "/admin/jobs", icon: Briefcase, label: "Job Postings" },
    { path: "/admin/donations", icon: Heart, label: "Donations" },
    { path: "/admin/membership", icon: DollarSign, label: "Memberships" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>
          {user && (
            <p className="text-sm text-blue-200 mt-2">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-white text-blue-900 shadow-md"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label || "Admin Panel"}
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {user?.role?.toUpperCase()}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="px-6 py-4 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Alumni Association Admin Panel. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;