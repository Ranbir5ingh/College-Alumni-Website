import { Camera, User, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProfilePictureUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode = false,
  defaultImageUrl = "", // ✅ new fallback prop
}) {
  const inputRef = useRef(null);
  const displayImageUrl = uploadedImageUrl || defaultImageUrl;

  console.log(displayImageUrl)

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/alumni/upload-image`,
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="flex flex-col items-center mb-4">
      <Label className="text-sm font-medium mb-3 text-white">
        Profile Picture
      </Label>

      <div className="relative flex flex-col items-center justify-center">
        {/* Main circular container */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative w-24 h-24 rounded-full border-2 border-dashed border-gray-400 overflow-hidden ${
            isEditMode ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          } hover:border-[#93c5fd] transition-colors`}
        >
          <Input
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            disabled={isEditMode}
          />

          {imageLoadingState ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Skeleton className="w-full h-full rounded-full bg-gray-700" />
            </div>
          ) : displayImageUrl  ? (
            // Show uploaded image - clickable to change
            <Label
              htmlFor="profile-pic-upload"
              className={`relative w-full h-full ${
                isEditMode ? "cursor-not-allowed" : "cursor-pointer"
              } group`}
            >
              <img
                src={displayImageUrl?.replace(/^http:\/\//, "https://")}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {!isEditMode && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </Label>
          ) : (
            // Show upload placeholder
            <Label
              htmlFor="profile-pic-upload"
              className={`flex flex-col items-center justify-center w-full h-full ${
                isEditMode ? "cursor-not-allowed" : "cursor-pointer"
              } border-white/10 bg-black/5 hover:bg-gray-700 transition-colors`}
            >
              <User className="w-8 h-8 text-gray-400 mb-1" />
              <Camera className="w-4 h-4 text-gray-500" />
            </Label>
          )}
        </div>

        {/* Upload hint text */}
        <p className="text-xs text-gray-400 mt-2 text-center max-w-[120px]">
          Click or drag to upload
        </p>
      </div>
    </div>
  );
}

export default ProfilePictureUpload;
