import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerForEvent } from "@/store/user/event-slice";
import { Calendar, MapPin, Users, DollarSign, CheckCircle, Loader2, Clock } from "lucide-react";
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

function AlumniEventCard({ event, onViewDetails, showRegisterButton = true }) {
  const dispatch = useDispatch();
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
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
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-xl cursor-pointer">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden" onClick={handleCardClick}>
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center">
              <Calendar className="w-20 h-20 text-white opacity-30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {event.isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg font-semibold px-3 py-1">
                ⭐ Featured
              </Badge>
            )}
            <Badge className="bg-white/95 backdrop-blur text-gray-900 border-0 shadow-lg capitalize font-medium px-3 py-1">
              {event.eventType}
            </Badge>
          </div>

          {/* Registration Status Badge */}
          {event.isRegistered && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg flex items-center gap-1.5 px-3 py-1.5 font-semibold">
                <CheckCircle size={16} />
                Registered
              </Badge>
            </div>
          )}

          {/* Title Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 drop-shadow-lg">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 space-y-4" onClick={handleCardClick}>
          {/* Short Description */}
          {event.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {event.shortDescription}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-3">
            {/* Date and Time */}
            <div className="flex items-start gap-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{formatDate(event.startDateTime)}</div>
                <div className="text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  {formatTime(event.startDateTime)}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 text-sm">
              <div className="bg-purple-50 rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                {event.isOnline ? (
                  <>
                    <div className="font-semibold text-gray-900">Online Event</div>
                    <div className="text-gray-500 text-xs">Virtual platform</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-gray-900 truncate">
                      {event.venue?.name || "Venue TBD"}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {event.venue?.city || "Location details coming soon"}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Attendees and Fee */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-green-50 rounded-lg p-1.5">
                  <Users size={16} className="text-green-600" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {event.currentAttendees || 0}
                  </span>
                  <span className="text-gray-500">
                    {event.maxAttendees ? ` / ${event.maxAttendees}` : ""} attending
                  </span>
                </div>
              </div>

              {event.registrationFee > 0 && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-md">
                  <DollarSign size={16} />
                  <span>₹{event.registrationFee}</span>
                </div>
              )}
              
              {event.registrationFee === 0 && (
                <Badge className="bg-green-50 text-green-700 border border-green-200 font-semibold">
                  FREE
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer with Actions */}
        <CardFooter className="p-6 pt-0 flex gap-3">
          <Button
            onClick={handleCardClick}
            variant="outline"
            className="flex-1 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
          >
            View Details
          </Button>
          
          {showRegisterButton && !event.isRegistered && (
            event.isRegistrationOpen ? (
              <Button
                onClick={handleRegisterClick}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                Register Now
              </Button>
            ) : (
              <Button
                disabled
                className="flex-1 bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
              >
                Registration Closed
              </Button>
            )
          )}
        </CardFooter>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Registration</DialogTitle>
            <DialogDescription className="text-base">
              Please review the event details before confirming your registration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600 font-medium">Event:</span>
                <span className="font-semibold text-right max-w-[65%] text-gray-900">
                  {event.title}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Date:</span>
                <span className="font-semibold text-gray-900">
                  {formatDate(event.startDateTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Time:</span>
                <span className="font-semibold text-gray-900">
                  {formatTime(event.startDateTime)}
                </span>
              </div>
              {event.registrationFee > 0 && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Registration Fee:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ₹{event.registrationFee}
                  </span>
                </div>
              )}
            </div>
            
            {event.registrationFee > 0 && (
              <p className="text-xs text-gray-500 text-center">
                You will be redirected to the payment page after confirmation
              </p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRegisterDialog(false)}
              disabled={isRegistering}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Processing...
                </>
              ) : (
                "Confirm Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AlumniEventCard;