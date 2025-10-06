import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import logo from '../assets/Images/images.jpg';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"> */}
                  <img src={logo} alt="BBSBEC Alumni Logo" className="w-10 h-10 object-contain" />
                {/* </div> */}
                <div>
                  <h3 className="font-bold text-xl text-foreground">
                    BBSBEC Alumni
                  </h3>
                  <p className="text-xs text-foreground">
                    Engineering Excellence
                  </p>
                </div>
              </div>
              <p className="text-base  leading-relaxed max-w-md">
                Connecting alumni of Baba Banda Singh Bahadur Engineering
                College, fostering lifelong relationships and driving
                professional growth across generations.
              </p>
            </div>

            {/* Social Links - Modern Style */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Connect With Us
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center  hover:text-[#ffff] hover:border-accent hover:bg-surface/80 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4  " />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center  hover:text-[#ffff] hover:border-accent hover:bg-surface/80 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4  " />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center  hover:text-[#ffff] hover:border-accent hover:bg-surface/80 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4  " />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center  hover:text-[#ffff] hover:border-accent hover:bg-surface/80 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4  " />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>About Us</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/alumni-directory"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Alumni Directory</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Events</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>News & Updates</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Career Opportunities</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/give-back"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Donations</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Mentorship</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Gallery</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Contact Support</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className=" hover:text-[#0a4d91] transition-colors duration-200 text-sm flex items-center gap-1 group"
                  >
                    <span>Alumni Portal</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 group-hover:border-accent transition-colors">
                    <MapPin className="h-4 w-4    group-hover:text-[#fff] transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm  leading-relaxed">
                      Baba Banda Singh Bahadur Engineering College, Fatehgarh
                      Sahib, Punjab
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 group-hover:border-accent transition-colors">
                    <Phone className="h-4 w-4    group-hover:text-[#fff] transition-colors" />
                  </div>
                  <a
                    href="tel:+911763503000"
                    className="text-sm  hover:text-[#0a4d91] transition-colors"
                  >
                    +91-1763-503000
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border hover:bg-[#1e3a8a] flex items-center justify-center flex-shrink-0 group-hover:border-accent transition-colors">
                    <Mail className="h-4 w-4    group-hover:text-[#fff] transition-colors" />
                  </div>
                  <a
                    href="mailto:alumni@bbsbec.ac.in"
                    className="text-sm  hover:text-[#0a4d91] transition-colors"
                  >
                    alumni@bbsbec.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-subtle bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm -foreground text-center sm:text-left">
              © 2025 BBSB Engineering College Alumni Association. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm -foreground hover:text-[#0a4d91] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm -foreground hover:text-[#0a4d91] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
