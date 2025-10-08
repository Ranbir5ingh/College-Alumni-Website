// components/layouts/AlumniLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link to="/alumni/dashboard">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <LayoutDashboard className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Alumni Portal</span>
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
          <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
            <div className="px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold text-gray-800">
                  {menuItems.find((item) => item.path === location.pathname)?.label || "Alumni Portal"}
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.email}
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>

          <footer className="bg-white border-t mt-auto">
            <div className="px-6 py-4 text-center text-sm text-gray-600">
              © {new Date().getFullYear()} Alumni Association. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AlumniLayout;