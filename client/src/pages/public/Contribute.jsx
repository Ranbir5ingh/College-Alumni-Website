import { 
  Heart, 
  Award, 
  GraduationCap, 
  Building2, 
  Users, 
  BookOpen,
  Linkedin,
  Mail,
  Globe,
  ArrowRight,
  Trophy,
  Target,
  Lightbulb
} from "lucide-react";

const ContributePage = () => {
  const topContributors = [
    {
      name: "Aayush Bahuguna",
      degree: "B.Tech/CSE/2013",
      image: "https://i.pravatar.cc/300?img=12",
      linkedin: "https://linkedin.com",
      email: "mailto:contributor1@example.com",
      website: "https://example.com"
    },
    {
      name: "Piyush Nahar",
      degree: "B.Tech/EE/2013",
      image: "https://i.pravatar.cc/300?img=33",
      linkedin: "https://linkedin.com",
      email: "mailto:contributor2@example.com",
      website: "https://example.com"
    },
    {
      name: "Rohit Agarwal",
      degree: "B.Tech/CSE/2013",
      image: "https://i.pravatar.cc/300?img=51",
      linkedin: "https://linkedin.com",
      email: "mailto:contributor3@example.com",
      website: "https://example.com"
    },
    {
      name: "Sidhant Duggal",
      degree: "B.Tech/EE/2013",
      image: "https://i.pravatar.cc/300?img=68",
      linkedin: "https://linkedin.com",
      email: "mailto:contributor4@example.com",
      website: "https://example.com"
    }
  ];

  const contributionAreas = [
    {
      icon: Building2,
      title: "Infrastructure Development",
      description: "Support the construction and renovation of labs, classrooms, and campus facilities",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: GraduationCap,
      title: "Scholarships & Awards",
      description: "Help deserving students achieve their dreams through financial assistance",
      color: "from-green-500 to-green-600"
    },
    {
      icon: BookOpen,
      title: "Library & Resources",
      description: "Contribute to building a world-class library and learning resources",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Lightbulb,
      title: "Research & Innovation",
      description: "Fund research projects and innovation initiatives",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Student Programs",
      description: "Support extracurricular activities, clubs, and student development programs",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Trophy,
      title: "Sports & Athletics",
      description: "Enhance sports facilities and support athletic programs",
      color: "from-red-500 to-red-600"
    }
  ];

  const impactStats = [
    { value: "₹2 Cr+", label: "Total Contributions" },
    { value: "500+", label: "Students Benefited" },
    { value: "50+", label: "Active Contributors" },
    { value: "25+", label: "Scholarships Funded" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
            <h1 className="text-5xl font-bold text-[#1e3a8a]">Contribute</h1>
            <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Support BBSBEC's mission of excellence in engineering education. Your contribution makes a lasting impact.
          </p>
        </div>

        {/* Top Contributors Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-2xl mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-3">All-time Top Contributors</h2>
            <p className="text-gray-600">Celebrating our most generous alumni</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topContributors.map((contributor, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-64 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 overflow-hidden">
                  <img
                    src={contributor.image}
                    alt={contributor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-full flex items-center justify-center shadow-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                    {contributor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{contributor.degree}</p>
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={contributor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#1e3a8a]/10 hover:bg-[#1e3a8a] rounded-lg flex items-center justify-center transition-all duration-300 group/link"
                    >
                      <Linkedin className="h-4 w-4 text-[#1e3a8a] group-hover/link:text-white" />
                    </a>
                    <a
                      href={contributor.email}
                      className="w-9 h-9 bg-[#1e3a8a]/10 hover:bg-[#1e3a8a] rounded-lg flex items-center justify-center transition-all duration-300 group/link"
                    >
                      <Mail className="h-4 w-4 text-[#1e3a8a] group-hover/link:text-white" />
                    </a>
                    <a
                      href={contributor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#1e3a8a]/10 hover:bg-[#1e3a8a] rounded-lg flex items-center justify-center transition-all duration-300 group/link"
                    >
                      <Globe className="h-4 w-4 text-[#1e3a8a] group-hover/link:text-white" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Contribute Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-2xl flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">
                Why Your Contribution Matters
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                The role of the different Alumni Associations in the world has been very pivotal for the development of their respective
                institutions. The core aim being – building connections! As an input from Alumni of different engineering colleges, many people lose
                contact details of their batch-mates, juniors, and seniors, over a period of time after graduating.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-gray-700 leading-relaxed text-justify">
              The Alumni Association of BBSBEC strives to give a structured approach to avoid this by maintaining your existing
              college IDs, maintaining information database of all Alumni, organizing Alumni-Student meets and promoting Mentorship
              programmes.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              The Alumni fund majorly contributes towards improving institute and hostel infrastructure, giving scholarships/awards,
              loan facility etc. The Association aims to constantly invest in such permanent assets of the institute, aiming for regular
              and rigorous development. The Association has already allocated some funds for laboratories, workshops and for a scholarship
              program for students visiting foreign countries for conferences and internships.
            </p>

            <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-8 border-l-4 border-[#1e3a8a] my-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3">Get In Touch</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To know more about how to contribute, email us at{" "}
                    <a
                      href="mailto:alumni@bbsbec.ac.in"
                      className="font-semibold text-[#1e3a8a] hover:text-[#f59e0b] transition-colors underline"
                    >
                      alumni@bbsbec.ac.in
                    </a>
                  </p>
                  <a
                    href="mailto:alumni@bbsbec.ac.in"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <Mail className="h-5 w-5" />
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Areas */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-3">Areas of Contribution</h2>
            <p className="text-gray-600 text-lg">Choose where you'd like to make an impact</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributionAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-[#1e3a8a]/30 transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1e3a8a] transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white mb-3">Our Impact</h2>
              <p className="text-white/90 text-lg">Together, we're making a difference</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    <Award className="h-10 w-10 text-[#f59e0b]" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-white/80 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#f59e0b]/10 to-[#ea580c]/10 rounded-3xl p-8 md:p-12 text-center border-2 border-[#f59e0b]/20">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#f59e0b] to-[#ea580c] rounded-2xl mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#1e3a8a] mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Your contribution, no matter the size, creates opportunities for future engineers and strengthens our institution.
              Join us in building a brighter tomorrow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:alumni@bbsbec.ac.in?subject=Contribution Inquiry"
                className="group px-8 py-4 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] hover:from-[#2952b3] hover:to-[#1e3a8a] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
              >
                Start Contributing
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-xl font-semibold transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;