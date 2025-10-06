import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getAlumniById, verifyAlumni, deleteAlumni, clearCurrentAlumni } from "@/store/admin/alumni-slice";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Check,
  X,
  Trash2,
  Loader2,
  User,
  Building2,
  Award,
  CreditCard,
  Heart,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function AlumniDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentAlumni, isLoading } = useSelector((state) => state.adminAlumni);

  useEffect(() => {
    if (id) {
      dispatch(getAlumniById(id));
    }
    return () => {
      dispatch(clearCurrentAlumni());
    };
  }, [id, dispatch]);

  const handleVerify = () => {
    if (window.confirm("Are you sure you want to verify this alumni?")) {
      dispatch(verifyAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success("Alumni verified successfully");
          dispatch(getAlumniById(id));
        }
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this alumni? This action cannot be undone.")) {
      dispatch(deleteAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success("Alumni deleted successfully");
          navigate("/admin/alumni");
        }
      });
    }
  };

  if (isLoading || !currentAlumni) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const alumni = currentAlumni;
  const statusColors = {
    verified: "bg-green-100 text-green-800",
    pending_verification: "bg-yellow-100 text-yellow-800",
    incomplete_profile: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  const InfoRow = ({ icon: Icon, label, value, link }) => (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="text-gray-600" size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
            {value || "N/A"}
          </a>
        ) : (
          <p className="font-medium text-gray-900">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/alumni")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alumni Details</h1>
            <p className="text-gray-600 mt-1">Complete profile information</p>
          </div>
        </div>
        <div className="flex gap-2">
          {alumni.accountStatus === 'pending_verification' && (
            <>
              <Button
                onClick={handleVerify}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check size={18} />
                Verify Alumni
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="gap-2"
              >
                <X size={18} />
                Reject
              </Button>
            </>
          )}
          {alumni.accountStatus !== 'pending_verification' && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 size={18} />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {alumni.profilePicture ? (
              <img
                src={alumni.profilePicture}
                alt={`${alumni.firstName} ${alumni.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="text-gray-500" size={40} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {alumni.firstName} {alumni.middleName && alumni.middleName + ' '}{alumni.lastName}
                  </h2>
                  <p className="text-gray-600 mt-1">{alumni.email}</p>
                  {alumni.currentDesignation && alumni.currentCompany && (
                    <p className="text-gray-600 mt-1">
                      {alumni.currentDesignation} at {alumni.currentCompany}
                    </p>
                  )}
                </div>
                <Badge className={`${statusColors[alumni.accountStatus]} capitalize`}>
                  {alumni.accountStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
              {alumni.bio && (
                <p className="text-gray-700 mt-4">{alumni.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-blue-600" size={20} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              icon={User}
              label="Alumni ID"
              value={alumni.alumniId || "Not Assigned"}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={alumni.email}
            />
            {alumni.secondaryEmail && (
              <InfoRow
                icon={Mail}
                label="Secondary Email"
                value={alumni.secondaryEmail}
              />
            )}
            <InfoRow
              icon={Phone}
              label="Phone"
              value={alumni.phone}
            />
            {alumni.secondaryPhone && (
              <InfoRow
                icon={Phone}
                label="Secondary Phone"
                value={alumni.secondaryPhone}
              />
            )}
            <InfoRow
              icon={User}
              label="Gender"
              value={alumni.gender}
            />
            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={alumni.dateOfBirth ? new Date(alumni.dateOfBirth).toLocaleDateString() : "N/A"}
            />
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="text-blue-600" size={20} />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              icon={GraduationCap}
              label="Enrollment Number"
              value={alumni.enrollmentNumber}
            />
            <InfoRow
              icon={Award}
              label="Batch"
              value={alumni.batch}
            />
            <InfoRow
              icon={Building2}
              label="Department"
              value={alumni.department}
            />
            <InfoRow
              icon={Award}
              label="Degree"
              value={alumni.degree}
            />
            <InfoRow
              icon={Calendar}
              label="Year of Joining"
              value={alumni.yearOfJoining}
            />
            <InfoRow
              icon={Calendar}
              label="Year of Passing"
              value={alumni.yearOfPassing}
            />
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="text-blue-600" size={20} />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              icon={Building2}
              label="Current Company"
              value={alumni.currentCompany}
            />
            <InfoRow
              icon={Briefcase}
              label="Current Designation"
              value={alumni.currentDesignation}
            />
            <InfoRow
              icon={Building2}
              label="Industry"
              value={alumni.industry}
            />
            {alumni.linkedInProfile && (
              <InfoRow
                icon={LinkIcon}
                label="LinkedIn Profile"
                value="View Profile"
                link={alumni.linkedInProfile}
              />
            )}
            {alumni.skills && alumni.skills.length > 0 && (
              <div className="py-3">
                <p className="text-sm text-gray-600 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-blue-600" size={20} />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {alumni.address?.street && (
              <InfoRow
                icon={MapPin}
                label="Street"
                value={alumni.address.street}
              />
            )}
            {alumni.address?.city && (
              <InfoRow
                icon={MapPin}
                label="City"
                value={alumni.address.city}
              />
            )}
            {alumni.address?.state && (
              <InfoRow
                icon={MapPin}
                label="State"
                value={alumni.address.state}
              />
            )}
            {alumni.address?.country && (
              <InfoRow
                icon={MapPin}
                label="Country"
                value={alumni.address.country}
              />
            )}
            {alumni.address?.pincode && (
              <InfoRow
                icon={MapPin}
                label="Pincode"
                value={alumni.address.pincode}
              />
            )}
            {!alumni.address || (!alumni.address.street && !alumni.address.city) && (
              <p className="text-gray-500 py-4">No address information available</p>
            )}
          </CardContent>
        </Card>

        {/* Membership Information */}
        {alumni.currentMembership && alumni.currentMembership.membershipId && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20} />
                Membership Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-gray-600">Membership Plan</p>
                <p className="text-lg font-bold text-purple-900">
                  {alumni.currentMembership.membershipId.name}
                </p>
                <Badge className="mt-2 bg-purple-600 text-white uppercase">
                  {alumni.currentMembership.membershipId.tier}
                </Badge>
              </div>
              {alumni.currentMembership.startDate && (
                <InfoRow
                  icon={Calendar}
                  label="Start Date"
                  value={new Date(alumni.currentMembership.startDate).toLocaleDateString()}
                />
              )}
              {alumni.currentMembership.expiryDate && (
                <InfoRow
                  icon={Calendar}
                  label="Expiry Date"
                  value={new Date(alumni.currentMembership.expiryDate).toLocaleDateString()}
                />
              )}
              <InfoRow
                icon={Award}
                label="Status"
                value={<Badge className={`${
                  alumni.currentMembership.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {alumni.currentMembership.status}
                </Badge>}
              />
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-blue-600" size={20} />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow
              icon={User}
              label="Role"
              value={<Badge variant="outline" className="capitalize">{alumni.role}</Badge>}
            />
            <InfoRow
              icon={Check}
              label="Profile Complete"
              value={alumni.isProfileComplete ? (
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Incomplete</Badge>
              )}
            />
            <InfoRow
              icon={Check}
              label="Can Post Jobs"
              value={alumni.canPostJobs ? "Yes" : "No"}
            />
            <InfoRow
              icon={Check}
              label="Can Mentor"
              value={alumni.canMentor ? "Yes" : "No"}
            />
            <InfoRow
              icon={Check}
              label="Active"
              value={alumni.isActive ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">Inactive</Badge>
              )}
            />
            {alumni.verifiedAt && (
              <InfoRow
                icon={Calendar}
                label="Verified At"
                value={new Date(alumni.verifiedAt).toLocaleString()}
              />
            )}
            <InfoRow
              icon={Calendar}
              label="Registered At"
              value={new Date(alumni.createdAt).toLocaleString()}
            />
            <InfoRow
              icon={Calendar}
              label="Last Updated"
              value={new Date(alumni.updatedAt).toLocaleString()}
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-blue-600" size={20} />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <Calendar className="mx-auto text-blue-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-blue-900">
                {alumni.eventRegistrations?.length || 0}
              </p>
              <p className="text-sm text-blue-700">Events Registered</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <Heart className="mx-auto text-purple-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-purple-900">
                {alumni.donations?.length || 0}
              </p>
              <p className="text-sm text-purple-700">Donations Made</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <Award className="mx-auto text-green-600 mb-2" size={24} />
              <p className="text-2xl font-bold text-green-900">
                {alumni.membershipHistory?.length || 0}
              </p>
              <p className="text-sm text-green-700">Membership History</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AlumniDetails;