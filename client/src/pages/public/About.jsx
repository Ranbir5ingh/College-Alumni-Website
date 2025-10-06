import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, History, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Hero Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-[#1e40af]">
              About BBSBEC Alumni Association
            </h1>
            <p className="text-xl md:text-2xl text-[#64748b] text-balance leading-relaxed">
              Connecting engineering graduates across generations, fostering
              lifelong relationships, and supporting Baba Banda Singh Bahadur
              Engineering College's continued excellence in technical education.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#f9fafb]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border border-[#e5e7eb] shadow-lg hover:shadow-xl hover:border-[#0a4d91] transition-all duration-300 bg-white group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1e40af] to-[#0a4d91] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#1e40af] text-3xl font-bold">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#64748b] leading-relaxed text-lg">
                  To strengthen the lifelong connection between Baba Banda Singh
                  Bahadur Engineering College and its engineering graduates by
                  fostering meaningful relationships, supporting technical
                  career development, and encouraging philanthropic engagement
                  that benefits current and future engineering students.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#e5e7eb] shadow-lg hover:shadow-xl hover:border-[#0a4d91] transition-all duration-300 bg-white group">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-[#1e40af] text-3xl font-bold">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#64748b] leading-relaxed text-lg">
                  To be the premier engineering alumni network that empowers
                  graduates to achieve their full potential while contributing
                  to BBSBEC's legacy of excellence in technical education and
                  positive impact on society through engineering innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alumni Committee */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1e40af]">
              Alumni Committee
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto text-lg">
              Our dedicated board of alumni volunteers who guide the
              association's strategic direction and ensure we serve our
              community effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                // role: "Board President",
                class: "Class of '95",
                profession: "CEO, Johnson & Associates",
                image:
                  "https://images.unsplash.com/photo-1696453423411-3fc7847a9611?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "Robert Chen",
                // role: "Vice President",
                class: "Class of '88",
                profession: "Partner, Chen Law Firm",
                image:
                  "https://images.unsplash.com/photo-1686643184179-e4b65e15022e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGh1bWFuJTIwc29sbyUyMHBvcnRyYWl0c3xlbnwwfHwwfHx8MA%3D%3D",
              },
              {
                name: "Maria Rodriguez",
                // role: "Secretary",
                class: "Class of '02",
                profession: "Director of Operations, Tech Innovations",
                image:
                  "https://media.istockphoto.com/id/2183461029/photo/professional-asian-businesswoman-smiling-confidently-with-her-arms-crossed-in-office.jpg?s=1024x1024&w=is&k=20&c=AYEcEoDVP_VKeASevCaynnrbYxIm4ujLjv7bgXRTS60=",
              },
              {
                name: "James Wilson",
                // role: "Treasurer",
                class: "Class of '91",
                profession: "CFO, Wilson Financial Group",
                image:
                  "https://images.unsplash.com/photo-1619241805829-34fb64299391?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGh1bWFuJTIwc29sbyUyMHBvcnRyYWl0c3xlbnwwfHwwfHx8MA%3D%3D",
              },
              {
                name: "Dr. Lisa Park",
                // role: "Events Committee Chair",
                class: "Class of '99",
                profession: "Chief Medical Officer, Regional Hospital",
                image:
                  "https://plus.unsplash.com/premium_photo-1672857822411-ad82b8180078?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aHVtYW4lMjBzb2xvJTIwcG9ydHJhaXRzfGVufDB8fDB8fHww",
              },
              {
                name: "Michael Davis",
                // role: "Fundraising Committee Chair",
                class: "Class of '85",
                profession: "Founder, Davis Ventures",
                image:
                  "https://images.unsplash.com/photo-1686643184179-e4b65e15022e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGh1bWFuJTIwc29sbyUyMHBvcnRyYWl0c3xlbnwwfHwwfHx8MA%3D%3D",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="text-center border border-[#e5e7eb] shadow-lg hover:shadow-2xl hover:border-[#0a4d91] transition-all duration-300 bg-white group overflow-hidden"
              >
                <CardHeader>
                  <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#e5e7eb] group-hover:border-[#0a4d91] transition-all duration-300">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-[#1e40af] text-xl">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-[#64748b] font-medium">
                    {member.class}
                  </CardDescription>
                  {/* <Badge className="mt-3 bg-[#f59e0b] text-white hover:bg-[#d97706] border-none px-4 py-1">
                    {member.role}
                  </Badge> */}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#64748b]">{member.profession}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* College History */}
      <section className="py-20 bg-[#f9fafb]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-[#1e40af] to-[0a4d91] rounded-lg flex items-center justify-center">
                  <History className="h-6 w-6 text-white" />
                </div> */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#1e40af]">
                  BBSBEC's Engineering Legacy
                </h2>
              </div>
              <p className="text-[#64748b] text-lg">
                A proud history of engineering excellence and technical
                innovation in Punjab.
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5e7eb] hover:border-[#0a4d91] hover:shadow-xl transition-all duration-300">
                  <h3 className="text-3xl font-bold mb-6 text-[#1e40af]">
                    Founded in 2007
                  </h3>
                  <p className="text-[#64748b] leading-relaxed text-lg">
                    Baba Banda Singh Bahadur Engineering College was established
                    with a vision to provide quality technical education in
                    Punjab. Named after the great Sikh warrior Baba Banda Singh
                    Bahadur, our college has grown to become a leading
                    engineering institution in the region.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e5e7eb] hover:shadow-xl hover:border-[#0a4d91] transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=886&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Historic university building"
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-[#e5e7eb] hover:shadow-xl hover:border-[#0a4d91] transition-all duration-300 md:order-2">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Modern university campus"
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#e5e7eb] hover:border-[#0a4d91] hover:shadow-xl transition-all duration-300 md:order-1">
                  <h3 className="text-3xl font-bold mb-6 text-[#1e40af]">
                    Engineering Excellence & Growth
                  </h3>
                  <p className="text-[#64748b] leading-relaxed text-lg">
                    Throughout the years, BBSBEC has been at the forefront of
                    engineering education, research innovation, and industry
                    collaboration. Today, we serve thousands of engineering
                    students across multiple disciplines including Computer
                    Science, Electronics, Mechanical, and Civil Engineering.
                  </p>
                </div>
              </div>

              <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-[#e5e7eb] mt-16">
                <h3 className="text-3xl font-bold mb-10 text-[#1e40af]">
                  Key Milestones
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-8 rounded-xl bg-[#f9fafb] border-2 border-[#e5e7eb] hover:bg-[#0a4d91] hover:border-[#0a4d91] transition-all duration-300 group shadow-md hover:shadow-xl">
                    <div className="text-5xl font-bold text-[#1e40af] mb-3 group-hover:text-white transition-colors">
                      2007
                    </div>
                    <div className="text-sm font-medium text-[#64748b] group-hover:text-white transition-colors">
                      College Founded
                    </div>
                  </div>
                  <div className="text-center p-8 rounded-xl bg-[#f9fafb] border-2 border-[#e5e7eb] hover:bg-[#0a4d91] hover:border-[#0a4d91] transition-all duration-300 group shadow-md hover:shadow-xl">
                    <div className="text-5xl font-bold text-[#1e40af] mb-3 group-hover:text-white transition-colors">
                      2010
                    </div>
                    <div className="text-sm font-medium text-[#64748b] group-hover:text-white transition-colors">
                      First Batch Graduated
                    </div>
                  </div>
                  <div className="text-center p-8 rounded-xl bg-[#f9fafb] border-2 border-[#e5e7eb] hover:bg-[#0a4d91] hover:border-[#0a4d91] transition-all duration-300 group shadow-md hover:shadow-xl">
                    <div className="text-5xl font-bold text-[#1e40af] mb-3 group-hover:text-white transition-colors">
                      2015
                    </div>
                    <div className="text-sm font-medium text-[#64748b] group-hover:text-white transition-colors">
                      Research Center Established
                    </div>
                  </div>
                  <div className="text-center p-8 rounded-xl bg-[#f9fafb] border-2 border-[#e5e7eb] hover:bg-[#0a4d91] hover:border-[#0a4d91] transition-all duration-300 group shadow-md hover:shadow-xl">
                    <div className="text-5xl font-bold text-[#1e40af] mb-3 group-hover:text-white transition-colors">
                      2020
                    </div>
                    <div className="text-sm font-medium text-[#64748b] group-hover:text-white transition-colors">
                      Industry Partnerships
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
