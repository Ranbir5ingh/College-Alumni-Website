import { ImagePlus, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const RECOMMENDED_WIDTH = 1200;
const RECOMMENDED_HEIGHT = 630;

function EventCoverImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  defaultImageUrl = "",
}) {
  const inputRef = useRef(null);
  const [dimensionError, setDimensionError] = useState("");
  const displayImageUrl = uploadedImageUrl || defaultImageUrl;

  function validateImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width === RECOMMENDED_WIDTH && img.height === RECOMMENDED_HEIGHT) {
          setDimensionError("");
          resolve(true);
        } else {
          setDimensionError(
            `Image dimensions are ${img.width}x${img.height}px. Recommended: ${RECOMMENDED_WIDTH}x${RECOMMENDED_HEIGHT}px`
          );
          resolve(true); // Allow upload but show warning
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image"));
      };

      img.src = objectUrl;
    });
  }

  async function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      try {
        await validateImageDimensions(selectedFile);
        setImageFile(selectedFile);
      } catch (error) {
        console.error("Image validation failed:", error);
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  async function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      try {
        await validateImageDimensions(droppedFile);
        setImageFile(droppedFile);
      } catch (error) {
        console.error("Image validation failed:", error);
      }
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    setDimensionError("");
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
    <div className="w-full mb-4">
      <Label className="text-sm font-medium mb-2 block">
        Event Cover Image
      </Label>

      {/* Info banner */}
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            Recommended dimensions: <strong>{RECOMMENDED_WIDTH}x{RECOMMENDED_HEIGHT}px</strong> (16:9 aspect ratio). 
            This ensures optimal display across all devices.
          </span>
        </p>
      </div>

      {/* Dimension warning */}
      {dimensionError && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{dimensionError}</span>
          </p>
        </div>
      )}

      <div className="relative">
        {/* Upload area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full rounded-lg border-2 border-dashed border-gray-300 overflow-hidden hover:border-blue-400 transition-colors"
          style={{ aspectRatio: `${RECOMMENDED_WIDTH}/${RECOMMENDED_HEIGHT}` }}
        >
          <Input
            id="event-cover-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
          />

          {imageLoadingState ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Skeleton className="w-full h-full bg-gray-200" />
            </div>
          ) : displayImageUrl ? (
            // Show uploaded image with overlay
            <div className="relative w-full h-full group">
              <img
                src={displayImageUrl.replace(/^http:\/\//, "https://")}
                alt="Event Cover"
                className="w-full h-full object-cover"
              />
              
              {/* Hover overlay */}
              <Label
                htmlFor="event-cover-upload"
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="text-center text-white">
                  <ImagePlus className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Change Image</p>
                </div>
              </Label>

              {/* Remove button */}
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            // Show upload placeholder
            <Label
              htmlFor="event-cover-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <ImagePlus className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG or WEBP (Recommended: {RECOMMENDED_WIDTH}x{RECOMMENDED_HEIGHT}px)
              </p>
            </Label>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCoverImageUpload;