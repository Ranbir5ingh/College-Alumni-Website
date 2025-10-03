import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  completeProfile,
  updateProfile,
  requestVerification,
  clearError,
  getAlumniProfile,
} from "../../store/auth-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowUpCircle } from "lucide-react";
import ProfilePictureUpload from "@/components/common/pfpUpload";

// Helper function to check for empty strings/nulls in required fields
const isFormValid = (data) => {
  // Check essential fields based on the Mongoose schema's implicit completion requirements
  const requiredFields = [
    data.profilePicture,
    data.phone,
    data.currentDesignation,
    data.currentCompany,
    data.industry, // Mapped from your Mongoose schema
    data.address.country,
    data.address.state,
    // Note: gender and dateOfBirth are not required here but can be added if backend enforces
  ];

  // We check for falsy values (null, undefined, empty string)
  return requiredFields.every(field => field !== null && field !== undefined && field !== "");
};

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading: authLoading, error } = useSelector((state) => state.auth);

  // Determine the mode based on the user object
  const isProfileIncomplete = user && user.accountStatus === 'incomplete_profile';
  const isCompleteMode = user && isProfileIncomplete;
  const isEditMode = user && !isProfileIncomplete; // If complete or already pending verification

  // Use local state for form data, initialized with user data or empty strings, using Mongoose field names
  const [formData, setFormData] = useState({
    profilePicture: user?.profilePicture || "", // Mongoose field name
    bio: user?.bio || "",
    phone: user?.phone || "", // Mongoose field name
    gender: user?.gender || "Prefer not to say",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
    currentDesignation: user?.currentDesignation || "",
    currentCompany: user?.currentCompany || "",
    industry: user?.industry || "", // Mongoose field name
    linkedInProfile: user?.linkedInProfile || "",
    address: { // Mongoose embedded object
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        country: user?.address?.country || "",
        pincode: user?.address?.pincode || "",
    },
  });

  // State for PFP component
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(user?.profilePicture || "");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(null);

  // Reset/Fetch profile on mount/user change
  useEffect(() => {
    if (!user && !authLoading) {
        dispatch(getAlumniProfile());
    } else if (user) {
        // Update local form state when user data changes (e.g., after initial fetch)
        setFormData({
            profilePicture: user.profilePicture || "",
            bio: user.bio || "",
            phone: user.phone || "",
            gender: user.gender || "Prefer not to say",
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
            currentDesignation: user.currentDesignation || "",
            currentCompany: user.currentCompany || "",
            industry: user.industry || "",
            linkedInProfile: user.linkedInProfile || "",
            address: {
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                country: user.address?.country || "",
                pincode: user.address?.pincode || "",
            },
        });
        setUploadedImageUrl(user.profilePicture || "");
    }
  }, [user, dispatch, authLoading]);

  // Update form data with the new uploaded image URL
  useEffect(() => {
    if (uploadedImageUrl && uploadedImageUrl !== formData.profilePicture) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  const handleChange = (e) => {
    dispatch(clearError());
    const { name, value } = e.target;
    
    // Check if the field belongs to the address subdocument
    if (["street", "city", "state", "country", "pincode"].includes(name)) {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    } else {
        setFormData({
            ...formData,
            [name]: value,
        });
    }
  };

  const handleSelectChange = (name, value) => {
    dispatch(clearError());
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAddressChange = (name, value) => {
    dispatch(clearError());
    setFormData((prev) => ({
        ...prev,
        address: {
            ...prev.address,
            [name]: value,
        },
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalSuccess(null);
    dispatch(clearError());

    // Final check for the form validity
    if (!isFormValid(formData)) {
        alert("Please fill out all required fields marked with *, including uploading a profile picture.");
        setIsSubmitting(false);
        return;
    }

    let result;
    if (isCompleteMode) {
      result = await dispatch(completeProfile(formData));
    } else if (isEditMode) {
      result = await dispatch(updateProfile({ id: user._id, formData }));
    }

    if (result.meta.requestStatus === "fulfilled") {
      setLocalSuccess(isCompleteMode ? "profileCompleted" : "profileUpdated");
    }
    
    setIsSubmitting(false);
  };
  
  const handleRequestVerification = async () => {
    setIsSubmitting(true);
    setLocalSuccess(null);
    dispatch(clearError());
    const result = await dispatch(requestVerification());
    if (result.meta.requestStatus === "fulfilled") {
        setLocalSuccess("verificationRequested");
    }
    setIsSubmitting(false);
  };

  // ----------------------- Render Logic -----------------------
  if (!user && authLoading) {
      return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;
  }

  if (!user) {
      return <div className="p-8 text-center text-red-500">User profile data not found. Please log in again.</div>;
  }

  const { accountStatus } = user;

  // Dynamic Content
  const pageTitle = isCompleteMode 
    ? "Complete Your Profile"
    : "Edit Profile";

  const submitButtonText = isCompleteMode
    ? "Complete Profile"
    : "Save Changes";

  const isPendingVerification = accountStatus === 'pending_verification';


  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-4xl mx-auto">
      <h2 className={`text-3xl font-bold mb-6 text-center ${isCompleteMode ? 'text-blue-600' : 'text-gray-800'}`}>
        {pageTitle}
      </h2>
      <p className={`text-sm text-center mb-6 ${isCompleteMode ? 'text-gray-600' : 'text-gray-500'}`}>
        {isCompleteMode
          ? "Fill out the required details to request verification and join the alumni network."
          : `Account Status: ${accountStatus.toUpperCase().replace('_', ' ')}`}
      </p>

      {(error || localSuccess) && (
        <div className={`p-3 rounded-md mb-5 text-sm ${
            error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {error 
            ? error.message || "An unknown error occurred."
            : localSuccess === "profileCompleted" 
            ? "Profile completed successfully! Submit your verification request."
            : localSuccess === "profileUpdated" 
            ? "Profile updated successfully!"
            : localSuccess === "verificationRequested" 
            ? "Verification request sent! Please wait for admin approval."
            : ""
          }
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Picture Column - Span 1/3 */}
          <div className="md:col-span-1 flex flex-col items-center">
            <ProfilePictureUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              imageLoadingState={imageLoadingState}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              isEditMode={imageLoadingState || isPendingVerification} // Disable editing while uploading or pending verification
              defaultImageUrl={user?.profilePicture}
            />
            {/* Display PFP status for user context */}
            <p className="text-xs text-gray-500 mt-2">
                *Required. Click or drag to upload/change.
            </p>
            {isPendingVerification && (
                <div className="mt-4 p-2 text-center text-xs bg-yellow-100 text-yellow-800 rounded-md">
                    Profile is locked for editing while verification is pending.
                </div>
            )}
          </div>

          {/* Form Fields Column - Span 2/3 */}
          <div className="md:col-span-2 space-y-4">
            
            {/* 1. Personal Info */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <h3 className="col-span-2 text-lg font-bold text-gray-700">Personal & Contact Info</h3>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Gender
                    </label>
                    <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number * (Mongoose field: `phone`)
                    </label>
                    <input
                        type="tel"
                        name="phone" // Mongoose field name
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="Enter phone number"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Bio (Max 500 chars)
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        maxLength="500"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500 resize-none"
                        placeholder="A brief summary about yourself..."
                        rows="3"
                    />
                </div>
            </div>

            {/* 2. Professional Info */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <h3 className="col-span-2 text-lg font-bold text-gray-700">Professional Details</h3>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Current Designation *
                    </label>
                    <input
                        type="text"
                        name="currentDesignation"
                        value={formData.currentDesignation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., Software Engineer"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Current Company *
                    </label>
                    <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., Google, Tesla"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Industry *
                    </label>
                    <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., Information Technology, Finance"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        LinkedIn Profile URL
                    </label>
                    <input
                        type="url"
                        name="linkedInProfile"
                        value={formData.linkedInProfile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="https://linkedin.com/in/yourname"
                    />
                </div>
            </div>
            
            {/* 3. Address Info */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <h3 className="col-span-2 text-lg font-bold text-gray-700">Address (Embedded)</h3>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Country *
                    </label>
                    <input
                        type="text"
                        name="country"
                        value={formData.address.country}
                        onChange={handleChange} // Uses generic handleChange, which is updated to handle address
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., India"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        State/Region *
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.address.state}
                        onChange={handleChange} // Uses generic handleChange, which is updated to handle address
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., Maharashtra"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., Mumbai"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Pincode
                    </label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                        placeholder="e.g., 400001"
                    />
                </div>
            </div>

            {/* 4. Action Button */}
            <button
              type="submit"
              className={`w-full py-3 text-base font-semibold border-0 rounded-md transition-colors flex items-center justify-center ${
                isSubmitting || imageLoadingState || isPendingVerification
                  ? "bg-gray-400 cursor-not-allowed"
                  : isCompleteMode 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              disabled={isSubmitting || imageLoadingState || isPendingVerification}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCompleteMode ? "Completing..." : "Saving..."}
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </div>
      </form>

      {/* --- Verification Request Section --- */}
      {isEditMode && accountStatus === 'incomplete_profile' && !isPendingVerification && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md mb-4 max-w-md mx-auto">
                  <p className="text-sm font-medium text-yellow-800">
                      **Profile Data Ready:** Submit your profile now to officially request **verification** from the admin.
                  </p>
              </div>
              <button
                  onClick={handleRequestVerification}
                  className={`py-2.5 px-6 text-base font-semibold border-0 rounded-md transition-colors flex items-center justify-center mx-auto ${
                      isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={isSubmitting}
              >
                  {isSubmitting ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Request...
                      </>
                  ) : (
                      <>
                          <ArrowUpCircle className="mr-2 h-5 w-5" />
                          Request Verification
                      </>
                  )}
              </button>
          </div>
      )}
      
      {/* Display Verification Status */}
      {(accountStatus === 'pending_verification' || localSuccess === "verificationRequested") && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md max-w-sm mx-auto">
                <p className="text-sm font-medium text-blue-800">
                    Verification request submitted successfully. Your profile is now locked. You will be notified when it's reviewed.
                </p>
            </div>
        </div>
      )}

      {accountStatus === 'verified' && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-md max-w-sm mx-auto">
                <p className="text-lg font-bold text-green-800">
                    ✅ Profile Verified!
                </p>
                <p className="text-sm text-green-700 mt-1">
                    You now have full access to the alumni network features.
                </p>
            </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;