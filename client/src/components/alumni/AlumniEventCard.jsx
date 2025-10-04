import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerForEvent } from "@/store/user/event-slice";
import { Calendar, MapPin, Users, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function AlumniEventCard({ event, onViewDetails }) {
  const dispatch = useDispatch();
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (!event.isRegistrationOpen) {
      toast.error("Registration is closed");
      return;
    }
    if (event.isRegistered) {
      toast.info("Already registered");
      return;
    }
    setShowRegisterDialog(true);
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const result = await dispatch(registerForEvent(event._id));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          event.registrationFee > 0
            ? "Registration initiated! Complete payment to confirm."
            : "Successfully registered!"
        );
        setShowRegisterDialog(false);
      } else {
        toast.error(result.payload?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Failed to register");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(event._id);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        <div className="relative h-48 overflow-hidden" onClick={handleCardClick}>
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex gap-2">
            {event.isFeatured && (
              <Badge className="bg-yellow-500 text-white">Featured</Badge>
            )}
            <Badge className="bg-blue-600 text-white capitalize">
              {event.eventType}
            </Badge>
          </div>

          {event.isRegistered && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <CheckCircle size={14} />
                Registered
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5" onClick={handleCardClick}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          
          {event.shortDescription && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {event.shortDescription}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar size={16} className="text-blue-600 flex-shrink-0" />
              <span>{formatDate(event.startDateTime)}</span>
              <span className="text-gray-400">•</span>
              <span>{formatTime(event.startDateTime)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              {event.isOnline ? (
                <>
                  <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                  <span>Online Event</span>
                </>
              ) : (
                <>
                  <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="truncate">
                    {event.venue?.name || event.venue?.city || "TBD"}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={16} className="text-blue-600 flex-shrink-0" />
                <span>
                  {event.currentAttendees || 0}
                  {event.maxAttendees && ` / ${event.maxAttendees}`} attending
                </span>
              </div>

              {event.registrationFee > 0 && (
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarSign size={16} />
                  <span>₹{event.registrationFee}</span>
                </div>
              )}
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button
            onClick={handleCardClick}
            variant="outline"
            className="flex-1"
          >
            View Details
          </Button>
          
          {event.isRegistered ? (
            <Button
              disabled
              className="flex-1 bg-green-600 text-white cursor-not-allowed"
            >
              <CheckCircle size={16} className="mr-2" />
              Registered
            </Button>
          ) : event.isRegistrationOpen ? (
            <Button
              onClick={handleRegisterClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register Now
            </Button>
          ) : (
            <Button
              disabled
              className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
            >
              Registration Closed
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to register for this event?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium text-right max-w-[60%]">{event.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(event.startDateTime)}</span>
            </div>
            {event.registrationFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee:</span>
                <span className="font-medium text-green-600">
                  ₹{event.registrationFee}
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRegisterDialog(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Registering...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AlumniEventCard;