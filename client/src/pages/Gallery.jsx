import { Search, Calendar, Users, MapPin, Download, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const galleryItems = [
  {
    id: 1,
    title: "Annual Gala 2024",
    type: "photo",
    date: "2024-01-20",
    location: "Grand Ballroom",
    attendees: 250,
    category: "Events",
    image: "/elegant-ballroom-gala-event.jpg",
    description:
      "Our annual gala brought together alumni from around the world for an evening of celebration and networking.",
  },
  {
    id: 2,
    title: "Homecoming Weekend",
    type: "photo",
    date: "2023-10-15",
    location: "University Campus",
    attendees: 500,
    category: "Homecoming",
    image: "/university-campus-homecoming-celebration.jpg",
    description:
      "Alumni returned to campus for a weekend of festivities, including the homecoming game and class reunions.",
  },
  {
    id: 3,
    title: "Tech Innovation Conference",
    type: "photo",
    date: "2023-09-22",
    location: "Innovation Center",
    attendees: 180,
    category: "Professional",
    image: "/technology-innovation-conference.jpg",
    description: "Alumni working in technology shared insights on the latest trends and innovations in the industry.",
  },
  {
    id: 4,
    title: "Networking Mixer - San Francisco",
    type: "photo",
    date: "2023-08-10",
    location: "San Francisco, CA",
    attendees: 75,
    category: "Networking",
    image: "/professional-networking-event.png",
    description: "Bay Area alumni gathered for an evening of professional networking and career discussions.",
  },
  {
    id: 5,
    title: "Class of 2013 Reunion",
    type: "photo",
    date: "2023-06-15",
    location: "Alumni Center",
    attendees: 120,
    category: "Reunion",
    image: "/class-reunion-celebration-dinner.jpg",
    description: "The Class of 2013 celebrated their 10-year reunion with dinner, dancing, and reminiscing.",
  },
  {
    id: 6,
    title: "Professional Workshop Series",
    type: "photo",
    date: "2023-05-20",
    location: "Conference Hall",
    attendees: 95,
    category: "Professional",
    image: "/professional-workshop-presentation.jpg",
    description: "Alumni participated in workshops covering leadership, entrepreneurship, and career development.",
  },
  {
    id: 7,
    title: "Scholarship Awards Ceremony",
    type: "photo",
    date: "2023-04-18",
    location: "University Auditorium",
    attendees: 200,
    category: "Awards",
    image: "/scholarship-celebration-ceremony.jpg",
    description:
      "We celebrated scholarship recipients and the generous alumni donors who made their education possible.",
  },
  {
    id: 8,
    title: "Alumni Achievement Awards",
    type: "photo",
    date: "2023-03-25",
    location: "Grand Hall",
    attendees: 300,
    category: "Awards",
    image: "/awards-ceremony-recognition.jpg",
    description: "Outstanding alumni were recognized for their professional achievements and community contributions.",
  },
  {
    id: 9,
    title: "Fundraising Campaign Launch",
    type: "photo",
    date: "2023-02-14",
    location: "Alumni Center",
    attendees: 150,
    category: "Fundraising",
    image: "/fundraising-campaign-success.jpg",
    description: "The launch event for our major fundraising campaign brought together key donors and volunteers.",
  },
]

const categories = ["All", "Events", "Homecoming", "Professional", "Networking", "Reunion", "Awards", "Fundraising"]
const years = ["All Years", "2024", "2023", "2022", "2021", "2020"]

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Photo & Video Gallery</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Relive memorable moments from alumni events, reunions, and celebrations. Browse through our collection of
              photos and videos capturing the spirit of our community.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search gallery..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toLowerCase()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Media Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Media</SelectItem>
                  <SelectItem value="photos">Photos Only</SelectItem>
                  <SelectItem value="videos">Videos Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Gallery</h2>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{item.attendees}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {galleryItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-xl mb-1 hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                              <Badge variant="secondary" className="mb-2">
                                {item.category}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Heart className="h-4 w-4 mr-1" />
                                Like
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{item.attendees} attendees</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Photos
            </Button>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Share Your Photos</h2>
            <p className="text-muted-foreground mb-8">
              Have photos from alumni events or gatherings? Share them with the community to help preserve our memories
              and strengthen our connections.
            </p>
            <Button size="lg">
              Upload Photos
              <Download className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
