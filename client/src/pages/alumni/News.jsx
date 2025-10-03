import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const newsArticles = [
  {
    id: 1,
    title: "Alumni Startup Raises $50M in Series B Funding",
    excerpt:
      "TechVenture, founded by Class of 2015 graduate Sarah Kim, secures major funding round to expand AI-powered solutions.",
    content:
      "In a significant milestone for our alumni community, TechVenture, the innovative AI startup founded by Sarah Kim (Class of 2015), has successfully raised $50 million in Series B funding...",
    author: "Alumni Relations Team",
    publishDate: "2024-01-15",
    category: "Alumni Success",
    readTime: "3 min read",
    image: "/startup-funding-announcement.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "New Scholarship Program Launches with $2M Endowment",
    excerpt:
      "Thanks to generous alumni donations, the university announces a new scholarship program supporting underrepresented students in STEM fields.",
    content:
      "We are thrilled to announce the launch of the Alumni Excellence Scholarship Program, made possible by the generous contributions of our alumni community...",
    author: "Development Office",
    publishDate: "2024-01-12",
    category: "University News",
    readTime: "4 min read",
    image: "/scholarship-celebration-ceremony.jpg",
    featured: true,
  },
  {
    id: 3,
    title: "Class of 2010 Reunion Planning Committee Formed",
    excerpt:
      "Volunteers needed for the upcoming 15-year reunion celebration. Join the planning committee to help create an unforgettable event.",
    content:
      "The Class of 2010 is gearing up for their 15-year reunion, and we're looking for enthusiastic volunteers to join the planning committee...",
    author: "Reunion Committee",
    publishDate: "2024-01-10",
    category: "Events",
    readTime: "2 min read",
    image: "/class-reunion-planning-meeting.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Alumni Mentorship Program Expands Globally",
    excerpt:
      "The successful mentorship program now includes international alumni, connecting students with mentors across six continents.",
    content:
      "Building on the tremendous success of our alumni mentorship program, we're excited to announce its global expansion...",
    author: "Career Services",
    publishDate: "2024-01-08",
    category: "Programs",
    readTime: "3 min read",
    image: "/mentorship-meeting.png",
    featured: false,
  },
  {
    id: 5,
    title: "Record-Breaking Fundraising Campaign Concludes",
    excerpt:
      "The 'Building Tomorrow' campaign exceeds its $10M goal, raising $12.5M for campus improvements and student support.",
    content:
      "We are proud to announce that our 'Building Tomorrow' fundraising campaign has concluded with unprecedented success...",
    author: "Fundraising Team",
    publishDate: "2024-01-05",
    category: "Fundraising",
    readTime: "4 min read",
    image: "/fundraising-campaign-success.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Distinguished Alumni Awards 2024 Recipients Announced",
    excerpt:
      "Five outstanding alumni recognized for their professional achievements and contributions to society at the annual awards ceremony.",
    content: "The Alumni Association is pleased to announce the recipients of the 2024 Distinguished Alumni Awards...",
    author: "Awards Committee",
    publishDate: "2024-01-03",
    category: "Awards",
    readTime: "5 min read",
    image: "/awards-ceremony-recognition.jpg",
    featured: false,
  },
]

const categories = ["All", "Alumni Success", "University News", "Events", "Programs", "Fundraising", "Awards"]

export default function News() {
  const featuredArticles = newsArticles.filter((article) => article.featured)
  const regularArticles = newsArticles.filter((article) => !article.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">News & Updates</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay connected with the latest news from our alumni community, university updates, and stories of success
              from graduates around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search news articles..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {featuredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">{article.category}</Badge>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">{article.title}</CardTitle>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Articles */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {article.category}
                  </Badge>
                  <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-3">{article.excerpt}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read More
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest alumni news, event announcements, and success stories
              directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email address" className="flex-1" />
              <Button>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
