import { Heart, Users, GraduationCap, Building, Target, DollarSign, Clock, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const campaigns = [
  {
    id: 1,
    title: "Student Scholarship Fund",
    description: "Support deserving students with financial assistance for their education",
    goal: 100000,
    raised: 75000,
    donors: 245,
    daysLeft: 30,
    category: "Education",
    image: "/scholarship-celebration-ceremony.jpg",
  },
  {
    id: 2,
    title: "New Library Construction",
    description: "Help build a state-of-the-art library facility for current and future students",
    goal: 500000,
    raised: 320000,
    donors: 180,
    daysLeft: 60,
    category: "Infrastructure",
    image: "/university-campus-homecoming-celebration.jpg",
  },
  {
    id: 3,
    title: "Research Innovation Grant",
    description: "Fund cutting-edge research projects and support faculty research initiatives",
    goal: 250000,
    raised: 180000,
    donors: 95,
    daysLeft: 45,
    category: "Research",
    image: "/technology-innovation-conference.jpg",
  },
]

const volunteerOpportunities = [
  {
    title: "Alumni Mentorship Program",
    description: "Guide current students and recent graduates in their career journey",
    timeCommitment: "2-3 hours/month",
    location: "Virtual/In-person",
    participants: "150+ mentors needed",
  },
  {
    title: "Guest Lecture Series",
    description: "Share your expertise by speaking to current students about industry trends",
    timeCommitment: "1-2 hours/semester",
    location: "On-campus/Virtual",
    participants: "50+ speakers needed",
  },
  {
    title: "Career Fair Participation",
    description: "Represent your company and help students explore career opportunities",
    timeCommitment: "4-6 hours/event",
    location: "On-campus",
    participants: "30+ companies needed",
  },
  {
    title: "Alumni Interview Panel",
    description: "Help evaluate scholarship applications and interview prospective students",
    timeCommitment: "3-4 hours/quarter",
    location: "Virtual",
    participants: "25+ interviewers needed",
  },
]

const impactStats = [
  { label: "Students Supported", value: "1,250+", icon: GraduationCap },
  { label: "Scholarships Awarded", value: "$2.5M", icon: DollarSign },
  { label: "Active Volunteers", value: "500+", icon: Users },
  { label: "Projects Funded", value: "45", icon: Building },
]

export default function GiveBack() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Give Back & Make an Impact</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Support current students, fund important initiatives, and volunteer your time to help shape the future of
              our institution and its community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Heart className="mr-2 h-4 w-4" />
                Donate Now
              </Button>
              <Button size="lg" variant="outline">
                Volunteer Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="donate">Donate</TabsTrigger>
              <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              <TabsTrigger value="impact">Our Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="donate" className="space-y-8">
              {/* Featured Campaigns */}
              <div>
                <h2 className="text-3xl font-bold text-center mb-8">Current Fundraising Campaigns</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={campaign.image || "/placeholder.svg"}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{campaign.category}</Badge>
                          <span className="text-sm text-muted-foreground">{campaign.daysLeft} days left</span>
                        </div>
                        <CardTitle className="text-xl">{campaign.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{campaign.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">${campaign.raised.toLocaleString()} raised</span>
                            <span className="text-muted-foreground">of ${campaign.goal.toLocaleString()}</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{campaign.donors} donors</span>
                            <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                          </div>
                        </div>
                        <Button className="w-full">Donate to This Campaign</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Donation Form */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Make a General Donation</h3>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <Label htmlFor="amount">Donation Amount</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        $25
                      </Button>
                      <Button variant="outline" size="sm">
                        $50
                      </Button>
                      <Button variant="outline" size="sm">
                        $100
                      </Button>
                      <Button variant="outline" size="sm">
                        $250
                      </Button>
                    </div>
                    <Input id="amount" placeholder="Enter custom amount" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose where your donation goes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="scholarships">Student Scholarships</SelectItem>
                        <SelectItem value="research">Research Programs</SelectItem>
                        <SelectItem value="facilities">Campus Facilities</SelectItem>
                        <SelectItem value="athletics">Athletics Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea id="message" placeholder="Leave a message with your donation" />
                  </div>
                  <Button className="w-full" size="lg">
                    <Heart className="mr-2 h-4 w-4" />
                    Complete Donation
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="volunteer" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Volunteer Opportunities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Share your expertise, mentor students, and contribute to the growth of our academic community. Your
                  time and knowledge can make a lasting impact.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {volunteerOpportunities.map((opportunity, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{opportunity.title}</CardTitle>
                      <p className="text-muted-foreground">{opportunity.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>Time commitment: {opportunity.timeCommitment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span>Location: {opportunity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{opportunity.participants}</span>
                        </div>
                      </div>
                      <Button className="w-full">Sign Up to Volunteer</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Volunteer Application Form */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Volunteer Application</h3>
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input id="graduationYear" placeholder="e.g., 2015" />
                  </div>
                  <div>
                    <Label htmlFor="interests">Areas of Interest</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select volunteer opportunities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mentorship">Alumni Mentorship</SelectItem>
                        <SelectItem value="speaking">Guest Speaking</SelectItem>
                        <SelectItem value="career-fair">Career Fair</SelectItem>
                        <SelectItem value="interviews">Interview Panel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea id="experience" placeholder="Tell us about your professional background and expertise" />
                  </div>
                  <Button className="w-full" size="lg">
                    Submit Volunteer Application
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Impact Together</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See how alumni contributions and volunteer efforts are making a real difference in the lives of
                  students and the growth of our institution.
                </p>
              </div>

              {/* Success Stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Scholarship Success Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      "Thanks to the alumni scholarship fund, I was able to complete my engineering degree without
                      financial stress. Now I'm working at a top tech company and plan to give back to help future
                      students."
                    </p>
                    <p className="text-sm font-medium">- Maria Rodriguez, Class of 2023</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Research Breakthrough
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      "The research innovation grant funded our breakthrough in renewable energy technology. We've now
                      published in top journals and are working on commercializing our discoveries."
                    </p>
                    <p className="text-sm font-medium">- Dr. James Chen, Faculty Researcher</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Mentorship Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      "My alumni mentor helped me navigate career decisions and land my dream job. The guidance and
                      industry insights were invaluable during my job search."
                    </p>
                    <p className="text-sm font-medium">- Alex Thompson, Class of 2022</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Facility Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      "The new library funded by alumni donations has transformed our campus. Students now have access
                      to modern study spaces and cutting-edge technology."
                    </p>
                    <p className="text-sm font-medium">- Campus Administration</p>
                  </CardContent>
                </Card>
              </div>

              {/* Annual Report */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">2023 Annual Impact Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">$3.2M</div>
                    <div className="text-sm text-muted-foreground">Total Donations Received</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">850</div>
                    <div className="text-sm text-muted-foreground">Students Directly Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">1,200</div>
                    <div className="text-sm text-muted-foreground">Volunteer Hours Contributed</div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <Button variant="outline">Download Full Report</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
