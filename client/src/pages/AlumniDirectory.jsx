import { Search, MapPin, Briefcase, Mail, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const alumniData = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    graduationYear: "2010",
    degree: "Computer Science",
    currentPosition: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    industry: "Technology",
    bio: "Leading AI research initiatives and mentoring junior developers.",
    image: "/professional-doctor-headshot.png",
    linkedin: "https://linkedin.com/in/sarahchen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    interests: ["AI/ML", "Mentorship", "Open Source"],
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    graduationYear: "2015",
    degree: "Business Administration",
    currentPosition: "Marketing Director",
    company: "Tesla",
    location: "Austin, TX",
    industry: "Automotive",
    bio: "Driving sustainable transportation through innovative marketing strategies.",
    image: "/professional-headshot-engineer.jpg",
    linkedin: "https://linkedin.com/in/mrodriguez",
    email: "michael.r@email.com",
    interests: ["Sustainability", "Innovation", "Leadership"],
  },
  {
    id: 3,
    name: "Dr. Emily Watson",
    graduationYear: "2008",
    degree: "Biomedical Engineering",
    currentPosition: "Research Scientist",
    company: "Johnson & Johnson",
    location: "New Brunswick, NJ",
    industry: "Healthcare",
    bio: "Developing next-generation medical devices to improve patient outcomes.",
    image: "/professional-woman-software-engineer.png",
    linkedin: "https://linkedin.com/in/emilywatson",
    email: "emily.watson@email.com",
    interests: ["Medical Innovation", "Research", "Healthcare"],
  },
  {
    id: 4,
    name: "James Thompson",
    graduationYear: "2012",
    degree: "Finance",
    currentPosition: "Investment Manager",
    company: "Goldman Sachs",
    location: "New York, NY",
    industry: "Finance",
    bio: "Managing portfolios and providing strategic financial guidance to clients.",
    image: "/professional-man-entrepreneur-ceo.jpg",
    linkedin: "https://linkedin.com/in/jamesthompson",
    email: "james.t@email.com",
    interests: ["Investment Strategy", "Financial Planning", "Mentorship"],
  },
  {
    id: 5,
    name: "Dr. Priya Patel",
    graduationYear: "2009",
    degree: "Medicine",
    currentPosition: "Cardiologist",
    company: "Mayo Clinic",
    location: "Rochester, MN",
    industry: "Healthcare",
    bio: "Specializing in interventional cardiology and cardiac research.",
    image: "/professional-doctor-headshot.png",
    linkedin: "https://linkedin.com/in/priyapatel",
    email: "priya.patel@email.com",
    interests: ["Cardiology", "Medical Research", "Patient Care"],
  },
  {
    id: 6,
    name: "David Kim",
    graduationYear: "2014",
    degree: "Mechanical Engineering",
    currentPosition: "Product Manager",
    company: "SpaceX",
    location: "Hawthorne, CA",
    industry: "Aerospace",
    bio: "Leading product development for next-generation spacecraft systems.",
    image: "/professional-headshot-engineer.jpg",
    linkedin: "https://linkedin.com/in/davidkim",
    email: "david.kim@email.com",
    interests: ["Space Technology", "Product Development", "Innovation"],
  },
]

export default function AlumniDirectory() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">BBSBEC Alumni Directory</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with fellow BBSBEC engineering alumni from around the world. Discover their achievements, current
              roles in technology and engineering, and opportunities for collaboration and mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, company, or position..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Graduation Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2020s">2020s</SelectItem>
                  <SelectItem value="2010s">2010s</SelectItem>
                  <SelectItem value="2000s">2000s</SelectItem>
                  <SelectItem value="1990s">1990s</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="aerospace">Aerospace</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="newyork">New York</SelectItem>
                  <SelectItem value="texas">Texas</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alumni Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniData.map((alumni) => (
              <Card key={alumni.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={alumni.image || "/placeholder.svg"}
                      alt={alumni.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{alumni.name}</CardTitle>
                  <p className="text-muted-foreground">Class of {alumni.graduationYear}</p>
                  <Badge variant="secondary">{alumni.degree}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-medium">{alumni.currentPosition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{alumni.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{alumni.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">{alumni.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {alumni.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Mail className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
