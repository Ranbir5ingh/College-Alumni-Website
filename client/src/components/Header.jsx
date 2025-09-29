import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, Menu, ChevronDown } from "lucide-react";
import gsap from "gsap";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/" },
    { 
      label: "About Us", 
      path: "/about",
      dropdown: [
        { label: "Mission & Vision", path: "/about/mission" },
        { label: "Alumni Committee", path: "/about/committee" },
        { label: "College History", path: "/about/history" }
      ]
    },
    { label: "Alumni Directory", path: "/alumni-directory" },
    { label: "Events", path: "/events" },
    { label: "News & Updates", path: "/news" },
    { label: "Gallery", path: "/gallery" },
    { label: "Careers", path: "/careers" },
    { label: "Give Back", path: "/give-back" },
    { label: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  function handleOpenMenu() {
    setShouldRenderOverlay(true);
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuOpen(false);
          setShouldRenderOverlay(false);
          setOpenDropdown(null);
        },
      });
    }
  }

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { x: "100%" },
        {
          x: "0%",
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [isMenuOpen]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
            className="flex items-center"
          >
            <div className="flex flex-col">
              <span className="text-[1.3rem] sm:text-[1.4rem] md:text-[1.5rem] font-bold text-[#1e3a8a] leading-tight">
                BBSBEC
              </span>
              <span className="text-[0.75rem] sm:text-[0.8rem] text-gray-600 font-medium">
                Alumni Association
              </span>
            </div>
          </button>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((item) => (
              item.dropdown ? (
                <div key={item.label} className="relative group">
                  <button
                    className={`font-medium text-[0.9rem] transition-all flex items-center gap-1 ${
                      isActive(item.path)
                        ? "text-[#1e3a8a]"
                        : "text-gray-700 hover:text-[#1e3a8a]"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : item.label === "Home" ? (
                <button
                  key={item.label}
                  onClick={() => {
                    if (location.pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      navigate("/");
                    }
                  }}
                  className={`font-medium text-[0.9rem] transition-all ${
                    isActive(item.path)
                      ? "text-[#1e3a8a]"
                      : "text-gray-700 hover:text-[#1e3a8a]"
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium text-[0.9rem] transition-all ${
                    isActive(item.path)
                      ? "text-[#1e3a8a]"
                      : "text-gray-700 hover:text-[#1e3a8a]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Login Button (Desktop) */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/auth"
              className="px-5 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors text-sm font-medium"
            >
              Login
            </Link>
          </div>

          {/* Hamburger (Mobile) */}
          <div className="lg:hidden">
            <button
              onClick={handleOpenMenu}
              className="text-gray-700 hover:text-[#1e3a8a] transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {shouldRenderOverlay && (
        <div
          ref={menuRef}
          className="fixed top-0 right-0 w-full sm:w-80 h-[100dvh] z-[9999] bg-white shadow-2xl flex flex-col"
          style={{
            transform: "translateX(100%)",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0">
            <span className="text-lg font-bold text-[#1e3a8a]">Menu</span>
            <button
              onClick={handleCloseMenu}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {navLinks.map((item) =>
                item.dropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={handleCloseMenu}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a] rounded-lg transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.label === "Home" ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        navigate("/");
                      }
                      handleCloseMenu();
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-[#1e3a8a] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleCloseMenu}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-[#1e3a8a] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          {/* Login Button (Mobile) */}
          <div className="p-5 border-t border-gray-200 flex-shrink-0">
            <Link
              to="/login"
              onClick={handleCloseMenu}
              className="block w-full text-center px-5 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium"
            >
              Login / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}