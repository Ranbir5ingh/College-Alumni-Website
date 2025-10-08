import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Shield,
  Award,
  Building2,
  ChevronRight,
  FileText,
  Target,
  UserPlus,
  Briefcase,
  DollarSign,
  Settings,
  CheckCircle2,
  Scale,
  Building,
  MapPin,
  Calendar,
  ChevronDown,
  ExternalLink,
  BookMarked,
} from "lucide-react";
import QuickLinks from "@/components/common/QuickLinks";

const ConstitutionPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Primary colors used in HangoutAlumniPage are mostly from-[#1e3a8a] to-[#2952b3] (blue) and amber/orange for accents.
  const PRIMARY_COLOR_FROM = "from-[#1e3a8a]";
  const PRIMARY_COLOR_TO = "to-[#2952b3]";
  const ACCENT_COLOR_FROM = "from-amber-500";
  const ACCENT_COLOR_TO = "to-orange-600";
  const ACCENT_TEXT_COLOR = "#f59e0b"; // amber-500 color

  const quickLinks = [
    { label: "About Us", path: "/about", icon: BookOpen },
    { label: "Executive Committee", path: "/executive-committee", icon: Users },
    { label: "Constitution", path: "/constitution", icon: Shield },
    { label: "Director's Message", path: "/directors-message", icon: Award },
    {
      label: "Office of Alumni Affairs",
      path: "/office-of-alumni-affairs",
      icon: Building2,
    },
  ];

  const sections = [
    {
      id: "memorandum",
      title: "Memorandum of Association",
      icon: FileText,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      content: [
        { label: "Name", value: "BBSBEC ALUMNI ASSOCIATION" },
        {
          label: "Location",
          value:
            "Baba Banda Singh Bahadur Engineering College, Fatehgarh Sahib-140407, Punjab",
        },
        { label: "Area of Operation", value: "Fatehgarh Sahib, Punjab" },
      ],
    },
    {
      id: "objectives",
      title: "Aims & Objectives",
      icon: Target,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      items: [
        "Encourage alumni to take enduring interest in the progress and development of the Alma Mater",
        "Provide an interface through which alumni remain in touch with students, faculty, and each other",
        "Serve leadership needs, industry collaboration, and generate financial support for current students",
        "Promote exchange of skills through seminars, workshops, training courses and guest lectures",
        "Enable alumni to contribute to the development of the alma mater",
        "Introduce scholarship schemes, awards and prizes for students and faculty",
        "Provide assistance for internships and placements in reputed institutions",
      ],
    },
    {
      id: "membership",
      title: "Membership",
      icon: UserPlus,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      subsections: [
        {
          title: "Eligibility",
          content:
            "Students who successfully complete any degree (B.E., B.Tech, B.Voc, M.Tech, MBA) from BBSBEC automatically become Life members upon payment of membership fees.",
        },
        {
          title: "Member Rights",
          points: [
            "Receive details of college and alumni activities",
            "Exercise voting rights in General Body Meetings",
            "Register on alumni website",
            "Attend alumni meets and events",
            "Avail services and facilities offered by the college",
          ],
        },
        {
          title: "Subscription Rates",
          fees: [
            { type: "Life Membership", amount: "₹2,000", duration: "(for 10 years)" },
            { type: "Annual Membership", amount: "₹500", duration: "(per year)" },
          ],
        },
      ],
    },
    {
      id: "organization",
      title: "Organization Structure",
      icon: Building,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      structure: [
        {
          name: "General Body",
          description: "Consists of all members, holds meetings at least once annually",
          duties: [
            "Set guidelines for Executive Committee",
            "Review Annual Report and Audited Accounts",
            "Honour distinguished Alumni",
            "Distribute awards and scholarships",
            "Elect office bearers and Executive Committee members",
          ],
        },
        {
          name: "Executive Committee",
          description: "Manages affairs of the Association",
          positions: [
            { role: "President", count: 1 },
            { role: "Chairman", count: 1 },
            { role: "Vice President", count: 1 },
            { role: "General Secretary/College Alumni Coordinator", count: 1 },
            { role: "Joint Secretary", count: 1 },
            { role: "Treasurer", count: 1 },
            { role: "Executive Members", count: 4 },
          ],
        },
        {
          name: "Local Chapters",
          description: "Established in various cities (requires minimum 20 members)",
          note: "Sub-Chapters can be formed with 5-19 members",
        },
      ],
    },
    {
      id: "responsibilities",
      title: "Office Bearer Responsibilities",
      icon: Briefcase,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      roles: [
        {
          position: "President",
          duties: [
            "Preside over Executive Committee and General Body meetings",
            "Exercise powers to fulfill Association objectives",
          ],
        },
        {
          position: "Chairman",
          duties: [
            "Assist in implementing Association objectives",
            "Exercise emergency powers in the interest of the Association",
          ],
        },
        {
          position: "Vice President",
          duties: [
            "Act as President in their absence",
            "Render advice to Executive Committee",
          ],
        },
        {
          position: "General Secretary",
          duties: [
            "Maintain Association records",
            "Attend to approved activities",
            "Record and circulate meeting minutes and annual reports",
          ],
        },
        {
          position: "Treasurer",
          duties: [
            "Keep records of Alumni funds",
            "Ensure proper budget utilization",
            "Liaise with college accounts and auditors",
          ],
        },
      ],
    },
    {
      id: "finances",
      title: "Finances & Accounts",
      icon: DollarSign,
      color: `${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO}`,
      content: {
        sources: [
          "Member subscriptions collected by the Institute",
          "Donations from members (by cheque/draft/online)",
          "Other sources approved by Executive Committee",
        ],
        operations: [
          "Financial year: April 1st to March 31st",
          "Bank account for all transactions",
          "Two signatories from President, General Secretary, and Treasurer",
          "Annual audit by Chartered Accountant",
          "Investment advisor may be engaged as needed",
        ],
      },
    },
  ];

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white lg:pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`h-1 w-12 bg-gradient-to-r ${PRIMARY_COLOR_FROM} ${PRIMARY_COLOR_TO} rounded-full`}
                ></div>
                <h1 className="text-5xl font-bold text-[#1e3a8a]">
                  Constitution
                </h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                The governing document of BBSBEC Alumni Association
              </p>

              {/* Hero Section */}
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl mb-12">
                <img
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80"
                  alt="Library Books"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <BookMarked className="h-9 w-9 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">
                        BBSBEC Alumni Association
                      </h2>
                      <p className="text-white/90">
                        Established under Societies Registration Act 1860
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Cards - Apply hover effects */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Building className="h-5 w-5 text-[#1e3a8a]" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                      Name
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    BBSBEC Alumni Association
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <MapPin className="h-5 w-5 text-[#1e3a8a]" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                      Location
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Fatehgarh Sahib, Punjab
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Calendar className="h-5 w-5 text-[#1e3a8a]" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                      Established
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">February 1, 2013</p>
                </div>
              </div>
            </div>

            {/* Constitution Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold text-[#1e3a8a]">
                            {section.title}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Section {index + 1}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Section Content */}
                    <div
                      className={`transition-all duration-300 ${
                        isActive
                          ? "max-h-[5000px] opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-4 border-t border-gray-100">
                          {/* Memorandum Content - Use primary color for list items */}
                          {section.id === "memorandum" && (
                            <div className="space-y-4">
                              {section.content.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-100 transition-all duration-300"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {item.label}
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                      {item.value}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Objectives Content - Use accent color */}
                          {section.id === "objectives" && (
                            <div className="grid gap-3">
                              {section.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-md transition-shadow"
                                >
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${ACCENT_COLOR_FROM} ${ACCENT_COLOR_TO} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <p className="text-gray-700 pt-1">{item}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Membership Content - Use primary/accent colors */}
                          {section.id === "membership" && (
                            <div className="space-y-6">
                              {section.subsections.map((subsection, idx) => (
                                <div
                                  key={idx}
                                  className={`bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a]`}
                                >
                                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">
                                    {subsection.title}
                                  </h3>
                                  {subsection.content && (
                                    <p className="text-gray-700">
                                      {subsection.content}
                                    </p>
                                  )}
                                  {subsection.points && (
                                    <ul className="space-y-2">
                                      {subsection.points.map((point, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-3"
                                        >
                                          <CheckCircle2 className="h-5 w-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" />
                                          <span className="text-gray-700">
                                            {point}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {subsection.fees && (
                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                      {subsection.fees.map((fee, i) => (
                                        <div
                                          key={i}
                                          className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-[#1e3a8a]/30 transition-colors"
                                        >
                                          <p className="text-sm font-semibold text-gray-600 mb-1">
                                            {fee.type}
                                          </p>
                                          <p
                                            className={`text-2xl font-bold text-[#1e3a8a]`}
                                          >
                                            {fee.amount}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {fee.duration}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Organization Content - Use primary color for General Body, accent color for Executive Committee positions */}
                          {section.id === "organization" && (
                            <div className="space-y-6">
                              {section.structure.map((body, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">
                                    {body.name}
                                  </h3>
                                  <p className="text-gray-600 mb-4">
                                    {body.description}
                                  </p>
                                  {body.duties && (
                                    <ul className="space-y-2">
                                      {body.duties.map((duty, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-3"
                                        >
                                          <div className="w-6 h-6 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-white">
                                              {i + 1}
                                            </span>
                                          </div>
                                          <span className="text-gray-700">
                                            {duty}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {body.positions && (
                                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                                      {body.positions.map((position, i) => (
                                        <div
                                          key={i}
                                          className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-white transition-colors border border-transparent hover:border-gray-100"
                                        >
                                          <span className="text-sm font-medium text-gray-700">
                                            {position.role}
                                          </span>
                                          <span
                                            className={`w-8 h-8 bg-gradient-to-br ${ACCENT_COLOR_FROM} ${ACCENT_COLOR_TO} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md`}
                                          >
                                            {position.count}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {body.note && (
                                    <div
                                      className={`mt-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-l-4 border-[${ACCENT_TEXT_COLOR}]`}
                                    >
                                      <p className="text-sm text-gray-800">
                                        {body.note}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Responsibilities Content - Use accent color for icons/list elements */}
                          {section.id === "responsibilities" && (
                            <div className="space-y-4">
                              {section.roles.map((role, idx) => (
                                <div
                                  key={idx}
                                  className={`bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow`}
                                >
                                  <h3 className="text-lg font-bold text-[#1e3a8a] mb-3 flex items-center gap-2">
                                    <Award
                                      className={`h-5 w-5 text-[${ACCENT_TEXT_COLOR}]`}
                                    />
                                    {role.position}
                                  </h3>
                                  <ul className="space-y-2">
                                    {role.duties.map((duty, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-3"
                                      >
                                        <ChevronRight
                                          className={`h-5 w-5 text-[${ACCENT_TEXT_COLOR}] flex-shrink-0 mt-0.5`}
                                        />
                                        <span className="text-gray-700">
                                          {duty}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Finances Content - Use primary color for icons/list elements */}
                          {section.id === "finances" && (
                            <div className="space-y-6">
                              <div
                                className={`bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a]`}
                              >
                                <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">
                                  Fund Sources
                                </h3>
                                <ul className="space-y-2">
                                  {section.content.sources.map((source, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-3"
                                    >
                                      <DollarSign className="h-5 w-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700">
                                        {source}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div
                                className={`bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a]`}
                              >
                                <h3 className="text-lg font-bold text-[#1e3a8a] mb-4">
                                  Financial Operations
                                </h3>
                                <ul className="space-y-2">
                                  {section.content.operations.map(
                                    (operation, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-3"
                                      >
                                        <Settings className="h-5 w-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">
                                          {operation}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Information - Use primary and accent colors */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Amendments - Use accent color for icon, primary for border/bg tint */}
              <div
                className={`bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a] hover:shadow-xl transition-shadow`}
              >
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-2">
                  <Scale className={`h-6 w-6 text-[${ACCENT_TEXT_COLOR}]`} />
                  Amendments
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The Constitution can be amended with the consent of General
                  Body members. Proposals require signed requisition by at least
                  25 alumni. Bye-laws are framed and amended by the Executive
                  Committee.
                </p>
              </div>
              {/* Records Maintained - Use primary color for icon, border/bg tint */}
              <div
                className={`bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-2xl p-6 border-l-4 border-[#1e3a8a] hover:shadow-xl transition-shadow`}
              >
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-[#1e3a8a]" />
                  Records Maintained
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Electronic database of members, meeting minutes, financial
                  records, publications, and all documents required under
                  Societies Registration Act 1860. Members have inspection rights
                  during office hours.
                </p>
              </div>
            </div>
          </div>
          <QuickLinks quickLinks={quickLinks} />
        </div>
      </div>
    </div>
  );
};

export default ConstitutionPage;