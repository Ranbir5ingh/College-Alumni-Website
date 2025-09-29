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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Stay connected through our alumni events, workshops, and networking opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="mb-10">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "upcoming"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "past"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
              >
                {event.featured && (
                  <div className="bg-blue-600 text-white px-6 py-2 text-sm font-medium">
                    Featured Event
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-5 leading-relaxed">
                        {event.description}
                      </p>

                      {event.speaker && (
                        <p className="text-sm text-gray-700 mb-5">
                          <span className="font-medium">Speaker:</span> {event.speaker}
                        </p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{event.attendees} registered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:w-48">
                      <button className="w-full bg-blue-600 text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Register Now
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Add to Calendar
                      </button>
                      <button className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-1 py-2">
                        Share Event
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past Events */}
        {activeTab === "past" && (
          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    View Photos ({event.photos})
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Event Report
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
