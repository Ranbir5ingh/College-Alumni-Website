import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Assuming react-router is used; adjust if needed
import { CheckCircle, XCircle, Download, Users, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function EventRegistrationsView({ eventId, registrations, isLoading, onBack, onExport }) {
  const { adminEvent } = useSelector((state) => state); // Adjust selector as needed
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  const event = adminEvent.eventList?.find(e => e._id === eventId) || { title: "Event" }; // Fetch event details if needed

  useEffect(() => {
    // Filter registrations based on search and status
    let filtered = registrations || [];
    if (searchQuery) {
      filtered = filtered.filter(reg => 
        `${reg.alumniId?.firstName} ${reg.alumniId?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.alumniId?.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }
    setFilteredRegistrations(filtered);
  }, [registrations, searchQuery, statusFilter]);

  const getStatusBadge = (status) => (
    <Badge variant={status === "confirmed" ? "default" : "secondary"} className="capitalize">
      {status}
    </Badge>
  );

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card className="flex-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon size={24} className="text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  const totalRegistrations = filteredRegistrations.length;
  const confirmedCount = filteredRegistrations.filter(r => r.status === "confirmed").length;
  const attendedCount = filteredRegistrations.filter(r => r.attended).length;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registrations for "{event.title}"</h1>
            <p className="text-gray-600">Manage attendee details and attendance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={() => onExport(eventId)}
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Registrations" value={totalRegistrations} icon={Users} />
        <StatCard title="Confirmed" value={confirmedCount} icon={CheckCircle} />
        <StatCard title="Attended" value={attendedCount} icon={Calendar} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      {totalRegistrations === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations yet</h3>
            <p className="text-gray-500">Registrations will appear here once alumni sign up.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.slice((currentPage - 1) * 9, currentPage * 9).map((reg) => (
            <Card key={reg._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {reg.alumniId?.firstName?.[0]}{reg.alumniId?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {reg.alumniId?.firstName} {reg.alumniId?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{reg.alumniId?.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Batch</span>
                  <span className="font-medium">{reg.alumniId?.batch}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{reg.alumniId?.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registered</span>
                  <span>{formatDate(reg.registrationDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Attended</span>
                  {reg.attended ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-gray-400" size={20} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination for Registrations */}
      {totalRegistrations > 9 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">
            Page {currentPage} of {Math.ceil(totalRegistrations / 9)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(totalRegistrations / 9)))}
            disabled={currentPage === Math.ceil(totalRegistrations / 9)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default EventRegistrationsView;