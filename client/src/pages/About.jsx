const About = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-toboggan-bold text-foreground mb-6">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about our mission, vision, and the dedicated team that makes our alumni network thrive.
          </p>
        </div>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-toboggan-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To foster lifelong connections among BBSB Engineering College alumni, creating a vibrant community that
                supports professional growth, personal development, and gives back to our alma mater.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We strive to bridge the gap between education and industry, providing mentorship opportunities and
                career guidance to current students while celebrating the achievements of our graduates.
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-toboggan-bold text-foreground mb-6">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To be the most connected and impactful engineering alumni network in the region, known for innovation,
                excellence, and social responsibility.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We envision a future where every BBSB graduate contributes to technological advancement and societal
                progress, supported by a strong network of peers and mentors.
              </p>
            </div>
          </div>
        </section>

        {/* Alumni Committee */}
        <section id="committee" className="mb-16">
          <h2 className="text-3xl font-toboggan-bold text-foreground text-center mb-12">Alumni Committee</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Rajesh Kumar",
                position: "President",
                batch: "Class of 1995",
                company: "Former Director, Tech Mahindra",
              },
              {
                name: "Priya Sharma",
                position: "Vice President",
                batch: "Class of 2000",
                company: "Senior VP, Infosys",
              },
              { name: "Amit Singh", position: "Secretary", batch: "Class of 2005", company: "Founder, StartupTech" },
              { name: "Neha Gupta", position: "Treasurer", batch: "Class of 2003", company: "CFO, TechCorp" },
              {
                name: "Rohit Verma",
                position: "Events Coordinator",
                batch: "Class of 2008",
                company: "Director, Microsoft India",
              },
              {
                name: "Anjali Patel",
                position: "Outreach Head",
                batch: "Class of 2010",
                company: "VP Engineering, Amazon",
              },
            ].map((member, index) => (
              <div key={index} className="bg-card rounded-lg p-6 text-center shadow-sm border border-border">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-toboggan-bold text-xl">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="font-toboggan-medium text-lg text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-1">{member.position}</p>
                <p className="text-sm text-muted-foreground mb-2">{member.batch}</p>
                <p className="text-sm text-muted-foreground">{member.company}</p>
              </div>
            ))}
          </div>
        </section>

        {/* College History */}
        <section id="history" className="mb-16">
          <h2 className="text-3xl font-toboggan-bold text-foreground text-center mb-12">College History</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 shadow-sm border border-border">
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="font-toboggan-medium text-xl text-foreground mb-2">1999 - Foundation</h3>
                  <p className="text-muted-foreground">
                    Baba Banda Singh Bahadur Engineering College was established with a vision to provide quality
                    technical education in Punjab. Named after the great Sikh warrior and martyr, the college began with
                    just 3 departments.
                  </p>
                </div>
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="font-toboggan-medium text-xl text-foreground mb-2">2005 - Expansion</h3>
                  <p className="text-muted-foreground">
                    The college expanded to include 6 engineering departments and received accreditation from AICTE. The
                    first batch of Computer Science and Electronics graduates made their mark in leading tech companies.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="font-toboggan-medium text-xl text-foreground mb-2">2010 - Recognition</h3>
                  <p className="text-muted-foreground">
                    BBSB Engineering College received recognition from Punjab Technical University and established
                    research centers in emerging technologies. Alumni started founding successful startups and taking
                    leadership roles in MNCs.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="font-toboggan-medium text-xl text-foreground mb-2">2020 - Digital Transformation</h3>
                  <p className="text-muted-foreground">
                    The college embraced digital learning and established state-of-the-art labs for AI, IoT, and
                    cybersecurity. Alumni network grew to over 5000 graduates working across 25+ countries.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="font-toboggan-medium text-xl text-foreground mb-2">2024 - Present</h3>
                  <p className="text-muted-foreground">
                    Today, BBSB Engineering College stands as a premier institution with a strong alumni network
                    contributing to technological advancement worldwide. The college continues to innovate in education
                    and research.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
