import { Link, useLocation } from "react-router-dom";
import { 
  BookOpen,
  Users,
  Shield,
  Award,
  Building2,
  ChevronRight
} from "lucide-react";

const QuickLinks = ({quickLinks}) => {
  const location = useLocation();



  return (
    <div className="lg:col-span-1 ">
      <div className="sticky lg:top-48 ">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 ">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#f59e0b]" />
            Quick Links
          </h3>
          <nav className="space-y-2">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white shadow-lg"
                      : "hover:bg-gradient-to-r hover:from-[#1e3a8a]/5 hover:to-[#2952b3]/5 text-gray-700 hover:text-[#1e3a8a]"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-[#f59e0b]" : "text-gray-400 group-hover:text-[#1e3a8a]"}`} />
                  <span className="flex-1 font-medium text-sm">{link.label}</span>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`} />
                </Link>
              );
            })}
          </nav>



  
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;