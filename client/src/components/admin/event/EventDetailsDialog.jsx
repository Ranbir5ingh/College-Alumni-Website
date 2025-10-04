import { Calendar, Clock, MapPin, Users, DollarSign, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function EventDetailsDialog({ event, open, onOpenChange }) {
  if (!event) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      published: { color: "bg-blue-100 text-blue-800", label: "Published" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      ongoing: { color: "bg-purple-100 text-purple-800", label: "Ongoing" },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{event.title}</DialogTitle>
              <div className="flex gap-2 flex-wrap">
                {getStatusBadge(event.status)}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize">
                  {event.eventType}
                </span>
                {event.isFeatured && (
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
          {event.coverImage && (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-800 leading-relaxed">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Start Date & Time</p>
                  <p className="font-medium">{new Date(event.startDateTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">End Date & Time</p>
                  <p className="font-medium">{new Date(event.endDateTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{event.isOnline ? "Online Event" : event.venue?.name || "TBD"}</p>
                  {!event.isOnline && event.venue && (
                    <p className="text-sm text-gray-700 mt-1">
                      {event.venue.address && `${event.venue.address}, `}
                      {event.venue.city}
                      {event.venue.state && `, ${event.venue.state}`}
                      {event.venue.pincode && ` - ${event.venue.pincode}`}
                    </p>
                  )}
                  {event.isOnline && event.meetingLink && (
                    <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
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
                  <p className="font-medium">{event.currentAttendees || 0} registered</p>
                  {event.maxAttendees && (
                    <p className="text-sm text-gray-600">Max: {event.maxAttendees}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Registration Fee</p>
                  <p className="font-medium">{event.registrationFee > 0 ? `₹${event.registrationFee}` : "Free"}</p>
                </div>
              </div>

              {event.timezone && (
                <div className="flex items-start gap-3">
                  <Clock className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Timezone</p>
                    <p className="font-medium">{event.timezone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(event.eligibleBatches?.length > 0 || event.eligibleDepartments?.length > 0) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Eligibility</h3>
              <div className="space-y-2">
                {event.eligibleBatches?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eligible Batches:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.eligibleBatches.map((batch, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {batch}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {event.eligibleDepartments?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Eligible Departments:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.eligibleDepartments.map((dept, idx) => (
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

          {event.tags?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.createdBy && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Created by <span className="font-medium">{event.createdBy.firstName} {event.createdBy.lastName}</span> on {new Date(event.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetailsDialog;