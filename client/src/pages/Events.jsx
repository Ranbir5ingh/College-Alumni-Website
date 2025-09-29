"use client"

import { useState } from "react"
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"

const Events = () => {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Alumni Meet 2024",
      date: "2024-04-15",
      time: "10:00 AM - 6:00 PM",
      location: "BBSB Campus, Fatehgarh Sahib",
      description:
        "Join us for our biggest alumni gathering featuring networking sessions, awards ceremony, campus tour, and cultural programs.",
      attendees: 250,
      category: "Networking",
      featured: true,
    },
    {
      id: 2,
      title: "Tech Talk: Future of AI in Engineering",
      date: "2024-04-20",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual Event",
      description: "Expert panel discussion on artificial intelligence applications in various engineering domains.",
      attendees: 150,
      category: "Education",
      speaker: "Dr. Rajesh Kumar (Class of 2005)",
    },
    {
      id: 3,
      title: "Career Guidance Workshop",
      date: "2024-04-25",
      time: "10:00 AM - 12:00 PM",
      location: "BBSB Campus",
      description: "Interactive workshop for current students featuring industry experts and successful alumni.",
      attendees: 100,
      category: "Career",
    },
  ]

  const pastEvents = [
    {
      id: 4,
      title: "Alumni Homecoming 2023",
      date: "2023-12-10",
      location: "BBSB Campus",
      description: "Successful homecoming event with 300+ alumni attending from across the globe.",
      attendees: 300,
      photos: 45,
    },
    {
      id: 5,
      title: "Industry Connect Summit",
      date: "2023-10-15",
      location: "Hotel Radisson, Chandigarh",
      description: "Professional networking event connecting alumni with industry leaders.",
      attendees: 180,
      photos: 32,
    },
  ]

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-toboggan-bold text-foreground mb-6">Events</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected through our alumni events, workshops, and networking opportunities.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "upcoming"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "past"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        {activeTab === "upcoming" && (
          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`bg-card rounded-lg shadow-sm border border-border overflow-hidden ${
                  event.featured ? "ring-2 ring-primary/20" : ""
                }`}
              >
                {event.featured && (
                  <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Featured Event</div>
                )}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-toboggan-bold text-foreground mb-2">{event.title}</h3>
                          <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">{event.description}</p>

                      {event.speaker && (
                        <p className="text-sm text-foreground mb-4">
                          <strong>Speaker:</strong> {event.speaker}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {event.attendees} registered
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-4">
                      <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Register Now
                      </button>
                      <button className="w-full border border-border text-foreground py-3 px-6 rounded-lg font-medium hover:bg-muted transition-colors">
                        Add to Calendar
                      </button>
                      <button className="w-full text-primary hover:text-primary/80 font-medium flex items-center justify-center">
                        Share Event
                        <ArrowRight className="ml-2 h-4 w-4" />
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
          <div className="grid md:grid-cols-2 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <h3 className="text-xl font-toboggan-bold text-foreground mb-3">{event.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{event.description}</p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} attendees
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    View Photos ({event.photos})
                  </button>
                  <button className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                    Event Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
