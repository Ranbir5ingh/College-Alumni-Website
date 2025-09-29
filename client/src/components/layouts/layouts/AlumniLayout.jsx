// components/layouts/AlumniLayout.jsx
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { 
  LayoutDashboard, 
  User, 
  Users, 
  Calendar, 
  Newspaper, 
  Image, 
  Briefcase, 
  Heart,
  LogOut 
} from "lucide-react";
import { logoutAlumni } from "@/store/auth-slice";

function AlumniLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAlumni());
    navigate("/");
  };

  const menuItems = [
    { path: "/alumni/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/alumni/profile", icon: User, label: "Profile" },
    { path: "/alumni/directory", icon: Users, label: "Directory" },
    { path: "/alumni/events", icon: Calendar, label: "Events" },
    { path: "/alumni/news", icon: Newspaper, label: "News" },
    { path: "/alumni/gallery", icon: Image, label: "Gallery" },
    { path: "/alumni/careers", icon: Briefcase, label: "Careers" },
    { path: "/alumni/giveback", icon: Heart, label: "Give Back" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Alumni Portal</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              Welcome, {user.name || user.email}
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
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
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
              {menuItems.find((item) => item.path === location.pathname)?.label || "Alumni Portal"}
            </h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.email}
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
            © {new Date().getFullYear()} Alumni Association. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AlumniLayout;