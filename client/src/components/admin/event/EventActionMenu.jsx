import { MoreVertical, Eye, Users, QrCode, Download, Mail, CheckCircle, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function EventActionMenu({ event, onViewRegistrations, onGenerateQR, onExport, onSendReminders, onUpdateStatus, onDelete }) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:bg-gray-100 text-gray-700 p-2">
          <MoreVertical size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => navigate(`/admin/events/${event._id}`)}>
          <Eye size={16} className="mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewRegistrations(event)}>
          <Users size={16} className="mr-2" />
          Registrations ({event.currentAttendees || 0})
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onGenerateQR(event)}>
          <QrCode size={16} className="mr-2" />
          Generate QR Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport(event._id)}>
          <Download size={16} className="mr-2" />
          Export Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSendReminders(event._id)}>
          <Mail size={16} className="mr-2" />
          Send Reminders
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {event.status !== "published" && (
          <DropdownMenuItem onClick={() => onUpdateStatus(event._id, "published", event.isFeatured)}>
            <CheckCircle size={16} className="mr-2" />
            Publish Event
          </DropdownMenuItem>
        )}
        {!event.isFeatured && (
          <DropdownMenuItem onClick={() => onUpdateStatus(event._id, event.status, true)}>
            <Star size={16} className="mr-2" />
            Mark as Featured
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onDelete(event)} className="text-red-600">
          <Trash2 size={16} className="mr-2" />
          Delete Event
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EventActionMenu;