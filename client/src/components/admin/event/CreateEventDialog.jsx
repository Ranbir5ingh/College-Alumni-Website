import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventFormFields from "./EventFormFields";

function CreateEventDialog({ open, onOpenChange, onSubmit }) {
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
    coverImage: "",
  });

  const [batchInput, setBatchInput] = useState("");
  const [deptInput, setDeptInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const resetForm = () => {
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

  const handleSubmit = () => {
    const eventData = { ...formData };
    if (!eventData.isOnline) {
      delete eventData.meetingLink;
    } else {
      delete eventData.venue;
    }
    onSubmit(eventData);
    resetForm();
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new alumni event
          </DialogDescription>
        </DialogHeader>
        
        <EventFormFields
          formData={formData}
          setFormData={setFormData}
          batchInput={batchInput}
          setBatchInput={setBatchInput}
          deptInput={deptInput}
          setDeptInput={setDeptInput}
          tagInput={tagInput}
          setTagInput={setTagInput}
        />

        <DialogFooter>
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEventDialog;