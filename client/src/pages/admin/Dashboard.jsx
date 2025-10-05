import { useEffect } from "react";
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
  GraduationCap,
  Building2,
  BarChart3
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

  const StatCard = ({ title, value, subtitle, icon: Icon, color, link }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
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

  const verificationRate = alumniStats?.overview?.totalUser > 0
    ? ((alumniStats.overview.verifiedUser / alumniStats.overview.totalUser) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">
          Overview of alumni network and engagement metrics
        </p>
      </div>

      {/* Pending Actions Alert */}
      {alumniStats?.overview?.pendingVerification > 0 && (
        <Alert className="border-yellow-400 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{alumniStats.overview.pendingVerification}</strong> alumni applications awaiting verification.
            <Link to="/admin/alumni?status=pending_verification" className="ml-2 underline font-medium">
              Review applications
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Alumni"
            value={alumniStats?.overview?.totalUser || 0}
            subtitle={`${verificationRate}% verified`}
            icon={Users}
            color="text-blue-600"
            link="/admin/alumni"
          />
          <StatCard
            title="Pending Verification"
            value={alumniStats?.overview?.pendingVerification || 0}
            subtitle="Requires action"
            icon={Clock}
            color="text-yellow-600"
            link="/admin/alumni?status=pending_verification"
          />
          <StatCard
            title="Active Events"
            value={eventStats?.overview?.upcomingEvents || 0}
            subtitle={`${eventStats?.overview?.publishedEvents || 0} total published`}
            icon={Calendar}
            color="text-green-600"
            link="/admin/events"
          />
          <StatCard
            title="Event Registrations"
            value={eventStats?.registrations?.totalRegistrations || 0}
            subtitle={`${eventStats?.registrations?.attendanceRate || '0%'} attendance rate`}
            icon={UserCheck}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Alumni Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="text-blue-600" size={20} />
              Alumni by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alumniStats?.departmentStats?.length > 0 ? (
              <div className="space-y-3">
                {alumniStats.departmentStats.slice(0, 6).map((dept) => (
                  <div key={dept._id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {dept._id || "Not Specified"}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(dept.count / alumniStats.overview.totalUser) * 100}%`,
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
              <p className="text-gray-500 text-sm text-center py-4">No department data available</p>
            )}
          </CardContent>
        </Card>

        {/* Batch Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="text-green-600" size={20} />
              Recent Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alumniStats?.batchStats?.length > 0 ? (
              <div className="space-y-2">
                {alumniStats.batchStats.slice(0, 6).map((batch) => (
                  <div key={batch._id} className="flex justify-between items-center py-1.5">
                    <span className="text-sm font-medium text-gray-700">Batch {batch._id}</span>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {batch.count} alumni
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No batch data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {alumniStats?.overview?.verifiedUser || 0}
              </div>
              <div className="text-xs text-green-600 mt-1">Verified</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {alumniStats?.overview?.pendingVerification || 0}
              </div>
              <div className="text-xs text-yellow-600 mt-1">Pending</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">
                {alumniStats?.overview?.incompleteProfiles || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Incomplete</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {alumniStats?.overview?.alumniWithMembership || 0}
              </div>
              <div className="text-xs text-blue-600 mt-1">Members</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              to="/admin/alumni?status=pending_verification"
              className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Clock className="text-yellow-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Review Applications</div>
                <div className="text-xs text-gray-600">
                  {alumniStats?.overview?.pendingVerification || 0} pending
                </div>
              </div>
            </Link>
            <Link
              to="/admin/events?action=create"
              className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Calendar className="text-blue-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Create Event</div>
                <div className="text-xs text-gray-600">Schedule new event</div>
              </div>
            </Link>
            <Link
              to="/admin/alumni"
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="text-green-600" size={24} />
              <div>
                <div className="font-semibold text-gray-900">Manage Alumni</div>
                <div className="text-xs text-gray-600">
                  {alumniStats?.overview?.totalUser || 0} total alumni
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;