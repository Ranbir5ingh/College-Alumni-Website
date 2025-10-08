import { useState } from "react";
import {
  BookOpen,
  Users,
  Shield,
  Award,
  Building2,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Target,
  Mail,
  FileText,
  Video,
  Globe,
  Briefcase,
  BookMarked,
  Gift,
  Calendar,
  Coffee,
  Lightbulb,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import QuickLinks from "@/components/common/QuickLinks";

const HangoutAlumniPage = () => {
  const quickLinks = [
    { label: "Hangout with Alumni", path: "/hangout-with-alumni", icon: Users },
    { label: "Alumni Book Donation Program", path: "/book-donation", icon: BookOpen },
  ];


  const pastSessions = [
    {
      title: "General Discussion on Career Paths",
      description: "What people do after BBSBEC? Exploring diverse career opportunities",
      icon: Briefcase,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      title: "MS/PhD Abroad Info Session",
      description: "Guidance on pursuing higher education abroad, application process, and opportunities",
      icon: Globe,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      title: "MBA Info Session",
      description: "Insights into MBA programs, entrance exams, and career prospects in management",
      icon: TrendingUp,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      title: "Civil Services Guidance",
      description: "UPSC Preparation strategies and civil services career path guidance",
      icon: Award,
      color: "from-[#1e3a8a] to-[#2952b3]"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "Interactive Sessions",
      description: "Direct interaction with alumni through live video sessions"
    },
    {
      icon: Lightbulb,
      title: "Topic-Based Discussions",
      description: "Sessions tailored to student interests and career aspirations"
    },
    {
      icon: Coffee,
      title: "Informal Setting",
      description: "Relaxed conversations making it easy to ask questions"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Strengthening bonds between alumni and current students"
    }
  ];

  const benefits = [
    "Get firsthand insights from alumni who've walked the same path",
    "Learn about various career options and opportunities",
    "Understand the application process for higher studies",
    "Receive guidance on competitive exams and civil services",
    "Network with successful alumni across different fields",
    "Ask questions and get personalized advice"
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
                <h1 className="text-5xl font-bold text-[#1e3a8a]">Hangout with Alumni</h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Bridging the gap through regular alumni-student interaction sessions
              </p>
            </div>

            {/* Hero Section */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl mb-12">
              <img
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&q=80"
                alt="Hangout with Alumni"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Coffee className="h-9 w-9 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Connect & Learn</h2>
                    <p className="text-white/90">Interactive alumni-student sessions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#1e3a8a]">About the Initiative</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Following the overwhelming response during alumni meetings, the need for regular{" "}
                  <span className="font-semibold text-[#1e3a8a]">Alumni-Student interaction sessions</span> was
                  realized. The Alumni Association aims to bridge the gap with{" "}
                  <span className="font-semibold text-[#1e3a8a]">"Hangout with Alumni"</span>.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  In this initiative, we have alumni speak about various topics based on student responses and
                  interests. These informal yet informative sessions provide valuable insights into career paths,
                  higher education, competitive exams, and much more.
                </p>
                <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a] mt-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-[#1e3a8a] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">Request a Session</h3>
                      <p className="text-gray-700">
                        To raise a request for a specific topic, please email us at{" "}
                        <a href="mailto:alumni@bbsbec.ac.in" className="text-[#1e3a8a] hover:text-[#2952b3] font-semibold underline">
                          alumni@bbsbec.ac.in
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-[#f59e0b]" />
                Session Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Sessions */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-[#f59e0b]" />
                Past Sessions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {pastSessions.map((session, index) => {
                  const Icon = session.icon;
                  return (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300 overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${session.color} opacity-5 rounded-full -mr-16 -mt-16`}></div>
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-br ${session.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                          {session.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {session.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-3xl p-8 md:p-10 mb-8 border-l-4 border-[#1e3a8a]">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-[#f59e0b]" />
                Why Attend?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Participate */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-3xl p-8 text-white shadow-xl">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Students</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Keep an eye on announcements for upcoming sessions. Register for topics that interest you and
                  participate actively to get the most out of these interactions.
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#1e3a8a] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Calendar className="h-5 w-5" />
                  <span>View Schedule</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Alumni</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Want to share your experiences and guide current students? Volunteer to conduct a session on topics
                  you're passionate about.
                </p>
                <a
                  href="mailto:alumni@bbsbec.ac.in"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Mail className="h-5 w-5" />
                  <span>Volunteer</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Request CTA */}
            <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-3xl p-8 border-l-4 border-[#1e3a8a]">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3">
                    Have a Topic in Mind?
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We welcome your suggestions! If there's a specific topic you'd like to hear about from our alumni,
                    send us your request and we'll organize a session around it.
                  </p>
                  <a
                    href="mailto:alumni@bbsbec.ac.in?subject=Hangout%20Session%20Request"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] hover:from-[#2952b3] hover:to-[#1e3a8a] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Mail className="h-5 w-5" />
                    Request a Topic
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
<QuickLinks quickLinks={quickLinks}/>
        </div>
      </div>
    </div>
  );
};

export default HangoutAlumniPage;