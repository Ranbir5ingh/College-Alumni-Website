import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Download,
  Mail,
  QrCode,
  Clock,
  DollarSign,
  X,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import QRCode from "qrcode";

function AdminEvents() {
  const dispatch = useDispatch();
  const { eventList, isLoading, pagination, registrations } = useSelector((state) => state.adminEvent);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRegistrationsDialog, setShowRegistrationsDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [qrCodeData, setQrCodeData] = useState(null);
  const qrCanvasRef = useRef(null);

  // Create Event Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "conference",
    startDateTime: "",
    endDateTime: "",
    timezone: "Asia/Kolkata",
    isOnline: false,
    venue: { name: "", address: "", city: "", state: "", country: "India", pincode: "" },
    meetingLink: "",
    registrationStartDate: "",
    registrationEndDate: "",
    registrationFee: 0,
    maxAttendees: null,
    eligibleBatches: [],
    eligibleDepartments: [],
    requiresMembership: false,
    requiredMembershipTiers: [],
    tags: [],
    status: "draft",
  });

  const [batchInput, setBatchInput] = useState("");
  const [deptInput, setDeptInput] = useState("");
  const [tagInput, setTagInput] = useState("");

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

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    dispatch(getEventRegistrations({ id: event._id, params: {} }));
    setShowRegistrationsDialog(true);
  };

  const handleCreateEvent = async () => {
    const eventData = { ...formData };
    if (!eventData.isOnline) {
      delete eventData.meetingLink;
    } else {
      delete eventData.venue;
    }
    await dispatch(createEvent(eventData));
    setShowCreateDialog(false);
    resetFormData();
    fetchEvents();
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      eventType: "conference",
      startDateTime: "",
      endDateTime: "",
      timezone: "Asia/Kolkata",
      isOnline: false,
      venue: { name: "", address: "", city: "", state: "", country: "India", pincode: "" },
      meetingLink: "",
      registrationStartDate: "",
      registrationEndDate: "",
      registrationFee: 0,
      maxAttendees: null,
      eligibleBatches: [],
      eligibleDepartments: [],
      requiresMembership: false,
      requiredMembershipTiers: [],
      tags: [],
      status: "draft",
    });
    setBatchInput("");
    setDeptInput("");
    setTagInput("");
  };

  const handleGenerateQR = async (event) => {
    const result = await dispatch(generateAttendanceQR({ id: event._id, expiryMinutes: 60 }));
    if (result.payload?.success) {
      setQrCodeData(result.payload.data);
      setSelectedEvent(event);
      setShowQRDialog(true);
      
      // Generate QR code
      setTimeout(() => {
        if (qrCanvasRef.current) {
          QRCode.toCanvas(
            qrCanvasRef.current,
            result.payload.data.qrData,
            { width: 300, margin: 2 },
            (error) => {
              if (error) console.error(error);
            }
          );
        }
      }, 100);
    }
  };

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${selectedEvent?.title.replace(/\s+/g, '_')}_QR.png`;
      link.href = url;
      link.click();
    }
  };

  const addArrayItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  const getEventTypeFields = () => {
    const { eventType } = formData;
    const baseFields = ["title", "description", "startDateTime", "endDateTime", "location"];
    
    const typeSpecificFields = {
      conference: ["maxAttendees", "speakers", "agenda", "registrationFee"],
      workshop: ["maxAttendees", "registrationFee", "prerequisites"],
      seminar: ["speakers", "registrationFee"],
      reunion: ["eligibleBatches", "venue"],
      webinar: ["meetingLink", "maxAttendees"],
      networking: ["maxAttendees", "eligibleDepartments"],
      cultural: ["venue", "registrationFee"],
      sports: ["venue", "maxAttendees", "eligibleBatches"],
      other: [],
    };

    return [...baseFields, ...(typeSpecificFields[eventType] || [])];
  };

  const shouldShowField = (fieldName) => {
    const visibleFields = getEventTypeFields();
    return visibleFields.includes(fieldName);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      published: { color: "bg-blue-100 text-blue-800", label: "Published" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      ongoing: { color: "bg-purple-100 text-purple-800", label: "Ongoing" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create and manage alumni events</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={20} />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                  <Search size={20} />
                </Button>
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="reunion">Reunion</SelectItem>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {isLoading && eventList.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Loading events...</p>
        </div>
      ) : eventList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No events found</p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {eventList.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {event.coverImage && (
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              {event.title}
                              {event.isFeatured && (
                                <Star className="text-yellow-500" size={20} fill="currentColor" />
                              )}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                {formatDate(event.startDateTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={16} />
                                {event.isOnline ? "Online" : event.venue?.city || "TBD"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={16} />
                                {event.currentAttendees || 0} registered
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(event.status)}
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                            {event.eventType}
                          </span>
                          {event.registrationFee > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              ₹{event.registrationFee}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-transparent hover:bg-gray-100 text-gray-700 p-2">
                        <MoreVertical size={20} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => {
                        setSelectedEvent(event);
                        setShowDetailsDialog(true);
                      }}>
                        <Eye size={16} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewRegistrations(event)}>
                        <Users size={16} className="mr-2" />
                        Registrations ({event.currentAttendees || 0})
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleGenerateQR(event)}>
                        <QrCode size={16} className="mr-2" />
                        Generate QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => dispatch(exportEventRegistrations(event._id))}>
                        <Download size={16} className="mr-2" />
                        Export Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => dispatch(sendEventReminders({ id: event._id, reminderType: "1_day_before" }))}>
                        <Mail size={16} className="mr-2" />
                        Send Reminders
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {event.status !== "published" && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(event._id, "published", event.isFeatured)}>
                          <CheckCircle size={16} className="mr-2" />
                          Publish Event
                        </DropdownMenuItem>
                      )}
                      {!event.isFeatured && (
                        <DropdownMenuItem onClick={() => handleUpdateStatus(event._id, event.status, true)}>
                          <Star size={16} className="mr-2" />
                          Mark as Featured
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            className="bg-white border hover:bg-gray-50 text-gray-700"
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            className="bg-white border hover:bg-gray-50 text-gray-700"
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new alumni event
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type *</label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="reunion">Reunion</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {shouldShowField("registrationFee") && (
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Fee (₹)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: parseInt(e.target.value) || 0 })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                />
              </div>
            </div>

            {shouldShowField("maxAttendees") && (
              <div>
                <label className="block text-sm font-medium mb-1">Max Attendees (leave empty for unlimited)</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxAttendees || ""}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Unlimited"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOnline"
                checked={formData.isOnline}
                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isOnline" className="text-sm font-medium">
                This is an online event
              </label>
            </div>

            {formData.isOnline ? (
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link *</label>
                <Input
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Venue Name *</label>
                    <Input
                      value={formData.venue.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: { ...formData.venue, name: e.target.value }
                      })}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <Input
                      value={formData.venue.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: { ...formData.venue, city: e.target.value }
                      })}
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    value={formData.venue.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      venue: { ...formData.venue, address: e.target.value }
                    })}
                    placeholder="Enter venue address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      value={formData.venue.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: { ...formData.venue, state: e.target.value }
                      })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      value={formData.venue.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: { ...formData.venue, country: e.target.value }
                      })}
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode</label>
                    <Input
                      value={formData.venue.pincode}
                      onChange={(e) => setFormData({
                        ...formData,
                        venue: { ...formData.venue, pincode: e.target.value }
                      })}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
            )}

            {shouldShowField("eligibleBatches") && (
              <div>
                <label className="block text-sm font-medium mb-1">Eligible Batches (Optional)</label>
                <div className="flex gap-2">
                  <Input
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="e.g., 2020"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('eligibleBatches', batchInput, setBatchInput))}
                  />
                  <Button type="button" onClick={() => addArrayItem('eligibleBatches', batchInput, setBatchInput)} className="bg-blue-600 text-white">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibleBatches.map((batch, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                      {batch}
                      <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('eligibleBatches', idx)} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {shouldShowField("eligibleDepartments") && (
              <div>
                <label className="block text-sm font-medium mb-1">Eligible Departments (Optional)</label>
                <div className="flex gap-2">
                  <Input
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    placeholder="e.g., Computer Science"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('eligibleDepartments', deptInput, setDeptInput))}
                  />
                  <Button type="button" onClick={() => addArrayItem('eligibleDepartments', deptInput, setDeptInput)} className="bg-blue-600 text-white">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.eligibleDepartments.map((dept, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                      {dept}
                      <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('eligibleDepartments', idx)} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tags (Optional)</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g., networking"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tagInput, setTagInput))}
                />
                <Button type="button" onClick={() => addArrayItem('tags', tagInput, setTagInput)} className="bg-blue-600 text-white">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <X size={14} className="cursor-pointer" onClick={() => removeArrayItem('tags', idx)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold mb-2">{selectedEvent.title}</DialogTitle>
                  <div className="flex gap-2 flex-wrap">
                    {getStatusBadge(selectedEvent.status)}
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                      {selectedEvent.eventType}
                    </span>
                    {selectedEvent.isFeatured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star size={14} fill="currentColor" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedEvent.coverImage && (
                <img
                  src={selectedEvent.coverImage}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-800 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Start Date & Time</p>
                      <p className="font-medium">{new Date(selectedEvent.startDateTime).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">End Date & Time</p>
                      <p className="font-medium">{new Date(selectedEvent.endDateTime).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedEvent.isOnline ? "Online Event" : selectedEvent.venue?.name || "TBD"}</p>
                      {!selectedEvent.isOnline && selectedEvent.venue && (
                        <p className="text-sm text-gray-700 mt-1">
                          {selectedEvent.venue.address && `${selectedEvent.venue.address}, `}
                          {selectedEvent.venue.city}
                          {selectedEvent.venue.state && `, ${selectedEvent.venue.state}`}
                          {selectedEvent.venue.pincode && ` - ${selectedEvent.venue.pincode}`}
                        </p>
                      )}
                      {selectedEvent.isOnline && selectedEvent.meetingLink && (
                        <a href={selectedEvent.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Registrations</p>
                      <p className="font-medium">{selectedEvent.currentAttendees || 0} registered</p>
                      {selectedEvent.maxAttendees && (
                        <p className="text-sm text-gray-600">Max: {selectedEvent.maxAttendees}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="text-blue-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Registration Fee</p>
                      <p className="font-medium">{selectedEvent.registrationFee > 0 ? `₹${selectedEvent.registrationFee}` : "Free"}</p>
                    </div>
                  </div>

                  {selectedEvent.timezone && (
                    <div className="flex items-start gap-3">
                      <Clock className="text-blue-600 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Timezone</p>
                        <p className="font-medium">{selectedEvent.timezone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(selectedEvent.eligibleBatches?.length > 0 || selectedEvent.eligibleDepartments?.length > 0) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Eligibility</h3>
                  <div className="space-y-2">
                    {selectedEvent.eligibleBatches?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Eligible Batches:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.eligibleBatches.map((batch, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {batch}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedEvent.eligibleDepartments?.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Eligible Departments:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.eligibleDepartments.map((dept, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedEvent.tags?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.createdBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Created by <span className="font-medium">{selectedEvent.createdBy.firstName} {selectedEvent.createdBy.lastName}</span> on {new Date(selectedEvent.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Registrations Dialog */}
      {selectedEvent && (
        <Dialog open={showRegistrationsDialog} onOpenChange={setShowRegistrationsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Event Registrations - {selectedEvent.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Total: {registrations?.length || 0} registrations</p>
                <Button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => dispatch(exportEventRegistrations(selectedEvent._id))}
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading registrations...</div>
              ) : !registrations || registrations.length === 0 ? (
                <div className="text-center py-8 text-gray-600">No registrations yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumni</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attended</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((reg) => (
                        <tr key={reg._id}>
                          <td className="px-4 py-3 text-sm">
                            {reg.alumniId?.firstName} {reg.alumniId?.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm">{reg.alumniId?.email}</td>
                          <td className="px-4 py-3 text-sm">{reg.alumniId?.batch}</td>
                          <td className="px-4 py-3 text-sm">
                            {new Date(reg.registrationDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reg.status === "confirmed" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {reg.attended ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : (
                              <XCircle className="text-gray-400" size={20} />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to mark attendance for {selectedEvent?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center items-center p-6 bg-white rounded-lg border-2 border-gray-200">
              <canvas ref={qrCanvasRef} />
            </div>
            
            {qrCodeData && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-medium">{new Date(qrCodeData.expiresAt).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-md mt-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> This QR code will expire in 60 minutes. Alumni can scan this code to mark their attendance.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => setShowQRDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownloadQR}>
              <Download size={16} className="mr-2" />
              Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminEvents;