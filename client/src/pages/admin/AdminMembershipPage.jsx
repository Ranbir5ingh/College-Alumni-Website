import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, ChevronLeft, ChevronRight, Eye, Download, Loader, AlertCircle 
} from 'lucide-react';
import { 
  getAllMembershipPurchases, 
  getMembershipPurchaseById,
  getMembershipStatistics,
  clearSelectedPurchase
} from '@/store/admin/membership-slice';

const AdminMembershipPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  const { 
    loading, 
    purchases, 
    selectedPurchase,
    pagination,
    statistics,
    error 
  } = useSelector(state => state.adminMembership);

  useEffect(() => {
    const filters = {
      page: currentPage,
      limit: 10,
      ...(filterStatus !== 'all' && { status: filterStatus }),
      ...(filterPlan !== 'all' && { planType: filterPlan }),
      ...(searchTerm && { search: searchTerm })
    };
    dispatch(getAllMembershipPurchases(filters));
  }, [dispatch, currentPage, filterStatus, filterPlan, searchTerm]);

  useEffect(() => {
    dispatch(getMembershipStatistics());
  }, [dispatch]);

  const handleViewDetails = (purchaseId) => {
    dispatch(getMembershipPurchaseById(purchaseId));
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    dispatch(clearSelectedPurchase());
  };

  const handleExport = () => {
    const csv = [
      ['Receipt Number', 'Name', 'Email', 'Plan', 'Amount', 'Status', 'Purchase Date'],
      ...purchases.map(m => [
        m.receiptNumber || 'N/A',
        m.alumniId?.firstName + ' ' + m.alumniId?.lastName || 'N/A',
        m.alumniId?.email || 'N/A',
        m.planType,
        m.amount,
        m.status,
        new Date(m.purchaseDate).toLocaleDateString(),
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memberships-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPaymentStatusBadgeColor = (status) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const startIdx = (currentPage - 1) * 10 + 1;
  const endIdx = Math.min(currentPage * 10, totalItems);

  const stats = statistics || {};
  const overallStats = stats.overall || {};
  const activeMemberships = overallStats.activeMemberships || 0;
  const totalRevenue = overallStats.totalRevenue || 0;
  const lifetimeMembers = stats.planStats?.filter(p => p._id === 'lifetime')?.[0]?.count || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Membership Management</h1>
          <p className="text-slate-600 mt-1">Manage all alumni memberships and subscriptions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Memberships</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalItems}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Active Members</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{activeMemberships}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Lifetime Members</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{lifetimeMembers}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, receipt..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Plan Type</label>
              <select
                value={filterPlan}
                onChange={(e) => {
                  setFilterPlan(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Plans</option>
                <option value="monthly">Monthly</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Memberships Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          {!loading && purchases.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-500">
              No memberships found matching your filters.
            </div>
          )}

          {!loading && purchases.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Receipt</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Member Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Plan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {purchases.map((membership) => (
                      <tr key={membership._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                          {membership.receiptNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          {membership.alumniId?.firstName} {membership.alumniId?.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {membership.alumniId?.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="capitalize font-medium text-slate-900">{membership.planType}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{membership.amount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(membership.status)}`}>
                            {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeColor(membership.paymentStatus)}`}>
                            {membership.paymentStatus.charAt(0).toUpperCase() + membership.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(membership.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetails(membership._id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {startIdx} to {endIdx} of {totalItems} memberships
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        disabled={loading}
                        className={`w-8 h-8 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Membership Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="p-8">
                {/* Member Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Member Information</h3>
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 rounded-lg p-6">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Full Name</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {selectedPurchase.alumniId?.firstName} {selectedPurchase.alumniId?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Email Address</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">{selectedPurchase.alumniId?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Enrollment Number</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {selectedPurchase.alumniId?.enrollmentNumber || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Receipt Number</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1 font-mono">
                        {selectedPurchase.receiptNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membership Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Membership Details</h3>
                  <div className="grid grid-cols-2 gap-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Plan Type</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1 capitalize">{selectedPurchase.planType} Plan</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Amount</p>
                      <p className="text-lg text-blue-600 font-bold mt-1">₹{selectedPurchase.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Status</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(selectedPurchase.status)}`}>
                          {selectedPurchase.status.charAt(0).toUpperCase() + selectedPurchase.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Payment Status</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusBadgeColor(selectedPurchase.paymentStatus)}`}>
                          {selectedPurchase.paymentStatus.charAt(0).toUpperCase() + selectedPurchase.paymentStatus.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Timeline</h3>
                  <div className="grid grid-cols-2 gap-6 bg-green-50 rounded-lg p-6 border border-green-200">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Purchase Date</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {new Date(selectedPurchase.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Start Date</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {new Date(selectedPurchase.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Expiry Date</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {new Date(selectedPurchase.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Duration</p>
                      <p className="text-lg text-slate-900 font-semibold mt-1">
                        {selectedPurchase.planType === 'lifetime' ? 'Lifetime' : '1 Month'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Information</h3>
                  <div className="space-y-4 bg-slate-50 rounded-lg p-6">
                    <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                      <p className="text-slate-600 font-medium">Transaction ID</p>
                      <p className="text-slate-900 font-mono text-right">{selectedPurchase.transactionId}</p>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                      <p className="text-slate-600 font-medium">Razorpay Order ID</p>
                      <p className="text-slate-900 font-mono text-right">{selectedPurchase.razorpayOrderId}</p>
                    </div>
                    <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                      <p className="text-slate-600 font-medium">Razorpay Payment ID</p>
                      <p className="text-slate-900 font-mono text-right">{selectedPurchase.razorpayPaymentId}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-slate-600 font-medium">Payment Method</p>
                      <p className="text-slate-900 font-semibold capitalize">{selectedPurchase.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedPurchase.notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Notes</h3>
                    <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                      <p className="text-slate-900">{selectedPurchase.notes}</p>
                    </div>
                  </div>
                )}

                {/* Refund Information */}
                {selectedPurchase.refundedAt && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Refund Information</h3>
                    <div className="grid grid-cols-2 gap-6 bg-red-50 rounded-lg p-6 border border-red-200">
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Refund Date</p>
                        <p className="text-lg text-slate-900 font-semibold mt-1">
                          {new Date(selectedPurchase.refundedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Refund Amount</p>
                        <p className="text-lg text-red-600 font-bold mt-1">₹{selectedPurchase.refundAmount || selectedPurchase.amount}</p>
                      </div>
                      {selectedPurchase.refundReason && (
                        <div className="col-span-2">
                          <p className="text-sm text-slate-600 font-medium">Reason</p>
                          <p className="text-slate-900 mt-1">{selectedPurchase.refundReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembershipPage;