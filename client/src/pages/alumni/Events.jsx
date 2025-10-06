import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents, clearError } from "@/store/user/event-slice";
import AlumniEventCard from "@/components/alumni/AlumniEventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Calendar, Filter, X, Ticket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AlumniEventsPage() {
  const dispatch = useDispatch();
  const { events, pagination, isLoading, error } = useSelector((state) => state.userEvent);

  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    page: 1,
    limit: 12,
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getAllEvents(filters));
  }, [dispatch, filters]);

  // Separate events into registered and non-registered
  const registeredEvents = events.filter(event => event.isRegistered);
  const availableEvents = events.filter(event => !event.isRegistered);

  const displayEvents = activeTab === "registered" ? registeredEvents : availableEvents;

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      eventType: "",
      page: 1,
      limit: 12,
    });
    setSearchInput("");
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (eventId) => {
    window.location.href = `/alumni/events/${eventId}`;
  };

  const hasActiveFilters = filters.search || filters.eventType === "false";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Alumni Events</h1>
                <p className="text-blue-100 text-lg">
                  Connect, learn, and grow with your alumni community
                </p>
              </div>
              <Calendar className="text-blue-200 opacity-50" size={80} />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full opacity-10 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900 rounded-full opacity-10 -ml-24 -mb-24"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="all" className="text-base">
              All Events
            </TabsTrigger>
            <TabsTrigger value="registered" className="text-base flex items-center gap-2">
              <Ticket size={16} />
              My Events ({registeredEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Search events by title, description..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    className="bg-blue-600 hover:bg-blue-700 h-11 px-6"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">Filters:</span>
                </div>

                <Select
                  value={filters.eventType}
                  onValueChange={(value) => handleFilterChange("eventType", value)}
                >
                  <SelectTrigger className="w-[180px] h-10 border-gray-200">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="reunion">Reunion</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>



                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50"
                  >
                    <X size={16} className="mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error.message || "Failed to load events"}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Loader2 className="w-14 h-14 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading events...</p>
                </div>
              </div>
            ) : availableEvents.length === 0 ? (
              /* Empty State */
              <div className="text-center py-32">
                <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Events Found
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  {hasActiveFilters
                    ? "Try adjusting your filters to discover more events"
                    : "There are no upcoming events at the moment. Check back soon!"}
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline" size="lg">
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableEvents.map((event) => (
                    <AlumniEventCard
                      key={event._id}
                      event={event}
                      onViewDetails={handleViewDetails}
                      showRegisterButton={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      variant="outline"
                      className="border-gray-200"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      {[...Array(pagination.totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          Math.abs(pageNum - pagination.currentPage) <= 1
                        ) {
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              variant={pageNum === pagination.currentPage ? "default" : "outline"}
                              className={pageNum === pagination.currentPage 
                                ? "bg-blue-600 hover:bg-blue-700" 
                                : "border-gray-200"}
                            >
                              {pageNum}
                            </Button>
                          );
                        } else if (
                          pageNum === pagination.currentPage - 2 ||
                          pageNum === pagination.currentPage + 2
                        ) {
                          return <span key={pageNum} className="text-gray-400 px-2">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      variant="outline"
                      className="border-gray-200"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center text-sm text-gray-500 mt-6">
                  Showing {availableEvents.length} of {pagination.totalEvents} events
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="registered" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Loader2 className="w-14 h-14 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Loading your events...</p>
                </div>
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center py-32">
                <div className="bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ticket className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Registered Events
                </h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  You haven't registered for any events yet. Browse available events to get started!
                </p>
                <Button 
                  onClick={() => setActiveTab("all")} 
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Browse Events
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                  <p className="text-blue-900 text-sm font-medium">
                    You're registered for {registeredEvents.length} {registeredEvents.length === 1 ? 'event' : 'events'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registeredEvents.map((event) => (
                    <AlumniEventCard
                      key={event._id}
                      event={event}
                      onViewDetails={handleViewDetails}
                      showRegisterButton={false}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AlumniEventsPage;