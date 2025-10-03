import { Search, MapPin, Clock, DollarSign, Building, Users, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const jobListings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    postedBy: "Sarah Chen '10",
    postedDate: "2 days ago",
    description:
      "Join our innovative team building next-generation cloud solutions. We're looking for experienced engineers passionate about scalable architecture.",
    requirements: ["5+ years experience", "React/Node.js", "Cloud platforms", "Team leadership"],
    benefits: ["Health insurance", "401k matching", "Flexible PTO", "Remote work options"],
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "GreenTech Innovations",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    postedBy: "Michael Rodriguez '15",
    postedDate: "1 week ago",
    description:
      "Lead marketing initiatives for sustainable technology products. Drive brand awareness and customer acquisition strategies.",
    requirements: ["3+ years marketing experience", "Digital marketing", "Analytics", "Content creation"],
    benefits: ["Health insurance", "Stock options", "Professional development", "Hybrid work"],
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "FinanceAI Corp",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    postedBy: "James Thompson '12",
    postedDate: "3 days ago",
    description:
      "Apply machine learning to financial data analysis. Build predictive models and drive data-driven decision making.",
    requirements: ["PhD/Masters in relevant field", "Python/R", "Machine learning", "Financial modeling"],
    benefits: ["Competitive salary", "Bonus structure", "Health benefits", "Learning budget"],
  },
  {
    id: 4,
    title: "Product Designer",
    company: "UserFirst Design",
    location: "Remote",
    type: "Contract",
    salary: "$70 - $90/hour",
    postedBy: "Alumni Network",
    postedDate: "5 days ago",
    description:
      "Design intuitive user experiences for B2B software products. Collaborate with cross-functional teams to deliver exceptional designs.",
    requirements: ["4+ years UX/UI design", "Figma/Sketch", "User research", "Design systems"],
    benefits: ["Flexible schedule", "Remote work", "Project variety", "Networking opportunities"],
  },
]

const mentorshipPrograms = [
  {
    title: "Career Transition Mentorship",
    description: "Get guidance from alumni who have successfully changed careers",
    participants: "150+ mentors",
    duration: "6 months",
    nextCohort: "March 2024",
  },
  {
    title: "Entrepreneurship Support",
    description: "Connect with alumni entrepreneurs and business leaders",
    participants: "80+ mentors",
    duration: "12 months",
    nextCohort: "April 2024",
  },
  {
    title: "Industry-Specific Guidance",
    description: "Specialized mentorship in tech, healthcare, finance, and more",
    participants: "200+ mentors",
    duration: "3-6 months",
    nextCohort: "Rolling basis",
  },
]

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Career Opportunities</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover job opportunities posted by fellow alumni, access mentorship programs, and advance your career
              with the support of our professional network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Find a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jobs">Job Listings</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="resources">Career Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-card rounded-lg border p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="austin">Austin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Listings */}
              <div className="space-y-4">
                {jobListings.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{job.postedDate}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{job.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {job.requirements.map((req, index) => (
                              <li key={index}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {job.benefits.map((benefit, index) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Posted by <span className="font-medium">{job.postedBy}</span>
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline">Save Job</Button>
                          <Button>Apply Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentorship" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Mentorship Programs</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Connect with experienced alumni who can guide your career journey. Our mentorship programs offer
                  personalized support and industry insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mentorshipPrograms.map((program, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{program.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{program.participants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Duration: {program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>Next cohort: {program.nextCohort}</span>
                        </div>
                      </div>
                      <Button className="w-full">Apply for Mentorship</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Career Resources</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Access tools, guides, and resources to help you advance your career and make the most of your
                  professional network.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Resume Review Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Get your resume reviewed by industry professionals and alumni recruiters.
                    </p>
                    <Button className="w-full">Submit Resume</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Interview Preparation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Practice interviews with alumni and get feedback on your performance.
                    </p>
                    <Button className="w-full">Schedule Session</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Salary Negotiation Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Learn strategies for negotiating salary and benefits from successful alumni.
                    </p>
                    <Button className="w-full">Download Guide</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Industry Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Access detailed reports on job market trends and salary data by industry.
                    </p>
                    <Button className="w-full">View Reports</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Networking Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Join virtual and in-person networking events to expand your professional circle.
                    </p>
                    <Button className="w-full">View Events</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Career Change Toolkit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Resources and guidance for alumni looking to transition to new industries.
                    </p>
                    <Button className="w-full">Access Toolkit</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
