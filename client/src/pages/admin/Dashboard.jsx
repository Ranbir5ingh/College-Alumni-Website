import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  UserCheck,
  Briefcase,
  Heart,
  DollarSign
} from "lucide-react";
import { getAlumniStats } from "@/store/admin/alumni-slice";
import { getEventStats } from "@/store/admin/event-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats: alumniStats, isLoading: alumniLoading } = useSelector((state) => state.adminAlumni);
  const { stats: eventStats, isLoading: eventLoading } = useSelector((state) => state.adminEvent);

  useEffect(() => {
    dispatch(getAlumniStats());
    dispatch(getEventStats());
  }, [dispatch]);

  const StatCard = ({ title, value, icon: Icon, trend, color, link }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            {trend}
          </p>
        )}
        {link && (
          <Link to={link} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
            View Details →
          </Link>
        )}
      </CardContent>
    </Card>
  );

  if (alumniLoading || eventLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-blue-100">
          Manage your alumni network, events, and more from this central hub.
        </p>
      </div>

      {/* Pending Actions Alert */}
      {alumniStats?.overview?.pendingVerification > 0 && (
        <Alert className="border-yellow-400 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have <strong>{alumniStats.overview.pendingVerification}</strong> alumni pending verification.
            <Link to="/admin/alumni?status=pending_verification" className="ml-2 underline font-medium">
              Review now
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Alumni Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="text-blue-600" />
          Alumni Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Alumni"
            value={alumniStats?.overview?.totalAlumni || 0}
            icon={Users}
            color="text-blue-600"
            link="/admin/alumni"
          />
          <StatCard
            title="Verified Alumni"
            value={alumniStats?.overview?.verifiedAlumni || 0}
            icon={UserCheck}
            color="text-green-600"
            trend={`${((alumniStats?.overview?.verifiedAlumni / alumniStats?.overview?.totalAlumni) * 100).toFixed(1)}% of total`}
          />
          <StatCard
            title="Pending Verification"
            value={alumniStats?.overview?.pendingVerification || 0}
            icon={Clock}
            color="text-yellow-600"
            link="/admin/alumni?status=pending_verification"
          />
          <StatCard
            title="Active Members"
            value={alumniStats?.overview?.alumniWithMembership || 0}
            icon={DollarSign}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Event Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-blue-600" />
          Event Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events"
            value={eventStats?.overview?.totalEvents || 0}
            icon={Calendar}
            color="text-blue-600"
            link="/admin/events"
          />
          <StatCard
            title="Upcoming Events"
            value={eventStats?.overview?.upcomingEvents || 0}
            icon={Clock}
            color="text-green-600"
            link="/admin/events?status=published"
          />
          <StatCard
            title="Published Events"
            value={eventStats?.overview?.publishedEvents || 0}
            icon={CheckCircle}
            color="text-teal-600"
          />
          <StatCard
            title="Completed Events"
            value={eventStats?.overview?.completedEvents || 0}
            icon={CheckCircle}
            color="text-gray-600"
          />
        </div>
      </div>

      {/* Registration & Attendance */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Event Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Registrations"
            value={eventStats?.registrations?.totalRegistrations || 0}
            icon={Users}
            color="text-blue-600"
          />
          <StatCard
            title="Confirmed Registrations"
            value={eventStats?.registrations?.confirmedRegistrations || 0}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatCard
            title="Attendance Rate"
            value={eventStats?.registrations?.attendanceRate || "0%"}
            icon={TrendingUp}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Alumni by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {alumniStats?.departmentStats?.length > 0 ? (
              <div className="space-y-3">
                {alumniStats.departmentStats.slice(0, 5).map((dept) => (
                  <div key={dept._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {dept._id || "Not Specified"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(dept.count / alumniStats.overview.totalAlumni) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {dept.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Event Type Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {eventStats?.eventTypeStats?.length > 0 ? (
              <div className="space-y-3">
                {eventStats.eventTypeStats.map((type) => (
                  <div key={type._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type._id}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(type.count / eventStats.overview.totalEvents) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {type.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/admin/events?action=create"
              className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-blue-900">Create New Event</span>
            </Link>
            <Link
              to="/admin/alumni?status=pending_verification"
              className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-blue-900">Review Pending Alumni</span>
            </Link>
            <Link
              to="/admin/news?action=create"
              className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-blue-900">Post News Update</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Batch Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {alumniStats?.batchStats?.length > 0 ? (
              <div className="space-y-2">
                {alumniStats.batchStats.slice(0, 5).map((batch) => (
                  <div key={batch._id} className="flex justify-between text-sm">
                    <span className="font-medium text-green-900">{batch._id}</span>
                    <span className="text-green-700">{batch.count} alumni</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-900">Active Alumni</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {alumniStats?.overview?.activeAlumni || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-900">Draft Events</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {eventStats?.overview?.draftEvents || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-900">Featured Events</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {eventStats?.overview?.featuredEvents || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;