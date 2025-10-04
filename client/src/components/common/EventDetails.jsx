import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Users, Clock, DollarSign, Edit2, Check, X, Loader2 } from "lucide-react";
import { getEventById as getAdminEvent, updateEvent } from "@/store/admin/event-slice";
import { getEventById, registerForEvent } from "@/store/user/event-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  // Use appropriate slice based on role
  const adminEvent = useSelector((state) => state.adminEvent);
  const userEvent = useSelector((state) => state.userEvent);
  
  const event = isAdmin ? adminEvent.currentEvent : userEvent.currentEvent;
  const isLoading = isAdmin ? adminEvent.isLoading : userEvent.isLoading;
  
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      if (isAdmin) {
        dispatch(getAdminEvent(id));
      } else {
        dispatch(getEventById(id));
      }
    }
  }, [id, dispatch, isAdmin]);

  const getStatusBadge = (status) => {
    const configs = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      ongoing: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={configs[status] || configs.draft}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditField = (field) => {
    setEditMode({ ...editMode, [field]: true });
    setEditValues({ ...editValues, [field]: event[field] });
  };

  const handleSaveField = async (field) => {
    const updateData = {};
    
    // Handle nested venue fields
    if (field.startsWith('venue.')) {
      const venueField = field.split('.')[1];
      updateData.venue = {
        ...event.venue,
        [venueField]: editValues[field]
      };
    } else {
      updateData[field] = editValues[field];
    }
    
    await dispatch(updateEvent({
      id: event._id,
      eventData: updateData
    }));
    setEditMode(prev => ({ ...prev, [field]: false }));
  };

  const handleCancelEdit = (field) => {
    setEditMode({ ...editMode, [field]: false });
    setEditValues({ ...editValues, [field]: event[field] });
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await dispatch(registerForEvent(id));
      setShowRegisterDialog(false);
      // Refresh event data to get updated registration status
      dispatch(getEventById(id));
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 mb-4">Event not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const EditableField = ({ field, value, multiline = false, type = "text" }) => {
    if (!isAdmin) {
      if (type === "datetime-local") {
        return <span>{formatDate(value)}</span>;
      }
      return <span>{value}</span>;
    }

    if (editMode[field]) {
      return (
        <div className="flex items-start gap-2 w-full">
          {multiline ? (
            <textarea
              className="flex-1 px-3 py-2 border rounded-md"
              rows={4}
              value={editValues[field] ?? value}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              autoFocus
            />
          ) : type === "datetime-local" ? (
            <Input
              type="datetime-local"
              value={editValues[field] ? new Date(editValues[field]).toISOString().slice(0, 16) : new Date(value).toISOString().slice(0, 16)}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              className="flex-1"
              autoFocus
            />
          ) : (
            <Input
              type={type}
              value={editValues[field] ?? value}
              onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
              className="flex-1"
              autoFocus
            />
          )}
          <Button size="sm" onClick={() => handleSaveField(field)} className="bg-green-600 hover:bg-green-700 flex-shrink-0">
            <Check size={16} />
          </Button>
          <Button size="sm" onClick={() => handleCancelEdit(field)} className="bg-gray-200 hover:bg-gray-300 flex-shrink-0">
            <X size={16} />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{type === "datetime-local" ? formatDate(value) : value}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleEditField(field)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2 size={14} />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative w-full h-96 ">
        {event.coverImage ? (
          <>
            <img
              src={event.coverImage.replace(/^http:\/\//, "https://")}
              alt={event.title}
              className="w-full h-full object-cover rounded-2xl"
            />
            
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-24 h-24 text-white opacity-50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10 pb-32">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {getStatusBadge(event.status)}
            <Badge className="bg-gray-100 text-gray-800 capitalize">
              {event.eventType}
            </Badge>
            {event.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
            )}
            {event.isOnline && (
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            <EditableField field="title" value={event.title} />
          </h1>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">Start Date & Time</p>
                <EditableField field="startDateTime" value={event.startDateTime} type="datetime-local" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">End Date & Time</p>
                <EditableField field="endDateTime" value={event.endDateTime} type="datetime-local" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
                {event.isOnline ? (
                  <div>
                    <p className="text-gray-900">Online Event</p>
                    {isAdmin ? (
                      <div className="mt-2">
                        <EditableField field="meetingLink" value={event.meetingLink || "Add meeting link"} />
                      </div>
                    ) : event.meetingLink ? (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Join Meeting →
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <div>
                    {isAdmin ? (
                      <div className="space-y-2">
                        <EditableField field="venue.name" value={event.venue?.name || "Add venue name"} />
                        <EditableField field="venue.address" value={event.venue?.address || "Add address"} />
                        <EditableField field="venue.city" value={event.venue?.city || "Add city"} />
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-900">{event.venue?.name || "TBD"}</p>
                        {event.venue && (
                          <p className="text-sm text-gray-600">
                            {event.venue.address && `${event.venue.address}, `}
                            {event.venue.city}
                            {event.venue.state && `, ${event.venue.state}`}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-blue-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm text-gray-600 font-medium">Registrations</p>
                <p className="text-gray-900">
                  {event.currentAttendees || 0} registered
                  {event.maxAttendees && ` / ${event.maxAttendees} max`}
                </p>
              </div>
            </div>

            {event.registrationFee > 0 && (
              <div className="flex items-start gap-3">
                <DollarSign className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-600 font-medium">Registration Fee</p>
                  <p className="text-gray-900">₹{event.registrationFee}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <EditableField field="description" value={event.description} multiline />
            </div>
          </div>

          {/* Eligibility */}
          {(event.eligibleBatches?.length > 0 || event.eligibleDepartments?.length > 0) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility</h2>
              {event.eligibleBatches?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Eligible Batches:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.eligibleBatches.map((batch, idx) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800">
                        {batch}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {event.eligibleDepartments?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">Eligible Departments:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.eligibleDepartments.map((dept, idx) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-800">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-gray-100 text-gray-700">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Creator Info */}
        {event.createdBy && (
          <div className="bg-white rounded-lg shadow p-4 text-sm text-gray-600">
            Created by <span className="font-medium">{event.createdBy.firstName} {event.createdBy.lastName}</span> on{" "}
            {new Date(event.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Floating Register Button (Alumni Only) */}
      {!isAdmin && user?.role === "alumni" && event.status === "published" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">Ready to join this event?</p>
              {event.registrationFee > 0 && (
                <p className="text-sm text-gray-600">Registration Fee: ₹{event.registrationFee}</p>
              )}
            </div>
            {event.isRegistered ? (
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={20} />
                <span className="text-green-600 font-medium">Already Registered</span>
              </div>
            ) : event.isRegistrationOpen ? (
              <Button
                onClick={() => setShowRegisterDialog(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Register Now
              </Button>
            ) : (
              <Button disabled size="lg" className="bg-gray-300 text-gray-600 px-8">
                Registration Closed
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Registration Confirmation Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to register for "{event.title}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(event.startDateTime)}</span>
            </div>
            {event.registrationFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee:</span>
                <span className="font-medium text-green-600">₹{event.registrationFee}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => setShowRegisterDialog(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Registering...
                </>
              ) : (
                "Confirm Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventDetailsPage;