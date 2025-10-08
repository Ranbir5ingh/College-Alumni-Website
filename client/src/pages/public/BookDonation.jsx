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
  FileText,
  BookMarked,
  Gift,
  Library,
  Heart,
  CheckCircle2,
  ArrowRight,
  Package,
  Mail,
  Sparkles,
  TrendingUp,
  Globe,
  Lightbulb,
  ShoppingCart,
  User
} from "lucide-react";
import QuickLinks from "@/components/common/QuickLinks";

const BookDonationPage = () => {
  const quickLinks = [
    { label: "Hangout with Alumni", path: "/hangout-with-alumni", icon: Users },
    { label: "Alumni Book Donation Program", path: "/book-donation", icon: BookOpen },
  ];


  const steps = [
    {
      number: "01",
      title: "Fill the Preliminary Form",
      description: "Submit the Book Donation Form with details about the book you wish to donate",
      icon: FileText,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      number: "02",
      title: "Library Approval",
      description: "Once your request is accepted by the Library, you'll receive an email confirmation",
      icon: CheckCircle2,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      number: "03",
      title: "Donation Details Form",
      description: "The email will contain a link to form #2 asking for donation method details (e-commerce, personal donation, etc.)",
      icon: Package,
      color: "from-[#1e3a8a] to-[#2952b3]"
    },
    {
      number: "04",
      title: "Complete Your Donation",
      description: "Submit the forms at your earliest. Use your BBSBEC email ID for seamless processing",
      icon: Gift,
      color: "from-[#1e3a8a] to-[#2952b3]"
    }
  ];

  const benefits = [
    {
      icon: Library,
      title: "Strengthen the Library",
      description: "Help build a vibrant collection that supports academic excellence"
    },
    {
      icon: TrendingUp,
      title: "Enable Learning",
      description: "Provide students access to valuable knowledge and resources"
    },
    {
      icon: Heart,
      title: "Give Back",
      description: "Make a meaningful contribution to your alma mater"
    },
    {
      icon: Globe,
      title: "Any Genre Welcome",
      description: "Books from all genres and subjects are appreciated"
    }
  ];

  const donationMethods = [
    {
      icon: ShoppingCart,
      title: "E-Commerce Purchase",
      description: "Buy and send books directly to the library through online retailers"
    },
    {
      icon: Package,
      title: "Personal Donation",
      description: "Donate your own books that you'd like to share with students"
    },
    {
      icon: Gift,
      title: "Bulk Contribution",
      description: "Donate multiple books or contribute to specific collection drives"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-12 bg-gradient-to-r from-[#1e3a8a] to-[#2952b3] rounded-full"></div>
                <h1 className="text-5xl font-bold text-[#1e3a8a]">Alumni Book Donation Program</h1>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Building a stronger foundation, one book at a time
              </p>
            </div>

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
                    <h2 className="text-3xl font-bold">Share Knowledge, Shape Futures</h2>
                    <p className="text-white/90">Contribute to our vibrant library collection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-[#1e3a8a]">About the Program</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  It is not easy to deny that an institute's success is also based on the{" "}
                  <span className="font-semibold text-[#1e3a8a]">strong foundation of its vibrant library</span>.
                  Keeping this in mind, we believe as alumni of BBSBEC, we can contribute in our own small way by
                  donating a book.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The book can be from{" "}
                  <span className="font-semibold text-[#1e3a8a]">any genre</span> and can be donated by following the
                  steps given below. This initiative allows alumni to give back and help build a comprehensive library
                  collection that supports current and future students.
                </p>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-l-4 border-emerald-600 mt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-[#1e3a8a] mb-2">Make an Impact</h3>
                      <p className="text-gray-700">
                        At the end of the day, we are all in the business of sharing knowledge. It would be wonderful
                        if we could give something back via a book.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Award className="h-8 w-8 text-[#f59e0b]" />
                Why Donate?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
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
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How to Donate */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Lightbulb className="h-8 w-8 text-[#f59e0b]" />
                How to Donate
              </h2>
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {step.number}
                        </div>
                        {index !== steps.length - 1 && (
                          <div className="w-1 h-full bg-gradient-to-b from-gray-300 to-gray-200 rounded-full mt-4"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 group-hover:border-[#1e3a8a]/30 group-hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center `}>
                              <Icon className="h-5 w-5 text-[#1e3a8a] opacity-100" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition-colors">
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed pl-13">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donation Methods */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8 flex items-center gap-3">
                <Package className="h-8 w-8 text-[#f59e0b]" />
                Donation Methods
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {donationMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-[#1e3a8a]/30 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {method.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-l-4 border-amber-600 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">Important Note</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Please fill in the forms at the earliest. It is suggested that you{" "}
                    <span className="font-semibold text-[#1e3a8a]">fill your BBSBEC email ID</span> in these forms for
                    smooth communication and processing.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-3xl p-8 text-white shadow-xl">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Donation Form</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Ready to donate? Fill out the preliminary book donation form to get started with your contribution.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-[#1e3a8a] rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <FileText className="h-5 w-5" />
                  <span>Access Form</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Need assistance or have questions about the donation process? We're here to help!
                </p>
                <a
                  href="mailto:alumni@bbsbec.ac.in"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact Us</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Closing Message */}
            <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#2952b3]/5 rounded-3xl p-8 border-l-4 border-[#1e3a8a]">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#2952b3] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3">
                    Together We Grow
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Wishing you all continuous success and hoping that we continue to become better together. Your
                    donation, no matter how small, contributes significantly to building a knowledge-rich environment
                    for future generations of BBSBEC students.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-[#1e3a8a]" />
                    <span>Every book makes a difference</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
<QuickLinks quickLinks={quickLinks} />
        </div>
      </div>
    </div>
  );
};

export default BookDonationPage;