import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Calendar, Users, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import {
  getAllEvents,
  deleteEvent,
  updateEventStatus,
  getEventRegistrations,
  exportEventRegistrations,
  sendEventReminders,
  generateAttendanceQR,
  createEvent,
  getEventStats,
} from "@/store/admin/event-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventFilters from "@/components/admin/event/EventFilters";
import EventCard from "@/components/admin/event/EventCard";
import CreateEventDialog from "@/components/admin/event/CreateEventDialog";
import RegistrationsDialog from "@/components/admin/event/RegistrationsDialog";
import QRCodeDialog from "@/components/admin/event/QRCodeDialog";
import DeleteConfirmationDialog from "@/components/admin/event/DeleteConfirmationDialog";
import Pagination from "@/components/admin/event/Pagination";
import EmptyState from "@/components/admin/event/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function AdminEvents() {
  const dispatch = useDispatch();
  const { eventList, isLoading, pagination, registrations, stats } = useSelector((state) => state.adminEvent);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    dispatch(getEventStats());
    fetchEvents();
  }, [currentPage, statusFilter, eventTypeFilter]);

  const fetchEvents = () => {
    const params = { page: currentPage, limit: 10 };
    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== "all") params.status = statusFilter;
    if (eventTypeFilter !== "all") params.eventType = eventTypeFilter;
    dispatch(getAllEvents(params));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEvents();
  };

  const handleCreateEvent = async (eventData) => {
    await dispatch(createEvent(eventData));
    setShowCreateDialog(false);
    fetchEvents();
    dispatch(getEventStats());
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await dispatch(deleteEvent(selectedEvent._id));
      setShowDeleteDialog(false);
      setSelectedEvent(null);
      fetchEvents();
      dispatch(getEventStats());
    }
  };

  const handleUpdateStatus = async (eventId, status, isFeatured) => {
    await dispatch(updateEventStatus({ id: eventId, statusData: { status, isFeatured } }));
    fetchEvents();
  };



  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    dispatch(getEventRegistrations({ id: event._id, params: {} }));
    setShowRegistrationsDialog(true);
  };

  const handleGenerateQR = async (event) => {
    const result = await dispatch(generateAttendanceQR({ id: event._id, expiryMinutes: 60 }));
    if (result.payload?.success) {
      setQrCodeData(result.payload.data);
      setSelectedEvent(event);
      setShowQRDialog(true);
    }
  };

  const handleExportRegistrations = (eventId) => {
    dispatch(exportEventRegistrations(eventId));
  };

  const handleSendReminders = (eventId) => {
    dispatch(sendEventReminders({ id: eventId, reminderType: "1_day_before" }));
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteDialog(true);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Manage alumni events and track engagement</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} />
          Create Event
        </Button>
      </div>

      {/* Overall Event Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          Event Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={stats?.overview?.totalEvents || 0}
            subtitle={`${stats?.overview?.publishedEvents || 0} published`}
            icon={Calendar}
            color="bg-blue-600"
          />
          <StatCard
            title="Upcoming Events"
            value={stats?.overview?.upcomingEvents || 0}
            subtitle={`${stats?.overview?.draftEvents || 0} in draft`}
            icon={Calendar}
            color="bg-green-600"
          />
          <StatCard
            title="Total Registrations"
            value={stats?.registrations?.totalRegistrations || 0}
            subtitle={`${stats?.registrations?.confirmedRegistrations || 0} confirmed`}
            icon={Users}
            color="bg-purple-600"
          />
          <StatCard
            title="Attendance Rate"
            value={stats?.registrations?.attendanceRate || '0%'}
            subtitle={`${stats?.registrations?.attendedCount || 0} attended`}
            icon={TrendingUp}
            color="bg-orange-600"
          />
        </div>
      </div>

      {/* Event Type Distribution */}
      {stats?.eventTypeStats?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.eventTypeStats.map((type) => (
                <div key={type._id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{type.count}</div>
                  <div className="text-xs text-gray-600 mt-1 capitalize">{type._id}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        eventTypeFilter={eventTypeFilter}
        setEventTypeFilter={setEventTypeFilter}
        onSearch={handleSearch}
      />

      {/* Events List */}
      {isLoading && eventList.length === 0 ? (
        <LoadingSpinner />
      ) : eventList.length === 0 ? (
        <EmptyState onCreateEvent={() => setShowCreateDialog(true)} />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Events ({pagination.totalEvents || 0})
            </h2>
          </div>
          <div className="grid gap-4">
            {eventList.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onViewRegistrations={handleViewRegistrations}
                onGenerateQR={handleGenerateQR}
                onExport={handleExportRegistrations}
                onSendReminders={handleSendReminders}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {eventList.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasPrevPage={pagination.hasPrevPage}
          hasNextPage={pagination.hasNextPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Dialogs */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEvent}
      />

      <RegistrationsDialog
        event={selectedEvent}
        registrations={registrations}
        isLoading={isLoading}
        open={showRegistrationsDialog}
        onOpenChange={setShowRegistrationsDialog}
        onExport={handleExportRegistrations}
      />

      <QRCodeDialog
        event={selectedEvent}
        qrCodeData={qrCodeData}
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
      />

      <DeleteConfirmationDialog
        event={selectedEvent}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
}

export default AdminEvents;