import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import About from "./pages/About";
import AlumniDirectory from "./pages/AlumniDirectory";
import Events from "./pages/Events";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Careers from "./pages/Careers";
import GiveBack from "./pages/giveback";
import ContactPage from "./pages/Contact";
import CheckAuth from "./components/common/CheckAuth";
import AlumniLayout from "./components/layouts/layouts/AlumniLayout";
import PublicLayout from "./components/layouts/layouts/PublicLayout";



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
          
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;