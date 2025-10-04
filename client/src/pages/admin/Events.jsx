import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import {
  getAllEvents,
  deleteEvent,
  updateEventStatus,
  getEventRegistrations,
  exportEventRegistrations,
  sendEventReminders,
  generateAttendanceQR,
  createEvent,
} from "@/store/admin/event-slice";
import { Button } from "@/components/ui/button";
import EventFilters from "@/components/admin/event/EventFilters";
import EventCard from "@/components/admin/event/EventCard";
import CreateEventDialog from "@/components/admin/event/CreateEventDialog";
import EventDetailsDialog from "@/components/admin/event/EventDetailsDialog";
import RegistrationsDialog from "@/components/admin/event/RegistrationsDialog";
import QRCodeDialog from "@/components/admin/event/QRCodeDialog";
import DeleteConfirmationDialog from "@/components/admin/event/DeleteConfirmationDialog";
import Pagination from "@/components/admin/event/Pagination";
import EmptyState from "@/components/admin/event/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function AdminEvents() {
  const dispatch = useDispatch();
  const { eventList, isLoading, pagination, registrations } = useSelector((state) => state.adminEvent);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
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
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await dispatch(deleteEvent(selectedEvent._id));
      setShowDeleteDialog(false);
      setSelectedEvent(null);
      fetchEvents();
    }
  };

  const handleUpdateStatus = async (eventId, status, isFeatured) => {
    await dispatch(updateEventStatus({ id: eventId, statusData: { status, isFeatured } }));
    fetchEvents();
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create and manage alumni events</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={20} />
          Create Event
        </Button>
      </div>

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
        <div className="grid gap-4">
          {eventList.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onViewDetails={handleViewDetails}
              onViewRegistrations={handleViewRegistrations}
              onGenerateQR={handleGenerateQR}
              onExport={handleExportRegistrations}
              onSendReminders={handleSendReminders}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasPrevPage={pagination.hasPrevPage}
        hasNextPage={pagination.hasNextPage}
        onPageChange={setCurrentPage}
      />

      {/* Dialogs */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateEvent}
      />

      <EventDetailsDialog
        event={selectedEvent}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
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