"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Briefcase, Calendar, Lock } from "lucide-react"

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would be managed by auth context

  // Mock data - in real app, this would come from API
  const alumni = [
    {
      id: 1,
      name: "Rajesh Kumar",
      batch: "2005",
      department: "Computer Science",
      company: "Google",
      position: "Senior Software Engineer",
      location: "Bangalore, India",
      email: "rajesh.k@email.com",
    },
    {
      id: 2,
      name: "Priya Sharma",
      batch: "2008",
      department: "Electronics",
      company: "Microsoft",
      position: "Principal Engineer",
      location: "Seattle, USA",
      email: "priya.s@email.com",
    },
    // Add more mock data as needed
  ]

  const batches = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010"]
  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Chemical"]

  const filteredAlumni = alumni.filter((person) => {
    return (
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBatch === "" || person.batch === selectedBatch) &&
      (selectedDepartment === "" || person.department === selectedDepartment)
    )
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-lg p-12 shadow-sm border border-border">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-toboggan-bold text-foreground mb-4">Alumni Directory</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Access to the alumni directory is restricted to registered alumni members only.
            </p>
            <p className="text-muted-foreground mb-8">
              Please log in to your alumni account to search and connect with fellow graduates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLoggedIn(true)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Login to Access Directory
              </button>
              <button className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                Register as Alumni
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-toboggan-bold text-foreground mb-6">Alumni Directory</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow BBSB graduates from around the world. Search by name, batch, or department.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <button className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAlumni.length} alumni {searchTerm && `matching "${searchTerm}"`}
          </p>
        </div>

        {/* Alumni Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <div
              key={person.id}
              className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-toboggan-bold">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                  Class of {person.batch}
                </span>
              </div>

              <h3 className="font-toboggan-medium text-lg text-foreground mb-2">{person.name}</h3>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {person.department} • {person.batch}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {person.position} at {person.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {person.location}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Connect
                </button>
                <button className="flex-1 border border-border text-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No alumni found matching your search criteria.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlumniDirectory
