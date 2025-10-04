import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import HomePage from "./pages/public/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/alumni/DashboardPage";
import ProfilePage from "./pages/alumni/ProfilePage";
import About from "./pages/public/About";
import AlumniDirectory from "./pages/alumni/AlumniDirectory";
import Events from "./pages/alumni/Events";
import News from "./pages/alumni/News";
import Gallery from "./pages/alumni/Gallery";
import Careers from "./pages/alumni/Careers";
import GiveBack from "./pages/alumni/GiveBack";
import ContactPage from "./pages/public/Contact";
import CheckAuth from "./components/common/CheckAuth";
import AlumniLayout from "./components/layouts/layouts/AlumniLayout";
import PublicLayout from "./components/layouts/layouts/PublicLayout";
import AdminLayout from "./components/layouts/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AlumniManagement from "./pages/admin/AlumniManagement";
import EventDetailsPage from "./components/common/EventDetails";
import ResetPasswordPage from "./pages/alumni/ResetPasswordPage";



function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* Public Routes - Uses PublicLayout */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <PublicLayout />
            </CheckAuth>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="directory" element={<AlumniDirectory />} />
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="careers" element={<Careers />} />
          <Route path="giveback" element={<GiveBack />} />
          
        </Route>

        {/* Alumni Routes - Uses AlumniLayout (Protected) */}
        <Route
          path="/alumni"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <AlumniLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="directory" element={<AlumniDirectory />} />
          <Route path="events" element={<Events />} />
          <Route path="news" element={<News />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="careers" element={<Careers />} />
          <Route path="giveback" element={<GiveBack />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
  
          
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="alumni" element={<AlumniManagement />} />
          <Route path="events/:id" element={<EventDetailsPage />} />

        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;