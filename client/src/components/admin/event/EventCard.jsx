import { Calendar, MapPin, Users, Star, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventActionMenu from "./EventActionMenu";

function EventCard({ event, onViewRegistrations, onGenerateQR, onExport, onSendReminders, onUpdateStatus, onDelete }) {
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
    <Card className="hover:shadow-lg transition-shadow">
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

          <EventActionMenu
            event={event}
            onViewRegistrations={onViewRegistrations}
            onGenerateQR={onGenerateQR}
            onExport={onExport}
            onSendReminders={onSendReminders}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default EventCard;