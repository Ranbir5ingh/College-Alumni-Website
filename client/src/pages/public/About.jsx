import { Link } from "react-router-dom";
import { 
  History, 
  Target, 
  Users, 
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  Calendar,
  Shield,
  Heart
} from "lucide-react";
import QuickLinks from "@/components/common/QuickLinks";

const AboutPage = () => {
  const quickLinks = [
    { label: "About Us", path: "/about", icon: BookOpen },
    { label: "Executive Committee", path: "/executive-committee", icon: Users },
    { label: "Constitution", path: "/constitution", icon: Shield },
    { label: "Director's Message", path: "/directors-message", icon: Award },
    { label: "Office of Alumni Affairs", path: "/office-of-alumni-affairs", icon: Building2 },
  ];

  const milestones = [
    { year: "1999", event: "BBSBEC Established" },
    { year: "2013", event: "Alumni Association Founded" },
    { year: "2015", event: "First Annual Meet" },
    { year: "2018", event: "Scholarship Program Launched" },
    { year: "2020", event: "Digital Portal Launch" },
    { year: "2025", event: "5000+ Active Alumni" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Community",
      description: "Building lasting relationships between alumni and their alma mater"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Promoting academic and professional excellence across all fields"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Fostering meaningful connections and knowledge sharing"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Celebrating achievements and contributions of our alumni"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white lg:pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
                <h1 className="text-5xl font-bold text-[#1e3a8a]">About Us</h1>
              </div>
              
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl mb-8">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
                  alt="BBSBEC Campus"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Connecting Engineers, Building Futures</h2>
                  <p className="text-white/90 text-lg">Since 2013</p>
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The <span className="font-semibold text-[#1e3a8a]">BBSBEC Alumni Association</span> was founded on{" "}
                  <span className="font-semibold text-[#1e3a8a]">1st February 2013</span>. The Association aims to
                  encourage the Alumni to take abiding interest in the progress and development of the Institute. Since its
                  establishment, the Association has grown from strength to strength, regularly undertaking several
                  initiatives to promote and foster mutually beneficial interaction between the Alumni and the Alma Mater.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  BBSBEC Alumni Association has been registered as a Society under the Societies Registration{" "}
                  <span className="font-semibold text-[#1e3a8a]">Act 1860</span>.
                </p>

                <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a] my-8">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-3">
                    <Target className="h-7 w-7 text-[#f59e0b]" />
                    Our Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To create a vibrant, engaged alumni community that supports current students, contributes to the
                    institution's growth, and maintains lifelong connections among graduates while promoting professional
                    development and social responsibility.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#f59e0b]/5 to-[#ea580c]/5 rounded-2xl p-6 border-l-4 border-[#f59e0b] my-8">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-3">
                    <History className="h-7 w-7 text-[#f59e0b]" />
                    Our Vision
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To be recognized as one of the most dynamic and influential alumni associations in India, fostering
                    innovation, excellence, and meaningful connections that transform lives and strengthen our engineering
                    community globally.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#f59e0b]" />
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-[#f59e0b]" />
                Our Journey
              </h2>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {milestone.year}
                      </div>
                      {index !== milestones.length - 1 && (
                        <div className="w-1 h-full bg-gradient-to-b from-[#1e3a8a] to-gray-200 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 group-hover:border-[#1e3a8a]/30 group-hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                          {milestone.event}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

<QuickLinks quickLinks={quickLinks}/>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;