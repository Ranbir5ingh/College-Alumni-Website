// components/layouts/PublicLayout.jsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";


function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow mt-20 sm:mt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;