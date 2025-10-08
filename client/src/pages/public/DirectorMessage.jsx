
import QuickLinks from "@/components/common/QuickLinks";
import { Quote, Award, Heart, Target, BookOpen, Users, Shield, Building2 } from "lucide-react";

const DirectorMessagePage = () => {

    const quickLinks = [
    { label: "About Us", path: "/about", icon: BookOpen },
    { label: "Executive Committee", path: "/executive-committee", icon: Users },
    { label: "Constitution", path: "/constitution", icon: Shield },
    { label: "Director's Message", path: "/directors-message", icon: Award },
    { label: "Office of Alumni Affairs", path: "/office-of-alumni-affairs", icon: Building2 },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white lg:pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
                <h1 className="text-5xl font-bold text-[#1e3a8a]">Director's Message</h1>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              {/* Director Profile Section */}
              <div className="relative bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] p-8 md:p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
                </div>
                
                <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-3xl overflow-hidden ring-8 ring-white/20 shadow-2xl">
                        <img
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                          alt="Director"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-2xl flex items-center justify-center shadow-xl">
                        <Award className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Prof. Dr. Rajesh Kumar
                    </h2>
                    <p className="text-xl text-white/90 font-medium mb-4">
                      Director, BBSBEC Fatehgarh Sahib
                    </p>
                    <p className="text-white/80 leading-relaxed max-w-2xl">
                      Ph.D. in Engineering, IIT Delhi | 25+ Years of Academic Excellence
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-8 md:p-12">
                {/* Opening Quote */}
                <div className="relative mb-10">
                  <Quote className="absolute -left-4 -top-4 h-16 w-16 text-[#f59e0b]/20" />
                  <p className="text-2xl text-gray-700 font-light italic pl-8 border-l-4 border-[#f59e0b]">
                    Dear Friends,
                  </p>
                </div>

                {/* Message Body */}
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-gray-700 leading-relaxed text-justify">
                    At <span className="font-semibold text-[#1e3a8a]">BBSBEC</span>, the Alumni Relations Association seeks to foster lifelong
                    connections by engaging the alumni with the Institute and with each other in
                    activities, programs, and services that support the Institute's mission, vision and
                    satisfy alumni needs. The association exists to help our alumni and, by
                    extension, the Institute itself.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-justify">
                    The world gets more complicated with every passing day and year; as a result we lost touch with our close
                    friends. The Institute intends not only to kindle the feeling of nostalgia among its alumni, but also to
                    provide an opportunity to its alumni for the pride and satisfaction of contributing to the progress of the
                    Institute. We always wish that our alumni go far beyond the boundaries of BBSBEC to lead the alumni of
                    the entire engineering education system. We dream of a Pan-Engineering Alumni Forum that will help in bringing synergy in making
                    concrete inroads to strong relationship between the Institute and the students.
                  </p>

                  <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-8 my-8 border-l-4 border-[#1e3a8a]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center">
                          <Target className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">Our Vision for Alumni</h3>
                        <p className="text-gray-700 leading-relaxed">
                          We recognize, acknowledge, and embrace our alumni as fundamental stakeholders in the development of
                          the Institute and to take it to even greater heights. Let us stay connected, participate in and support the
                          programs, services, and numerous campus activities and events.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-justify">
                    We also hearten each alumnus friend to
                    be a brand ambassador in his/her domain, by assisting with the recruitment of students and by supporting
                    programs, thereby investing your time, talent, and treasure with us.
                  </p>

                  <div className="bg-gradient-to-br from-[#f59e0b]/5 to-[#ea580c]/5 rounded-2xl p-8 my-8 border-l-4 border-[#f59e0b]">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-xl flex items-center justify-center">
                          <Heart className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">A Call to Action</h3>
                        <p className="text-gray-700 leading-relaxed">
                          Stay connected.... Stay Safe.... Take part ...... Join hands with BBSBEC..... Let's build a better tomorrow......
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div>
                        <p className="text-xl font-bold text-[#1e3a8a] mb-1">
                          Prof. Dr. Rajesh Kumar
                        </p>
                        <p className="text-gray-600 font-medium">
                          Director, BBSBEC Fatehgarh Sahib
                        </p>
                      </div>
                      <div className="text-right">
                        <img
                          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=80&fit=crop"
                          alt="Signature"
                          className="h-16 object-contain ml-auto opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Highlights Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center mb-4">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Strong Network</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Building bridges between alumni, students, and the institution
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-xl flex items-center justify-center mb-4">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Fostering creativity and excellence in engineering education
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Committed to academic and professional achievement
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-3xl p-8 md:p-10 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Join Our Alumni Community</h3>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Be part of a growing network of professionals making a difference. Register today and stay connected!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f59e0b] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  Register Now
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#1e3a8a] rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Links */}
          <QuickLinks quickLinks={quickLinks} />
        </div>
      </div>
    </div>
  );
};

export default DirectorMessagePage;