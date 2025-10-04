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
import { Loader2, Search, Calendar, Filter, X } from "lucide-react";

function AlumniEventsPage() {
  const dispatch = useDispatch();
  const { events, pagination, isLoading, error } = useSelector((state) => state.userEvent);

  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    upcoming: "true",
    page: 1,
    limit: 12,
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getAllEvents(filters));
  }, [dispatch, filters]);

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
      upcoming: "true",
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

  const hasActiveFilters = filters.search || filters.eventType || filters.upcoming === "false";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">
            Discover and register for upcoming alumni events
          </p>
        </div>
        <Calendar className="text-blue-600" size={40} />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select
            value={filters.eventType}
            onValueChange={(value) => handleFilterChange("eventType", value)}
          >
            <SelectTrigger className="w-[180px]">
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

          <Select
            value={filters.upcoming}
            onValueChange={(value) => handleFilterChange("upcoming", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Show Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Upcoming Events</SelectItem>
              <SelectItem value="false">All Events</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
              className="text-gray-600"
            >
              <X size={16} className="mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{error.message || "Failed to load events"}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? "Try adjusting your filters to see more events"
              : "There are no upcoming events at the moment"}
          </p>
          {hasActiveFilters && (
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <AlumniEventCard
                key={event._id}
                event={event}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {[...Array(pagination.totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  // Show first page, last page, current page, and pages around current
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
                        className={pageNum === pagination.currentPage ? "bg-blue-600" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (
                    pageNum === pagination.currentPage - 2 ||
                    pageNum === pagination.currentPage + 2
                  ) {
                    return <span key={pageNum} className="text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <Button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-600">
            Showing {events.length} of {pagination.totalEvents} events
          </div>
        </>
      )}
    </div>
  );
}

export default AlumniEventsPage;