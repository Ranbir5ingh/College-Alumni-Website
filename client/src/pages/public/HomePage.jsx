import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  Award,
  Heart,
  Calendar,
  Briefcase,
  Clock
} from "lucide-react";

import slider1 from "@/assets/Images/slider1.jpg";
import slider2 from "@/assets/Images/slider2.jpg";
import diractorImg from '@/assets/Images/diractor.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: slider1,
      title: "BBSBEC Alumni Association",
      subtitle: "Connecting Engineers, Building Futures",
    },
    {
      image: slider2,
      title: "Excellence in Engineering Education",
      subtitle: "Proud Legacy Since 1999",
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
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

  const newsItems = [
    {
      title: "Job Opportunity | HFT (2020 - 2023 batches)",
      date: "3 Oct 2025",
      flag: "🇮🇳",
    },
    {
      title: "Now live: Alumni Mentorship Initiative — Alumni offices in...",
      date: "11 Aug 2025",
    },
    {
      title: "BBSBEC proudly unveils its Strategic Portal CAPS",
      date: "25 Jul 2025",
    },
    {
      title: "Walk-in Interview: Office Executive (on Contract basis)...",
      date: "4 Jul 2025",
    },
    {
      title: "Hiring of dedicated, skilled staff to work for the college...",
      date: "25 Apr 2025",
    },
    {
      title: "Annual Alumni Meet 2024 - Registration Now Open",
      date: "15 Mar 2024",
    },
  ];

  const jobListings = [
    { title: "Senior Software Engineer at Spenza", time: "6 Days ago" },
    { title: "Sales Development Representative (SDR) at Spenza", time: "6 Days ago" },
    { title: "Product Manager (RMS) Capital Market at Confidential", time: "1 Week ago" },
    { title: "Senior ETL Developer at Confidential", time: "1 Week ago" },
    { title: "CCH Tagetik Consultant at EY (Ernst & Young)", time: "2 Weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Slider */}

      <section className="relative lg:h-[calc(100dvh-8rem)] overflow-hidden lg:max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl flex flex-col items-center lg:justify-center mt-6 lg:mt-0">
        {/* Slider Container */}
        <div className="relative w-full h-[35dvh] lg:h-[70dvh] rounded-2xl flex items-center justify-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out rounded-2xl ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 "
              }`}
            >
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 rounded-2xl" />

              {/* Content (centered) */}
              <div className="relative z-10 flex flex-col items-start justify-end text-center h-full px-4 sm:px-6 lg:px-8">
                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold  lg:mb-6 text-white leading-tight animate-fadeIn">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-xl text-white/90 font-light mb-4 lg:mb-10 animate-fadeIn max-w-2xl">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1e3a8a] p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg z-20"
          >
            <ChevronLeft className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1e3a8a] p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg z-20"
          >
            <ChevronRight className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-white w-10"
                      : "bg-white/50 w-2 hover:bg-white/70 hover:w-4"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
        </div>

        {/* Slide Indicators (below slider) */}
      </section>


      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Newsroom */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
              <h2 className="text-4xl font-bold text-[#1e3a8a]">Newsroom</h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-200">
                {newsItems.map((item, index) => (
                  <a
                    key={index}
                    href="/news"
                    className="group block hover:bg-gradient-to-r hover:from-[#1e3a8a]/5 hover:to-transparent transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-6 p-6">
                      <div className="flex-1">
                        <p className="text-gray-900 group-hover:text-[#1e3a8a] font-medium transition-colors line-clamp-2">
                          {item.title}{" "}
                          {item.flag && <span className="ml-2">{item.flag}</span>}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap bg-gray-50 px-4 py-2 rounded-lg font-medium">
                        {item.date}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 text-right">
              <a
                href="/news"
                className="group inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#2952b3] font-semibold transition-colors"
              >
                View All News
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column - Events */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] rounded-full"></div>
                <h2 className="text-3xl font-bold text-[#1e3a8a]">Events</h2>
              </div>

              <div className="space-y-4">
                <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] bg-gray-100 rounded-xl flex-shrink-0">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Jan</span>
                      <span className="text-2xl font-bold text-[#1e3a8a]">23</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 uppercase mb-2 font-semibold tracking-wide">Past</div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors line-clamp-2">
                        Invitation to the PIWOT Satellite Conference
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        BBSBEC Campus, Fatehgarh Sahib
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] bg-gray-100 rounded-xl flex-shrink-0">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Jan</span>
                      <span className="text-2xl font-bold text-[#1e3a8a]">23</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 uppercase mb-2 font-semibold tracking-wide">Past</div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                        PIWOT SATELLITE CONFERENCE-2025
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        BBSBEC Campus, Fatehgarh Sahib
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-[#f59e0b]/10 to-[#ea580c]/10 p-6 rounded-2xl border-2 border-[#f59e0b]/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] bg-gradient-to-br from-[#f59e0b] to-[#ea580c] text-white rounded-xl shadow-lg flex-shrink-0">
                      <span className="text-xs uppercase font-semibold">Mar</span>
                      <span className="text-2xl font-bold">15</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-[#f59e0b] uppercase mb-2 font-bold tracking-wide">Upcoming</div>
                      <h3 className="font-bold text-gray-900 mb-2">Annual Alumni Meet 2024</h3>
                      <p className="text-sm text-gray-700">BBSBEC Campus, Fatehgarh Sahib</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-right">
                <a
                  href="/events"
                  className="group inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#2952b3] font-semibold transition-colors"
                >
                  View All Events
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-3xl p-10 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <Briefcase className="h-8 w-8 text-[#f59e0b]" />
              <h2 className="text-3xl font-bold">Job Opportunities</h2>
            </div>
            <div className="space-y-5">
              {jobListings.map((job, index) => (
                <a
                  key={index}
                  href="/jobs"
                  className="group block border-b border-white/20 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white group-hover:text-[#f59e0b] font-medium transition-colors flex-1 line-clamp-2">
                      {job.title}
                    </p>
                    <span className="flex items-center gap-2 text-sm text-white/70 whitespace-nowrap bg-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4" />
                      {job.time}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 text-right">
            <a
              href="/jobs"
              className="group inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#2952b3] font-semibold transition-colors"
            >
              View All Jobs
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Director's Message & Gallery Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Director's Message */}
            <a
              href="/directors-message"
              className="group relative h-[500px] overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={diractorImg}
                alt="Director"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <div className="h-1 w-16 bg-[#f59e0b] rounded-full mb-4"></div>
                <h2 className="text-3xl font-bold mb-4">Director's Message</h2>
                <p className="text-white/90 mb-6 leading-relaxed line-clamp-3">
                  Welcome to the BBSBEC Alumni Association. Our alumni are our greatest ambassadors, representing excellence across industries worldwide...
                </p>
                <span className="inline-flex items-center gap-2 text-[#f59e0b] hover:text-[#ea580c] font-semibold transition-colors">
                  Read Full Message
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </a>

            {/* Gallery */}
            <a
              href="/gallery"
              className="group relative h-[500px] overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
                alt="Gallery"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <div className="h-1 w-16 bg-[#f59e0b] rounded-full mb-4"></div>
                <h2 className="text-3xl font-bold mb-4">Gallery</h2>
                <p className="text-white/90 mb-6 leading-relaxed line-clamp-3">
                  Explore memories from alumni meets, convocations, campus events, and celebrations that showcase our vibrant community...
                </p>
                <span className="inline-flex items-center gap-2 text-[#f59e0b] hover:text-[#ea580c] font-semibold transition-colors">
                  Explore Gallery
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Latest Members Grid */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
            <h2 className="text-4xl font-bold text-[#1e3a8a]">Latest Members</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {Array.from({ length: 16 }).map((_, index) => (
              <a
                key={index}
                href="/alumni-directory"
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-[#1e3a8a]/30 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                  <img
                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                    alt={`Alumni ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="text-sm text-center text-gray-900 font-semibold truncate group-hover:text-[#1e3a8a] transition-colors">
                  Alumni {index + 1}
                </p>
                <p className="text-xs text-center text-gray-500 mt-1">Batch 20{15 + (index % 10)}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/alumni-directory"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#1e3a8a]/30 hover:-translate-y-1"
            >
              View All Alumni
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: Users, count: "5000+", label: "Alumni Worldwide" },
              { icon: Award, count: "25+", label: "Years of Excellence" },
              { icon: Heart, count: "₹2Cr+", label: "Scholarships Funded" },
              { icon: Calendar, count: "50+", label: "Annual Events" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-5 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-10 w-10 text-[#f59e0b]" />
                  </div>
                  <h3 className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                    {stat.count}
                  </h3>
                  <p className="text-white/80 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <a
        href="/feedback"
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:-translate-y-1"
      >
        Feedback
      </a>
    </div>
  );
};

export default Home;