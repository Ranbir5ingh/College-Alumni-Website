// pages/DashboardPage.jsx
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Calendar,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleCompleteProfile = () => {
    navigate("/alumni/profile");
  };

  const stats = [
    {
      icon: Users,
      label: "Total Alumni",
      value: "1,234",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Calendar,
      label: "Upcoming Events",
      value: "8",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Briefcase,
      label: "Job Openings",
      value: "45",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Award,
      label: "Active Members",
      value: "892",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName} {user?.lastName}!
            </h2>
            <p className="text-blue-100 text-lg">
              {user?.isVerified
                ? "Your account is verified and active."
                : "Your account is pending verification. Please wait for admin approval."}
            </p>
          </div>
          {user?.isVerified && user?.alumniId && (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-sm text-blue-100">Alumni ID</p>
              <p className="text-2xl font-bold">{user.alumniId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Account Status</h3>
            </div>
            <div className="flex items-center gap-3">
              {user?.membershipStatus === "active" && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Active Member
                </span>
              )}
              {user?.membershipStatus === "pending" && (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  Pending Approval
                </span>
              )}
              {user?.membershipStatus === "inactive" && (
                <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Academic Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Batch</p>
                <p className="text-lg font-semibold text-gray-900">{user?.batch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Degree</p>
                <p className="text-lg font-semibold text-gray-900">{user?.degree}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          {(user?.currentCompany || user?.currentPosition) && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Professional Information</h3>
              </div>
              <div className="space-y-3">
                {user?.currentCompany && (
                  <div>
                    <p className="text-sm text-gray-600">Current Company</p>
                    <p className="text-lg font-semibold text-gray-900">{user.currentCompany}</p>
                  </div>
                )}
                {user?.currentPosition && (
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="text-lg font-semibold text-gray-900">{user.currentPosition}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - 1 column */}
        <div className="space-y-6">
          {/* Complete Profile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-gray-900">Complete Your Profile</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add more information to connect with other alumni and access all features.
            </p>
            <button
              onClick={handleCompleteProfile}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Profile
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/alumni/directory")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                Browse Alumni Directory
              </button>
              <button
                onClick={() => navigate("/alumni/events")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                View Upcoming Events
              </button>
              <button
                onClick={() => navigate("/alumni/careers")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                Explore Career Opportunities
              </button>
              <button
                onClick={() => navigate("/alumni/giveback")}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                Give Back to Alma Mater
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;