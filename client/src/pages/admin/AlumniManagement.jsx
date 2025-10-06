import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { 
  getAllAlumni, 
  verifyAlumni, 
  rejectAlumni, 
  deleteAlumni,
  exportAlumniData,
  clearError
} from "@/store/admin/alumni-slice";
import { 
  Users, 
  Loader2, 
  Check, 
  X, 
  Trash2, 
  FileDown, 
  Search,
  Filter,
  Eye,
  UserCheck,
  Clock,
  XCircle,
  BarChart3
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const statusColors = {
  'verified': 'bg-green-100 text-green-800',
  'pending_verification': 'bg-yellow-100 text-yellow-800',
  'incomplete_profile': 'bg-blue-100 text-blue-800',
  'rejected': 'bg-red-100 text-red-800',
};

const getStatusBadge = (status) => {
  const className = `px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`;
  const label = status.replace(/_/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  return <span className={className}>{label}</span>;
};

function AlumniManagement() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { 
    alumniList, 
    pagination, 
    isLoading, 
    error 
  } = useSelector((state) => state.adminAlumni);
  
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('accountStatus') || 'all');
  const [batchFilter, setBatchFilter] = useState(searchParams.get('batch') || 'all');
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [alumniToReject, setAlumniToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 10;

  const availableStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending_verification', label: 'Pending Verification' },
    { value: 'incomplete_profile', label: 'Incomplete Profile' },
  ];

  const availableBatches = [
    'all', '2025', '2024', '2023', '2022', '2021', '2020'
  ];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: limit,
      search: searchParams.get('search') || undefined,
      accountStatus: searchParams.get('accountStatus') === 'all' ? undefined : searchParams.get('accountStatus'),
      batch: searchParams.get('batch') === 'all' ? undefined : searchParams.get('batch'),
    };
    
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
    dispatch(getAllAlumni(params));
  }, [dispatch, searchParams, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (localSearch) {
      newParams.set('search', localSearch);
    } else {
      newParams.delete('search');
    }
    
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    newParams.set('page', 1);
    setSearchParams(newParams);
  };
  
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  const handleVerify = (id) => {
    if (window.confirm("Are you sure you want to verify this alumni?")) {
      dispatch(verifyAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success("Alumni account verified successfully");
          const params = Object.fromEntries(searchParams.entries());
          dispatch(getAllAlumni(params));
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this alumni? This action cannot be undone.")) {
      dispatch(deleteAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success("Alumni account deleted successfully");
        }
      });
    }
  };
  
  const openRejectModal = (alumni) => {
    setAlumniToReject(alumni);
    setIsRejectModalOpen(true);
    setRejectionReason('');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    
    dispatch(rejectAlumni({ id: alumniToReject._id, reason: rejectionReason })).then(result => {
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Alumni account rejected");
        setIsRejectModalOpen(false);
        setAlumniToReject(null);
      }
    });
  };

  const handleExport = () => {
    const params = {
      accountStatus: statusFilter === 'all' ? undefined : statusFilter,
    };
    
    dispatch(exportAlumniData(params)).then(result => {
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success("Alumni data exported successfully");
      }
    });
  };

  // Quick stats
  const pendingCount = alumniList.filter(a => a.accountStatus === 'pending_verification').length;
  const verifiedCount = alumniList.filter(a => a.accountStatus === 'verified').length;

  if (isLoading && alumniList.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Alumni Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and verify alumni accounts</p>
        </div>
        <Button onClick={handleExport} className="gap-2 bg-green-600 hover:bg-green-700">
          <FileDown size={18} />
          Export Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalAlumni || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="text-green-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{currentPage}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <Alert className="border-yellow-400 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{pendingCount}</strong> alumni applications awaiting verification.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form onSubmit={handleSearchSubmit} className="col-span-1 md:col-span-1 flex gap-2">
              <Input
                placeholder="Search by name, email..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                handleFilterChange('accountStatus', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={batchFilter} 
              onValueChange={(value) => {
                setBatchFilter(value);
                handleFilterChange('batch', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {availableBatches.filter(b => b !== 'all').map(batch => (
                  <SelectItem key={batch} value={batch}>
                    Batch {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni List</CardTitle>
        </CardHeader>
        <CardContent>
          {alumniList.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alumniList.map((alumni) => (
                      <TableRow key={alumni._id}>
                        <TableCell className="font-medium">
                          {alumni.alumniId || alumni.enrollmentNumber}
                        </TableCell>
                        <TableCell>
                          {alumni.firstName} {alumni.lastName}
                        </TableCell>
                        <TableCell>{alumni.email}</TableCell>
                        <TableCell>{alumni.batch}</TableCell>
                        <TableCell>{alumni.department}</TableCell>
                        <TableCell>
                          {getStatusBadge(alumni.accountStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/alumni/${alumni._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {alumni.accountStatus === 'pending_verification' ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerify(alumni._id)}
                                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                  disabled={isLoading}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openRejectModal(alumni)}
                                  className="text-red-600 hover:bg-red-50"
                                  disabled={isLoading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(alumni._id)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.totalAlumni)} of {pagination.totalAlumni}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNum > pagination.totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No alumni found matching the current criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="text-red-600" />
              Reject Alumni Verification
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                This will permanently reject and delete the account for <strong>{alumniToReject?.firstName} {alumniToReject?.lastName}</strong>.
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="Enter reason for rejection (required)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={isLoading || !rejectionReason.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Confirm Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AlumniManagement;