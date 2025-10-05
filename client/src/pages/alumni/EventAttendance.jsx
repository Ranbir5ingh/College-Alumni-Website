// pages/user/EventAttendance.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  verifyAttendanceToken, 
  markAttendanceViaQR,
  clearError,
  clearTokenVerification 
} from '@/store/user/attendance-slice';
import { toast } from 'react-hot-toast';

const EventAttendance = () => {
  const { eventId, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, tokenVerification, attendanceStatus, error } = useSelector(
    (state) => state.userAttendance
  );
  const { user } = useSelector((state) => state.auth);

  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    // Verify token on page load
    if (eventId && token) {
      dispatch(verifyAttendanceToken({ eventId, token }));
    }

    return () => {
      dispatch(clearTokenVerification());
      dispatch(clearError());
    };
  }, [eventId, token, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [error]);

  const handleMarkAttendance = async () => {
    if (!user) {
      toast.error('Please login to mark attendance');
      navigate(`/login?redirect=/events/${eventId}/attendance/${token}`);
      return;
    }

    setIsMarking(true);
    try {
      const result = await dispatch(markAttendanceViaQR({ eventId, token })).unwrap();
      toast.success(result.message || 'Attendance marked successfully!');
      
      // Optionally redirect after success
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'Failed to mark attendance');
    } finally {
      setIsMarking(false);
    }
  };

  if (isLoading && !tokenVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying attendance code...</p>
        </div>
      </div>
    );
  }

  if (error && !tokenVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-red-50 rounded-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Invalid Attendance Code</h2>
            <p className="mt-2 text-gray-600">{error.message}</p>
            <button
              onClick={() => navigate('/events')}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (attendanceStatus?.attended) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Attendance Marked!</h2>
            <p className="mt-2 text-gray-600">Your attendance has been successfully recorded.</p>
            
            {attendanceStatus.registrationNumber && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {attendanceStatus.registrationNumber}
                </p>
              </div>
            )}

            {attendanceStatus.attendanceMarkedAt && (
              <p className="mt-4 text-sm text-gray-500">
                Marked at: {new Date(attendanceStatus.attendanceMarkedAt).toLocaleString()}
              </p>
            )}

            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Event Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">Mark Your Attendance</h2>
          
          {tokenVerification && (
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-700">
                {tokenVerification.eventTitle}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(tokenVerification.startDateTime).toLocaleDateString()} at{' '}
                {new Date(tokenVerification.startDateTime).toLocaleTimeString()}
              </p>
            </div>
          )}

          {!user ? (
            <div className="mt-6">
              <p className="text-gray-600 mb-4">Please login to mark your attendance</p>
              <button
                onClick={() => navigate(`/login?redirect=/events/${eventId}/attendance/${token}`)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login to Mark Attendance
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-gray-600 mb-4">
                Click the button below to confirm your attendance
              </p>
              <button
                onClick={handleMarkAttendance}
                disabled={isMarking}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {isMarking ? 'Marking Attendance...' : 'Mark Attendance'}
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/events')}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventAttendance;