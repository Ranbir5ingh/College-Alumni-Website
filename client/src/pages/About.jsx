import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, History, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">About BBSBEC Alumni Association</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connecting engineering graduates across generations, fostering lifelong relationships, and supporting Baba
              Banda Singh Bahadur Engineering College's continued excellence in technical education.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To strengthen the lifelong connection between Baba Banda Singh Bahadur Engineering College and its
                  engineering graduates by fostering meaningful relationships, supporting technical career development,
                  and encouraging philanthropic engagement that benefits current and future engineering students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be the premier engineering alumni network that empowers graduates to achieve their full potential
                  while contributing to BBSBEC's legacy of excellence in technical education and positive impact on
                  society through engineering innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Alumni Committee */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Alumni Committee</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our dedicated board of alumni volunteers who guide the association's strategic direction and ensure we
              serve our community effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Board President",
                class: "Class of '95",
                profession: "CEO, Johnson & Associates",
                image: "/professional-woman-executive.png",
              },
              {
                name: "Robert Chen",
                role: "Vice President",
                class: "Class of '88",
                profession: "Partner, Chen Law Firm",
                image: "/professional-lawyer.png",
              },
              {
                name: "Maria Rodriguez",
                role: "Secretary",
                class: "Class of '02",
                profession: "Director of Operations, Tech Innovations",
                image: "/professional-woman-director.png",
              },
              {
                name: "James Wilson",
                role: "Treasurer",
                class: "Class of '91",
                profession: "CFO, Wilson Financial Group",
                image: "/professional-man-cfo.png",
              },
              {
                name: "Dr. Lisa Park",
                role: "Events Committee Chair",
                class: "Class of '99",
                profession: "Chief Medical Officer, Regional Hospital",
                image: "/professional-woman-doctor.png",
              },
              {
                name: "Michael Davis",
                role: "Fundraising Committee Chair",
                class: "Class of '85",
                profession: "Founder, Davis Ventures",
                image: "/professional-entrepreneur.png",
              },
            ].map((member, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.class}</CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.profession}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* College History */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <History className="h-8 w-8 text-primary" />
                BBSBEC's Engineering Legacy
              </h2>
              <p className="text-muted-foreground">
                A proud history of engineering excellence and technical innovation in Punjab.
              </p>
            </div>

            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Founded in 2007</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Baba Banda Singh Bahadur Engineering College was established with a vision to provide quality
                    technical education in Punjab. Named after the great Sikh warrior Baba Banda Singh Bahadur, our
                    college has grown to become a leading engineering institution in the region.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <img
                    src="/historic-university-building.jpg"
                    alt="Historic university building"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-card rounded-lg p-6 md:order-2">
                  <img
                    src="/modern-university-campus.png"
                    alt="Modern university campus"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="md:order-1">
                  <h3 className="text-2xl font-semibold mb-4">Engineering Excellence & Growth</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Throughout the years, BBSBEC has been at the forefront of engineering education, research
                    innovation, and industry collaboration. Today, we serve thousands of engineering students across
                    multiple disciplines including Computer Science, Electronics, Mechanical, and Civil Engineering.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-6">Key Milestones</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2007</div>
                    <div className="text-sm text-muted-foreground">College Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2010</div>
                    <div className="text-sm text-muted-foreground">First Batch Graduated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2015</div>
                    <div className="text-sm text-muted-foreground">Research Center Established</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2020</div>
                    <div className="text-sm text-muted-foreground">Industry Partnerships</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
