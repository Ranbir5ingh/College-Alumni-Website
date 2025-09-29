import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "NYC Alumni Networking Mixer",
      date: "April 18, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "The Rooftop at 230 Fifth, Manhattan, NY",
      attendees: 45,
      category: "Networking",
      description: "Join fellow alumni in the Big Apple for an evening of networking, drinks, and city views.",
    },
    {
      title: "Career Development Workshop",
      date: "April 25, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      attendees: 120,
      category: "Professional Development",
      description: "Learn essential skills for career advancement in today's competitive job market.",
    },
    {
      title: "Annual Golf Tournament",
      date: "May 15, 2024",
      time: "8:00 AM - 5:00 PM",
      location: "Pebble Beach Golf Links, CA",
      attendees: 80,
      category: "Recreation",
      description: "A day of golf, networking, and fundraising for student scholarships.",
    },
    {
      title: "Tech Industry Panel Discussion",
      date: "May 22, 2024",
      time: "7:00 PM - 8:30 PM",
      location: "Silicon Valley Campus, CA",
      attendees: 200,
      category: "Industry",
      description: "Hear from alumni leaders in tech about industry trends and opportunities.",
    },
  ]

  const pastEvents = [
    {
      title: "Homecoming Weekend 2023",
      date: "October 14-16, 2023",
      location: "Main Campus",
      attendees: 2500,
      category: "Homecoming",
      description: "Three days of celebration, campus tours, and reconnecting with classmates.",
    },
    {
      title: "Los Angeles Alumni Gala",
      date: "September 8, 2023",
      location: "Beverly Hills Hotel, CA",
      attendees: 300,
      category: "Gala",
      description: "An elegant evening celebrating alumni achievements and raising funds for scholarships.",
    },
    {
      title: "Young Alumni Happy Hour",
      date: "August 15, 2023",
      location: "Chicago, IL",
      attendees: 75,
      category: "Social",
      description: "Recent graduates gathered for drinks and networking in the Windy City.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">BBSBEC Alumni Events</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connect with fellow BBSBEC engineering alumni at networking events, technical workshops, and social
              gatherings across India and around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid gap-6">
                {upcomingEvents.map((event, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="secondary">{event.category}</Badge>
                          <Button>Register Now</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.attendees} registered
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              <div className="grid gap-6">
                {pastEvents.map((event, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline">{event.category}</Badge>
                          <Button variant="outline">View Photos</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.attendees} attended
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
