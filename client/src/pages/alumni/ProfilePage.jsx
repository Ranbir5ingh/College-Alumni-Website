import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  completeProfile,
  updateProfile,
  requestVerification,
  requestPasswordReset,
  clearError,
  getAlumniProfile,
} from "../../store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Edit, Save, X, CheckCircle, Clock, AlertCircle, KeyRound } from "lucide-react";
import ProfilePictureUpload from "@/components/common/pfpUpload";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading: authLoading, error } = useSelector((state) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    profilePicture: "",
    bio: "",
    phone: "",
    gender: "Prefer not to say",
    dateOfBirth: "",
    currentDesignation: "",
    currentCompany: "",
    industry: "",
    linkedInProfile: "",
    address: { street: "", city: "", state: "", country: "", pincode: "" },
  });

  useEffect(() => {
    if (!user && !authLoading) {
      dispatch(getAlumniProfile());
    }
  }, [user, authLoading, dispatch]);

  useEffect(() => {
    if (user) {
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
      
      if (user.accountStatus === 'incomplete_profile') {
        setIsEditMode(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (uploadedImageUrl && uploadedImageUrl !== formData.profilePicture) {
      setFormData(prev => ({ ...prev, profilePicture: uploadedImageUrl }));
    }
  }, [uploadedImageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "country", "pincode"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = user.accountStatus === 'incomplete_profile'
      ? await dispatch(completeProfile(formData))
      : await dispatch(updateProfile({ id: user._id, formData }));

    if (result.meta.requestStatus === "fulfilled") {
      setIsEditMode(false);
    }
    setIsSubmitting(false);
  };

  const handleRequestVerification = async () => {
    setIsSubmitting(true);
    await dispatch(requestVerification());
    setIsSubmitting(false);
  };

  const handlePasswordResetRequest = async () => {
    setPasswordResetLoading(true);
    const result = await dispatch(requestPasswordReset());
    setPasswordResetLoading(false);
    
    if (result.meta.requestStatus === "fulfilled") {
      setPasswordResetSuccess(true);
    }
  };

  const closePasswordDialog = () => {
    setShowPasswordDialog(false);
    setPasswordResetSuccess(false);
  };

  if (!user && authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">Please log in to view your profile.</div>;
  }

  const { accountStatus } = user;
  const isIncomplete = accountStatus === 'incomplete_profile';
  const isPending = accountStatus === 'pending_verification';
  const isVerified = accountStatus === 'verified';

  const StatusBanner = () => {
    if (isVerified) {
      return (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <p className="font-semibold text-green-900">Profile Verified</p>
            <p className="text-sm text-green-700">You have full access to all alumni features</p>
          </div>
        </div>
      );
    }
    
    if (isPending) {
      return (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg flex items-center gap-3">
          <Clock className="text-yellow-600" size={24} />
          <div>
            <p className="font-semibold text-yellow-900">Verification Pending</p>
            <p className="text-sm text-yellow-700">Your profile is under review by administrators</p>
          </div>
        </div>
      );
    }

    if (isIncomplete) {
      return (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-blue-600" size={24} />
          <div>
            <p className="font-semibold text-blue-900">Complete Your Profile</p>
            <p className="text-sm text-blue-700">Fill in all required fields to request verification</p>
          </div>
        </div>
      );
    }
  };

  const DisplayField = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <Label className="text-sm text-gray-600 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-400" />}
        {label}
      </Label>
      <p className="text-base text-gray-900 font-medium">
        {value || <span className="text-gray-400">Not provided</span>}
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Password Reset Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {passwordResetSuccess ? "Email Sent!" : "Change Password"}
            </DialogTitle>
            <DialogDescription>
              {passwordResetSuccess ? (
                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span className="font-medium">Password reset link sent successfully!</span>
                  </div>
                  <p className="text-gray-600">
                    We've sent a secure password reset link to <strong>{user.email}</strong>
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      The link will expire in 1 hour. Please check your email and click the link to reset your password.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <p>We will send a secure password reset link to your email address:</p>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click the link in the email to securely reset your password.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {passwordResetSuccess ? (
              <Button onClick={closePasswordDialog} className="w-full">
                Got it
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                  disabled={passwordResetLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordResetRequest}
                  disabled={passwordResetLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {passwordResetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              {user.firstName} {user.lastName} • {user.batch} • {user.department}
            </p>
          </div>
          <Badge className={
            isVerified ? "bg-green-100 text-green-800" :
            isPending ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          }>
            {accountStatus.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <StatusBanner />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <ProfilePictureUpload
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    imageLoadingState={imageLoadingState}
                    uploadedImageUrl={uploadedImageUrl}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    isEditMode={!isEditMode || isPending}
                    defaultImageUrl={user.profilePicture}
                  />
                  
                  {isEditMode && !isPending && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click to upload/change profile picture
                    </p>
                  )}

                  <div className="w-full mt-6 pt-6 border-t space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Enrollment</Label>
                      <p className="text-sm font-medium">{user.enrollmentNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Year of Passing</Label>
                      <p className="text-sm font-medium">{user.yearOfPassing}</p>
                    </div>
                  </div>

                  {/* Change Password Button */}
                  <div className="w-full mt-6 pt-6 border-t">
                    <Button
                      type="button"
                      onClick={() => setShowPasswordDialog(true)}
                      className="w-full bg-gray-700 hover:bg-gray-800"
                    >
                      <KeyRound size={16} className="mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  {!isIncomplete && !isPending && !isEditMode && (
                    <Button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone *</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={formData.gender} onValueChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Bio</Label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows="3"
                        maxLength="500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <DisplayField label="Phone" value={user.phone} />
                    <DisplayField label="Gender" value={user.gender} />
                    <DisplayField label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : null} />
                    <div className="col-span-2">
                      <DisplayField label="Bio" value={user.bio} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Details</h2>

                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Current Designation *</Label>
                      <Input
                        name="currentDesignation"
                        value={formData.currentDesignation}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer"
                        required
                      />
                    </div>
                    <div>
                      <Label>Current Company *</Label>
                      <Input
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="e.g., Google"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Industry *</Label>
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="e.g., Information Technology"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>LinkedIn Profile</Label>
                      <Input
                        type="url"
                        name="linkedInProfile"
                        value={formData.linkedInProfile}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <DisplayField label="Designation" value={user.currentDesignation} />
                    <DisplayField label="Company" value={user.currentCompany} />
                    <DisplayField label="Industry" value={user.industry} />
                    <div className="col-span-2">
                      <DisplayField 
                        label="LinkedIn" 
                        value={user.linkedInProfile ? (
                          <a href={user.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Profile
                          </a>
                        ) : null}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Address</h2>

                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Street</Label>
                      <Input
                        name="street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                      />
                    </div>
                    <div>
                      <Label>State/Region *</Label>
                      <Input
                        name="state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <Label>Country *</Label>
                      <Input
                        name="country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <DisplayField label="Street" value={user.address?.street} />
                    </div>
                    <DisplayField label="City" value={user.address?.city} />
                    <DisplayField label="Pincode" value={user.address?.pincode} />
                    <DisplayField label="State" value={user.address?.state} />
                    <DisplayField label="Country" value={user.address?.country} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEditMode && !isPending && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting || imageLoadingState}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isIncomplete ? "Saving..." : "Updating..."}
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          {isIncomplete ? "Save Profile" : "Update Profile"}
                        </>
                      )}
                    </Button>
                    {!isIncomplete && (
                      <Button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification Request */}
            {!isPending && !isVerified && !isEditMode && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">Ready to get verified?</p>
                    <Button
                      onClick={handleRequestVerification}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        "Request Verification"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;