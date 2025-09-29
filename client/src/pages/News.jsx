const News = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-toboggan-bold text-foreground mb-6">News & Updates</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest news, achievements, and announcements from our alumni community.
          </p>
        </div>

        <div className="bg-card rounded-lg p-12 shadow-sm border border-border text-center">
          <h2 className="text-2xl font-toboggan-bold text-foreground mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're working on bringing you the latest news and updates. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default News
