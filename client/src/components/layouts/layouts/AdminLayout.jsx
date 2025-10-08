// components/layouts/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
 <Sidebar collapsible="icon">
          <SidebarHeader className="border-b">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link to="/admin/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <LayoutDashboard className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin Portal</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.name || user?.email}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label} className="py-6">
                          <Link to={item.path}>
                            <Icon />
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout} 
                  tooltip="Logout"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-600 hover:text-[#1e3a8a]" />
                <h1 className="text-xl font-bold text-[#1e3a8a]">
                  {menuItems.find((item) => item.path === location.pathname)?.label || "Admin Panel"}
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  {user?.email}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-lg text-xs font-bold shadow-sm">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>

          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-6 py-4 text-center text-sm text-gray-600">
              © {new Date().getFullYear()} BBSBEC Alumni Association Admin Panel. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;