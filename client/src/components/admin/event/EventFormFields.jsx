import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventCoverImageUpload from "@/components/common/EventCoverImageUpload";


function EventFormFields({ formData, setFormData, batchInput, setBatchInput, deptInput, setDeptInput, tagInput, setTagInput }) {
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageLoadingState, setCoverImageLoadingState] = useState(false);
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

  const addArrayItem = (field, value, setter) => {
    if (value.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter("");
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Cover Image Upload */}
      <EventCoverImageUpload
        imageFile={coverImageFile}
        setImageFile={setCoverImageFile}
        imageLoadingState={coverImageLoadingState}
        uploadedImageUrl={formData.coverImage}
        setUploadedImageUrl={(url) => setFormData({ ...formData, coverImage: url })}
        setImageLoadingState={setCoverImageLoadingState}
        defaultImageUrl={formData.coverImage || ""}
      />

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
  );
}

export default EventFormFields;