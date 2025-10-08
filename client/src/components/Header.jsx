import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import collegeLogo from "@/assets/Images/images.jpg";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    {
      label: "About Us",
      path: "/about",
      dropdown: [
        { label: "Executive Committee", path: "/executive-committee" },
        { label: "Constitution", path: "/constitution" },
        { label: "Director's Message", path: "/directors-message" },
        {label: "Office of Alumni Affairs", path: "/office-of-alumni-affairs",},
      ],
    },
    {
      label: "Initiatives",
      dropdown: [
        { label: "Hangout with Alumni", path: "/hangout-with-alumni" },
        { label: "Alumni Book Donation Program", path: "/book-donation" },
      ],
    },
    {
      label: "Alumni Assist",
      dropdown: [
        { label: "Share Opportunities", path: "/careers" },
        { label: "Invite Friends", path: "/invite" },
      ],
    },
    {
      label: "Contribute",
      path: "/contribute",
    },
    {
      label: "Gallery",
      path: "/gallery",
    },
    {
      label: "News & Updates",
      path: "/news",
    },
    {
      label: "Alumni Directory",
      path: "/directory",
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src={collegeLogo}
                alt="BBSBEC Logo"
                className="h-14 w-14 object-cover rounded-xl "
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#1e3a8a] text-lg font-bold leading-tight tracking-tight group-hover:text-[#2952b3] transition-colors">
                BBSBEC ALUMNI ASSOCIATION
              </span>
              <span className="text-gray-600 text-xs font-medium">
                Baba Banda Singh Bahadur Engineering College
              </span>
            </div>
          </button>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-[#1e3a8a] hover:text-[#f59e0b] transition-all duration-300 rounded-lg hover:bg-[#1e3a8a]/5"
            >
              REGISTER
            </Link>
            <Link
              to="/auth"
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-lg hover:shadow-lg hover:shadow-[#1e3a8a]/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              LOGIN
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-[#1e3a8a] p-2 hover:bg-[#1e3a8a]/5 rounded-lg transition-colors"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:block bg-gray-50 text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12">
          {navLinks.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="relative group">
                <button
                  className="px-4 py-3 text-sm font-medium flex items-center gap-1 hover:bg-white/10 rounded-lg transition-all duration-300"
                  onClick={() => item.path? navigate(`${item.path}`): null}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                </button>
                <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-xl border border-gray-100 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-300 overflow-hidden">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#1e3a8a]/5 hover:to-transparent hover:text-[#1e3a8a] hover:pl-5 transition-all duration-200"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-[#f59e0b] bg-white/10"
                    : "hover:text-[#f59e0b] hover:bg-white/5"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-lg animate-pulse">
                    {item.badge}
                  </span>
                )}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-[#f59e0b] rounded-full" />
                )}
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl flex flex-col animate-slideIn">
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white">
              <h3 className="text-lg font-bold">Menu</h3>
              <button
                onClick={handleCloseMenu}
                className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4">
              {navLinks.map((item) =>
                item.dropdown ? (
                  <div key={item.label} className="mb-2">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex items-center justify-between py-3 px-4 text-gray-700 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/5 font-medium rounded-lg transition-all duration-200"
                    >
                      {item.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#1e3a8a]/20 pl-4">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            onClick={handleCloseMenu}
                            className="block py-2 px-3 text-sm text-gray-600 hover:text-[#f59e0b] hover:bg-[#f59e0b]/5 rounded-lg transition-all duration-200"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleCloseMenu}
                    className={`block py-3 px-4 font-medium rounded-lg mb-2 transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-[#f59e0b] bg-[#f59e0b]/10"
                        : "text-gray-700 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/5"
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>

            <div className="p-5 border-t space-y-3">
              <Link
                to="/register"
                onClick={handleCloseMenu}
                className="block w-full text-center py-3 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-xl hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 font-semibold"
              >
                Register
              </Link>
              <Link
                to="/auth"
                onClick={handleCloseMenu}
                className="block w-full text-center py-3 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-xl hover:shadow-lg hover:shadow-[#1e3a8a]/30 transition-all duration-300 font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
