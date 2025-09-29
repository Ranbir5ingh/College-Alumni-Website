import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import AlumniDirectory from "./pages/AlumniDirectory";
import Events from "./pages/Events";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Careers from "./pages/Careers";
import { Contact } from "lucide-react";

function App() {
  const dispatch = useDispatch();
  // Destructuring for clarity and ease of use
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Effect to dispatch checkAuth on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show a loading spinner while the auth status is being checked
  if (isLoading) {
    /* NOTE: The 'animate-spin' class is a standard Tailwind utility. 
      If your project doesn't have it configured, you might need to ensure 
      it's available in your Tailwind configuration or global CSS.
    */
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div 
          className="w-12 h-12 border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin"
        >
          {/* Tailwind's 'animate-spin' utility is used for the rotation. 
              The border classes create the spinner effect. */}
        </div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
   
      <main className="flex-grow">
        <Routes>
          {/* Root path: If authenticated, redirect to dashboard, else show HomePage */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />
            }
          />

            <Route path="/about" element={<About />} />
            <Route path="/alumni-directory" element={<AlumniDirectory />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/careers" element={<Careers />} />
        
            <Route path="/contact" element={<Contact />} />
           
          {/* Auth path: If authenticated, redirect to dashboard, else show AuthPage */}
          <Route
            path="/auth"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />
            }
          />
          {/* Dashboard path: Protected route. If not authenticated, redirect to auth */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" />
            }
          />
          {/* Profile path: Protected route. If not authenticated, redirect to auth */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />
            }
          />
          {/* Fallback route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;

/*
  // Global CSS (e.g., in index.css or a dedicated stylesheet) 
  // corresponding to the original spinner logic, 
  // although Tailwind's built-in `animate-spin` is used above.
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-custom {
    animation: spin 1s linear infinite;
  }
*/