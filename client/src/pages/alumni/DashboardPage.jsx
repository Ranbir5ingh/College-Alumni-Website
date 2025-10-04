import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyDashboard } from "@/store/user/alumni-slice";
import { 
  Calendar,
  Heart,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Users,
  Briefcase,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, isLoading } = useSelector((state) => state.userAlumni);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyDashboard());
  }, [dispatch]);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { profile, stats, upcomingEvents, recentDonations, membership } = dashboardData;

  // Show profile completion notification
  const showProfileNotification = profile.accountStatus === 'incomplete_profile' || !profile.isProfileComplete;

  return (
    <div className="space-y-6">
      {/* Profile Completion Notification */}
      {showProfileNotification && (
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Complete Your Profile</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Your profile is {stats.accountCompleteness}% complete. Add more information to unlock all features and connect with other alumni.
                </p>
                <Progress value={stats.accountCompleteness} className="h-2 mb-3" />
                <Button
                  onClick={() => navigate("/alumni/profile")}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  size="sm"
                >
                  Complete Profile Now
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {profile.firstName}!
            </h2>
            <p className="text-blue-100 text-lg">
              {profile.isVerified
                ? `Alumni ID: ${profile.alumniId} • Member since ${new Date(user?.createdAt).getFullYear()}`
                : "Your account is pending verification"}
            </p>
          </div>
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt={profile.firstName}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Events Attended</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEventsAttended}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEventsCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalDonations.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Heart className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Membership</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.membershipStatus === 'active' ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-gray-500">Inactive</span>
                  )}
                </p>
              </div>
              <div className={`${stats.membershipStatus === 'active' ? 'bg-green-100' : 'bg-gray-100'} p-3 rounded-lg`}>
                <Award className={stats.membershipStatus === 'active' ? 'text-green-600' : 'text-gray-600'} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-blue-600" size={20} />
                  Upcoming Events
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/alumni/events")}
                >
                  View All
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/alumni/events/${event._id}`)}
                    >
                      <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                        <Calendar className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto mb-3 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">No upcoming events registered</p>
                  <Button onClick={() => navigate("/alumni/events")} variant="outline">
                    Browse Events
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-purple-600" size={20} />
                  Recent Contributions
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/alumni/giveback")}
                >
                  View All
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentDonations && recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {recentDonations.map((donation) => (
                    <div
                      key={donation._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">₹{donation.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="mx-auto mb-3 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">No contributions yet</p>
                  <Button onClick={() => navigate("/alumni/giveback")} variant="outline">
                    Make a Contribution
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Info */}
          {profile.currentCompany && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={20} />
                  Professional Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Current Position</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.currentDesignation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.currentCompany}</p>
                  </div>
                  <Button
                    onClick={() => navigate("/alumni/profile")}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Update Professional Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {profile.isVerified ? (
                    <>
                      <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                      <div>
                        <p className="font-semibold text-gray-900">Verified</p>
                        <p className="text-sm text-gray-600">Full access enabled</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="text-yellow-600 flex-shrink-0" size={24} />
                      <div>
                        <p className="font-semibold text-gray-900">Pending</p>
                        <p className="text-sm text-gray-600">Awaiting verification</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Batch</span>
                      <span className="font-semibold">{profile.batch}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Department</span>
                      <span className="font-semibold">{profile.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Degree</span>
                      <span className="font-semibold">{profile.degree}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Membership Card */}
          {membership && membership.membershipId && (
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="text-purple-600" size={20} />
                  Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="text-xl font-bold text-gray-900">{membership.membershipId.name}</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                      {membership.membershipId.tier}
                    </span>
                  </div>
                  {membership.expiryDate && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">Expires on</p>
                      <p className="text-sm font-semibold">
                        {new Date(membership.expiryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => navigate("/alumni/giveback")}
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                  >
                    Manage Membership
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/alumni/directory")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Users size={16} className="mr-2" />
                  Browse Alumni Directory
                </Button>
                <Button
                  onClick={() => navigate("/alumni/events")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Calendar size={16} className="mr-2" />
                  Explore Events
                </Button>
                <Button
                  onClick={() => navigate("/alumni/careers")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Briefcase size={16} className="mr-2" />
                  Job Opportunities
                </Button>
                <Button
                  onClick={() => navigate("/alumni/giveback")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Heart size={16} className="mr-2" />
                  Give Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;