
import QuickLinks from "@/components/common/QuickLinks";
import { Users, Mail, Phone, Briefcase, Award, Crown, BookOpen, Shield, Building2 } from "lucide-react";

const ExecutiveCommitteePage = () => {
  const leadership = [
    {
      name: "Dr. Rajesh Ahuja",
      role: "Chairman",
      designation: "Director, IIT Ropar",
      image: "https://i.pravatar.cc/300?img=33",
      email: "chairman@bbsbec.ac.in",
      phone: "+91 123 456 7890",
      type: "chairman"
    },
    {
      name: "Dr. Pushpendra Pal Singh",
      role: "Dean",
      designation: "Dean CAPS",
      image: "https://i.pravatar.cc/300?img=13",
      email: "dean@bbsbec.ac.in",
      phone: "+91 123 456 7891",
      type: "dean"
    }
  ];

  const coreMembers = [
    {
      name: "Abhijeet Singh",
      role: "President",
      batch: "2010/BT/0511",
      designation: "CEO of Haveles",
      image: "https://i.pravatar.cc/300?img=12"
    },
    {
      name: "Karamveer Singh",
      role: "Vice President",
      batch: "2010/ME/1940",
      designation: "Senior Project Analyst, Oxeamwering Intl",
      image: "https://i.pravatar.cc/300?img=51"
    },
    {
      name: "Riya Lamba",
      role: "Secretary",
      batch: "2019/MC/1229",
      designation: "Data Scientist, BAL Services",
      image: "https://i.pravatar.cc/300?img=47"
    },
    {
      name: "Armaan Harshith Kumar",
      role: "Treasurer",
      batch: "2017/MT/1217",
      designation: "Ph.D. Scholar, IIT Ropar",
      image: "https://i.pravatar.cc/300?img=56"
    },
    {
      name: "Ashutosh Kumar",
      role: "Batch Representative-2024",
      batch: "2020/CS/1120",
      designation: "Geospatial Data Scientist, Gram Infoga Pvt. Ltd",
      image: "https://i.pravatar.cc/300?img=8"
    },
    {
      name: "Vasu Bansal",
      role: "Batch Representative-2023",
      batch: "2019/CS/1340",
      designation: "Software Engineer, Microsoft",
      image: "https://i.pravatar.cc/300?img=15"
    }
  ];

  const executiveMembers = [
    {
      name: "Nitin Singhal",
      batch: "2020/CM/0311",
      designation: "Research Scientist, Amazon",
      image: "https://i.pravatar.cc/300?img=60"
    },
    {
      name: "Deepankar Adhikari",
      batch: "2016/CM/1004",
      designation: "Software Engineer, MAG Software",
      image: "https://i.pravatar.cc/300?img=14"
    },
    {
      name: "Karan Singh",
      batch: "2016/ME/1908",
      designation: "Senior Software Engineer, BCI Software",
      image: "https://i.pravatar.cc/300?img=59"
    },
    {
      name: "Tejpal",
      batch: "2018/MA/1432",
      designation: "Faculty, Eklavya Institute, Nagpur",
      image: "https://i.pravatar.cc/300?img=68"
    },
    {
      name: "Jatoth Jaykrishna",
      batch: "2018/EM/1028",
      designation: "Assistant Manager, Keysight Technologies",
      image: "https://i.pravatar.cc/300?img=7"
    }
  ];

  const exOfficio = [
    {
      name: "Akshay Pandey",
      role: "Immediate Past President",
      batch: "2017/MT/1261",
      designation: "Naib Technologies",
      image: "https://i.pravatar.cc/300?img=53"
    },
    {
      name: "Vishwas Rathi",
      role: "Immediate Past Vice President",
      batch: "2018/CH/0093",
      designation: "Assistant Professor, NIT Kurukshetra",
      image: "https://i.pravatar.cc/300?img=65"
    },
    {
      name: "Bulbir Singh",
      role: "Immediate Past Secretary",
      batch: "2017/EE/0007",
      designation: "Assistant Professor, NIT Hamirpur",
      image: "https://i.pravatar.cc/300?img=58"
    }
  ];

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
                <h1 className="text-5xl font-bold text-[#1e3a8a]">Executive Committee</h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Meet the dedicated leaders driving the BBSBEC Alumni Association forward - 2025
              </p>
            </div>

            {/* Leadership Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Crown className="h-8 w-8 text-[#f59e0b]" />
                Leadership
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {leadership.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500"
                  >
                    <div className="relative h-64 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold rounded-full shadow-lg">
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[#1e3a8a] font-semibold mb-4">{member.designation}</p>
                      <div className="space-y-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1e3a8a] transition-colors group/link"
                        >
                          <div className="w-9 h-9 bg-[#1e3a8a]/10 rounded-lg flex items-center justify-center group-hover/link:bg-[#1e3a8a] transition-colors">
                            <Mail className="h-4 w-4 text-[#1e3a8a] group-hover/link:text-white" />
                          </div>
                          <span>{member.email}</span>
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#1e3a8a] transition-colors group/link"
                        >
                          <div className="w-9 h-9 bg-[#1e3a8a]/10 rounded-lg flex items-center justify-center group-hover/link:bg-[#1e3a8a] transition-colors">
                            <Phone className="h-4 w-4 text-[#1e3a8a] group-hover/link:text-white" />
                          </div>
                          <span>{member.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Committee */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#f59e0b]" />
                Core Committee Members
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] text-white text-xs font-semibold rounded-full">
                          {member.role}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mb-2">{member.batch}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{member.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Members */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Users className="h-8 w-8 text-[#f59e0b]" />
                Executive Committee Members
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {executiveMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#1e3a8a]/30 transition-all duration-300">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mb-2">{member.batch}</p>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ex-Officio */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-[#f59e0b]" />
                Ex-Officio
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exOfficio.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-gray-200 group-hover:ring-[#1e3a8a]/30 transition-all duration-300">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg">
                            {member.role}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mb-2">{member.batch}</p>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-8 border-l-4 border-[#1e3a8a]">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">Committee Tenure</h3>
              <p className="text-gray-700 leading-relaxed">
                The current Executive Committee serves for the term 2024-2026. Committee members are elected by the
                General Body of the Alumni Association and work voluntarily to promote alumni engagement and support
                the institution's growth.
              </p>
            </div>
          </div>

          {/* Sidebar - Quick Links */}
          <QuickLinks quickLinks={quickLinks} />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCommitteePage;