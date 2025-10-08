
import QuickLinks from "@/components/common/QuickLinks";
import { MapPin, Mail, Phone, Clock, Building2, Users, Navigation, ExternalLink, BookOpen, Shield, Award } from "lucide-react";

const OfficeOfAlumniAffairsPage = () => {
  const contactInfo = [
    {
      icon: Building2,
      title: "Office Location",
      details: [
        "Office of Alumni Affairs",
        "Administrative Block, 2nd Floor",
        "BBSBEC Campus",
        "Fatehgarh Sahib, Punjab - 140407"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "General: alumni@bbsbec.ac.in",
        "Support: support.alumni@bbsbec.ac.in",
        "Events: events.alumni@bbsbec.ac.in"
      ],
      links: [
        "mailto:alumni@bbsbec.ac.in",
        "mailto:support.alumni@bbsbec.ac.in",
        "mailto:events.alumni@bbsbec.ac.in"
      ]
    },
    {
      icon: Phone,
      title: "Contact Numbers",
      details: [
        "Office: +91 1763 503 000",
        "Mobile: +91 98765 43210",
        "Fax: +91 1763 503 001"
      ],
      links: [
        "tel:+911763503000",
        "tel:+919876543210",
        "tel:+911763503001"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
        "Sunday & Holidays: Closed"
      ]
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Amarjit Singh",
      role: "Director, Alumni Affairs",
      image: "https://i.pravatar.cc/300?img=33",
      email: "director.alumni@bbsbec.ac.in",
      phone: "+91 1763 503 100"
    },
    {
      name: "Prof. Manpreet Kaur",
      role: "Deputy Director",
      image: "https://i.pravatar.cc/300?img=47",
      email: "deputy.alumni@bbsbec.ac.in",
      phone: "+91 1763 503 101"
    },
    {
      name: "Rajesh Kumar",
      role: "Alumni Relations Manager",
      image: "https://i.pravatar.cc/300?img=12",
      email: "manager.alumni@bbsbec.ac.in",
      phone: "+91 1763 503 102"
    },
    {
      name: "Priya Sharma",
      role: "Events Coordinator",
      image: "https://i.pravatar.cc/300?img=45",
      email: "events.alumni@bbsbec.ac.in",
      phone: "+91 1763 503 103"
    }
  ];

  const services = [
    {
      icon: "🎓",
      title: "Alumni Registration",
      description: "Register and update your profile in our alumni database"
    },
    {
      icon: "🤝",
      title: "Networking Events",
      description: "Organize and coordinate alumni meetups and networking sessions"
    },
    {
      icon: "💼",
      title: "Career Services",
      description: "Job postings, career guidance, and mentorship programs"
    },
    {
      icon: "🎉",
      title: "Reunions & Meets",
      description: "Plan and execute batch reunions and annual alumni meets"
    },
    {
      icon: "📰",
      title: "Communications",
      description: "Newsletters, updates, and alumni success stories"
    },
    {
      icon: "🎁",
      title: "Giving Programs",
      description: "Facilitate donations, scholarships, and giving initiatives"
    }
  ];

    const quickLinks = [
    { label: "About Us", path: "/about", icon: BookOpen },
    { label: "Executive Committee", path: "/executive-committee", icon: Users },
    { label: "Constitution", path: "/constitution", icon: Shield},
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
                <h1 className="text-5xl font-bold text-[#1e3a8a]">Office of Alumni Affairs</h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your connection to BBSBEC and fellow alumni worldwide
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">Welcome to the Office of Alumni Affairs</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Office of Alumni Affairs serves as the primary liaison between BBSBEC and its distinguished alumni community. 
                    We are dedicated to fostering lifelong connections, facilitating networking opportunities, and supporting initiatives 
                    that benefit both alumni and the institution.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to engage, connect, and serve our global alumni network while promoting the values and excellence 
                    that define BBSBEC. Whether you're looking to reconnect with classmates, contribute to the institution, or access 
                    alumni services, we're here to help.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <MapPin className="h-8 w-8 text-[#f59e0b]" />
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a]/10 to-[#2952b3]/10 rounded-xl flex items-center justify-center">
                            <Icon className="h-6 w-6 text-[#1e3a8a]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-3">{info.title}</h3>
                          <div className="space-y-2">
                            {info.details.map((detail, idx) => (
                              info.links && info.links[idx] ? (
                                <a
                                  key={idx}
                                  href={info.links[idx]}
                                  className="block text-sm text-gray-600 hover:text-[#1e3a8a] transition-colors"
                                >
                                  {detail}
                                </a>
                              ) : (
                                <p key={idx} className="text-sm text-gray-600">
                                  {detail}
                                </p>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-3">
                  <Navigation className="h-7 w-7 text-[#f59e0b]" />
                  Find Us on Campus
                </h2>
              </div>
              <div className="relative h-96 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1716.330700343041!2d76.40030390674546!3d30.643498844915843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39101c300f42c193%3A0xd019938480d0863a!2sBaba%20Banda%20Singh%20Bahadur%20Engineering%20College!5e0!3m2!1sen!2sin!4v1759854098582!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
                <a
                  href="https://www.google.com/maps/search/BBSBEC+Fatehgarh+Sahib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 px-4 py-2 bg-white hover:bg-gray-50 text-[#1e3a8a] rounded-xl shadow-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-xl"
                >
                  View in Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="h-5 w-5 text-[#1e3a8a] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address</p>
                    <p>Office of Alumni Affairs, Administrative Block, 2nd Floor</p>
                    <p>Baba Banda Singh Bahadur Engineering College</p>
                    <p>Fatehgarh Sahib, Punjab - 140407, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Services */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Users className="h-8 w-8 text-[#f59e0b]" />
                Our Services
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                  >
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Users className="h-8 w-8 text-[#f59e0b]" />
                Meet Our Team
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                  >
                    <div className="flex gap-6 p-6">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#1e3a8a]/30 transition-all duration-300">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1e3a8a] transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-[#1e3a8a] font-semibold mb-3">{member.role}</p>
                        <div className="space-y-1">
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#1e3a8a] transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {member.email}
                          </a>
                          <a
                            href={`tel:${member.phone}`}
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#1e3a8a] transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-3xl p-8 md:p-10 text-white">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">Have Questions?</h3>
                <p className="text-white/90 text-lg mb-6">
                  Our team is here to assist you. Whether you need help with registration, have questions about events, 
                  or want to get involved, we're just a message away.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="mailto:alumni@bbsbec.ac.in"
                    className="group px-8 py-4 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f59e0b] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Email Us
                  </a>
                  <a
                    href="tel:+911763503000"
                    className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#1e3a8a] rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm inline-flex items-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Call Us
                  </a>
                </div>
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

export default OfficeOfAlumniAffairsPage;