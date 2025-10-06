import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Award,
  Heart,
  ArrowRight,
  Star,
  TrendingUp,
  Globe,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import ClgLogo from "@/assets/Images/images.jpg";
import slider1 from "@/assets/Images/slider1-2.jpg";
import slider2 from "@/assets/Images/bbsbec-3.jpg";
import slider3 from "@/assets/Images/AlumniECE.png";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: slider1,
      title: "Welcome to BBSBEC Alumni Network",
      subtitle: "Connecting Engineers, Building Futures",
    },
    {
      image: slider2,
      title: "Excellence in Engineering Education",
      subtitle: "Proud Legacy Since 1999",
    },
    {
      image: slider3,
      title: "Alumni Making Global Impact",
      subtitle: "Innovation Across Industries",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Slider - Full viewport height minus header */}
      <section
        className="relative h-screen sm:h-screen
        overflow-hidden"
      >
        <div className="h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-5xl">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight tracking-tight animate-fadeIn">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-3xl mb-10 text-balance opacity-95 font-light tracking-wide">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <Link
                      to="/alumni-directory"
                      className="bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                    >
                      Join Our Network
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/about"
                      className="border-2 border-white/80 backdrop-blur-sm bg-white/10 text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 w-2 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                count: "5000+",
                label: "Alumni Worldwide",
                color: "blue",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Award,
                count: "25+",
                label: "Years of Excellence",
                color: "blue",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Heart,
                count: "₹2Cr+",
                label: "Scholarships Funded",
                color: "blue",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                icon: Calendar,
                count: "50+",
                label: "Annual Events",
                color: "blue",
                bgColor: "bg-blue-50",
                iconColor: "text-blue-600",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div
                    className={`${stat.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <Icon className={`h-10 w-10 ${stat.iconColor}`} />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.count}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Alumni Association */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4">
                {/* <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-100 px-4 py-2 rounded-full">
                  About Us
                </span> */}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                BBSBEC Alumni Association
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Baba Banda Singh Bahadur Engineering College Alumni
                Association serves as a bridge connecting our graduates across
                the globe. Since our establishment, we've fostered a community
                of engineers who continue to make significant contributions to
                technology and society.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our mission is to maintain lifelong connections among alumni,
                support current students through mentorship and scholarships,
                and contribute to the continued growth and excellence of our
                alma mater.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/90 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e3a8a]/90 rounded-3xl p-12 h-[450px] flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
                <div className="text-center relative z-10">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <img
                      src={ClgLogo}
                      alt="College Logo"
                      className="w-20 h-20"
                    />
                  </div>
                  {/* <p className="text-white/90 font-medium text-lg">
                    College Logo
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-[#1e3a8a] mb-2">
                Latest News & Updates
              </h2>
              <p className="text-gray-600">Stay informed about our community</p>
            </div>
            <Link
              to="/news"
              className="text-[#1e3a8a] hover:text-[#1e3a8a] font-semibold flex items-center gap-2 group"
            >
              View All News
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Annual Alumni Meet 2024 Announced",
                excerpt:
                  "Join us for our biggest alumni gathering featuring networking, awards ceremony, and campus tour.",
                date: "March 15, 2024",
                category: "Events",
                color: "blue",
                image:
                  "https://media.istockphoto.com/id/2183461029/photo/professional-asian-businesswoman-smiling-confidently-with-her-arms-crossed-in-office.jpg?s=1024x1024&w=is&k=20&c=AYEcEoDVP_VKeASevCaynnrbYxIm4ujLjv7bgXRTS60=",
              },
              {
                title: "New Scholarship Program Launched",
                excerpt:
                  "Alumni association launches merit-based scholarship program for deserving students.",
                date: "March 10, 2024",
                category: "Scholarships",
                color: "green",
                image:
                  "https://images.unsplash.com/photo-1696453423411-3fc7847a9611?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                title: "Alumni Startup Success Story",
                excerpt:
                  "BBSB graduate's tech startup raises $5M in Series A funding, creating 100+ jobs.",
                date: "March 5, 2024",
                category: "Success Stories",
                color: "purple",
                image:
                  "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ].map((news, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
              >
                {/* Background image - visible only on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url(${news.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Adjustable dark overlay - change the opacity value (0.7) to adjust darkness */}
                  <div className="absolute inset-0 bg-black opacity-70"></div>
                </div>

                {/* Content - positioned above background */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs bg-blue-100 text-${news.color}-700 px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide group-hover:bg-white group-hover:text-${news.color}-700 transition-colors`}
                    >
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500 font-medium group-hover:text-gray-200 transition-colors">
                      {news.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-blue-900 mb-3 leading-tight group-hover:text-white transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-100 transition-colors">
                    {news.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Spotlight */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Alumni Spotlight
            </h2>
            <p className="text-gray-600 text-lg">
              Celebrating success stories from our community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                batch: "Class of 2010",
                position: "Senior Software Engineer",
                company: "Google",
                achievement:
                  "Led development of critical infrastructure serving 2B+ users",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Arjun Singh",
                batch: "Class of 2008",
                position: "Founder & CEO",
                company: "TechStart Solutions",
                achievement:
                  "Built successful startup with 500+ employees across 3 countries",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                name: "Neha Gupta",
                batch: "Class of 2012",
                position: "Research Scientist",
                company: "Microsoft",
                achievement: "Published 15+ papers in AI/ML, holds 8 patents",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((alumni, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                <div
                  className={`bg-gradient-to-br ${alumni.gradient} p-8 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-gray-900 font-bold text-3xl">
                        {alumni.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {alumni.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{alumni.batch}</p>
                  <div className="mb-4">
                    <p className="text-base font-semibold text-gray-900">
                      {alumni.position}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {alumni.company}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {alumni.achievement}
                  </p>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Give Back CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mb-48" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Give Back to Your Opinions
          </h2>
          <p className="text-xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed">
            Support the next generation of engineers through scholarships,
            mentorship, and donations. Your contribution makes a lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/give-back"
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <Heart className="h-5 w-5" />
              Make a Donation
            </Link>
            <Link
              to="/careers"
              className="border-2 border-white/80 backdrop-blur-sm bg-white/10 text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
