// pages/ProfilePage.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Github,
  Linkedin,
  Edit,
  MapPin
} from "lucide-react";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  // Show loading only on initial load when we have no user data
  if (!user && isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // If no user data at all, redirect to login
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </div>
              </div>
              
              {/* Name and Basic Info */}
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail size={16} />
                  {user?.email}
                </p>
                {user?.alumniId && (
                  <p className="text-blue-600 font-semibold mt-1">
                    Alumni ID: {user.alumniId}
                  </p>
                )}
              </div>
            </div>
            
            {/* Edit Button */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Edit size={18} />
              Edit Profile
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex gap-3">
            {user?.membershipStatus === "active" && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Active Member
              </span>
            )}
            {user?.isVerified && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal & Contact Info */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Personal Info</h3>
            </div>
            <div className="space-y-4">
              {user?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{user.phone}</p>
                  </div>
                </div>
              )}
              {user?.dateOfBirth && (
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {user?.gender && (
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-900">{user.gender}</p>
                  </div>
                </div>
              )}
              {user?.bloodGroup && (
                <div className="flex items-start gap-3">
                  <Award className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-semibold text-gray-900">{user.bloodGroup}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(user?.linkedinProfile || user?.githubProfile) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {user?.linkedinProfile && (
                  <a
                    href={user.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-600">LinkedIn Profile</span>
                  </a>
                )}
                {user?.githubProfile && (
                  <a
                    href={user.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Github className="text-gray-700" size={20} />
                    <span className="text-sm font-medium text-gray-700">GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Middle & Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Student ID</p>
                <p className="text-lg font-semibold text-gray-900">{user?.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Batch</p>
                <p className="text-lg font-semibold text-gray-900">{user?.batch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Graduation Year</p>
                <p className="text-lg font-semibold text-gray-900">{user?.graduationYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Degree</p>
                <p className="text-lg font-semibold text-gray-900">{user?.degree}</p>
              </div>
              {user?.cgpa && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">CGPA</p>
                  <p className="text-lg font-semibold text-gray-900">{user.cgpa}</p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Professional Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Company</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.currentCompany || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Position</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.currentPosition || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user?.bio && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Skills */}
          {user?.skills && user.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <span>
                Complete profile editing feature will be available soon. Contact admin to 
                update your profile information.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;