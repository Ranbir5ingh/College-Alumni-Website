// src/pages/Admin/AlumniManagement.jsx

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { 
  getAllAlumni, 
  verifyAlumni, 
  rejectAlumni, 
  deleteAlumni,
  exportAlumniData,
  clearError
} from "@/store/admin/alumni-slice"; // Your slice
import { 
  Users, 
  Loader2, 
  Check, 
  X, 
  Trash2, 
  FileDown, 
  Search,
  Filter
} from "lucide-react";

// Assuming these are your Shadcn/UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

import PaginationControls from "@/components/common/PaginationControls"; // Assuming you have a reusable Pagination component
import { toast } from "sonner";

// --- Helper Functions ---

const statusColors = {
  'verified': 'bg-green-100 text-green-800',
  'pending_verification': 'bg-yellow-100 text-yellow-800',
  'incomplete_profile': 'bg-blue-100 text-blue-800',
  'rejected': 'bg-red-100 text-red-800',
};

const getStatusBadge = (status) => {
  const className = `px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'} capitalize`;
  return <span className={className}>{status.replace('_', ' ')}</span>;
};

// --- AlumniManagement Component ---

function AlumniManagement() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Redux State
  const { 
    alumniList, 
    pagination, 
    isLoading, 
    error 
  } = useSelector((state) => state.adminAlumni);
  
  // Local State for Search & Filter
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('accountStatus') || '');
  const [batchFilter, setBatchFilter] = useState(searchParams.get('batch') || '');
  
  // State for Rejection Modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [alumniToReject, setAlumniToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Pagination from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 10; // Hardcoded limit as per controller

  // Available Filter Options (Hardcoded for this example, should come from API or Config)
  const availableStatuses = [
    'all', 
    'verified', 
    'pending_verification', 
    'incomplete_profile', 
    'rejected'
  ];
  // Example batches (replace with actual data)
  const availableBatches = [
    'all', 
    '2025', 
    '2024', 
    '2023', 
    '2022'
  ]; 

  // --- Effects ---

  // Handle Redux Errors
  useEffect(() => {
    if (error) {
    //   toast({
    //     title: "Error",
    //     description: error.message || "An unknown error occurred.",
    //     variant: "destructive",
    //   });
      dispatch(clearError());
    }
  }, [error, dispatch, toast]);

  // Fetch alumni data on page/filter change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: limit,
      search: searchParams.get('search') || undefined,
      accountStatus: searchParams.get('accountStatus') === 'all' ? undefined : searchParams.get('accountStatus'),
      batch: searchParams.get('batch') === 'all' ? undefined : searchParams.get('batch'),
    };
    
    // Clean up undefined values before fetching
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    dispatch(getAllAlumni(params));
  }, [dispatch, searchParams, currentPage, limit]);


  // --- Event Handlers ---

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    // Set or delete search param
    if (localSearch) {
      newParams.set('search', localSearch);
    } else {
      newParams.delete('search');
    }
    
    // Reset to page 1 for new search
    newParams.set('page', 1); 
    setSearchParams(newParams);
  };

  // Handle Filter Change
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Reset to page 1 for new filter
    newParams.set('page', 1);
    setSearchParams(newParams);
  };
  
  // Handle Page Change
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  // Handle Alumni Actions
  const handleVerify = (id) => {
    if (window.confirm("Are you sure you want to VERIFY this alumni?")) {
      dispatch(verifyAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
        //   toast({ title: "Verification Success", description: "Alumni account verified." });
          // Re-fetch data to update the table
          const params = Object.fromEntries(searchParams.entries());
          dispatch(getAllAlumni(params));
        }
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to DELETE this alumni? This action cannot be undone.")) {
      dispatch(deleteAlumni(id)).then(result => {
        if (result.meta.requestStatus === 'fulfilled') {
        //   toast({ title: "Deletion Success", description: "Alumni account permanently deleted." });
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
    //   toast({ title: "Validation Error", description: "Rejection reason is required.", variant: "destructive" });
      return;
    }
    
    dispatch(rejectAlumni({ id: alumniToReject._id, reason: rejectionReason })).then(result => {
      if (result.meta.requestStatus === 'fulfilled') {
        // toast({ title: "Rejection Success", description: "Alumni account rejected and deleted." });
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
        // toast({ 
        //     title: "Export Success", 
        //     description: "Alumni data is ready for download (check API response).",
        //     variant: "default"
        // });
        // In a real app, you'd handle the file download here based on the API response.
      } else {
        // toast({ title: "Export Failed", description: "Could not export alumni data.", variant: "destructive" });
      }
    });
  };

  // --- Loading State ---
  if (isLoading && alumniList.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600" />
          Alumni Management
        </h1>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <FileDown className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <hr className="my-4" />

      {/* Search and Filter */}
      <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-gray-500"/> Filter & Search</CardTitle>
            <CardDescription>Narrow down the list of alumni.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="col-span-1 md:col-span-2 lg:col-span-2 flex gap-2">
                <Input
                    placeholder="Search by Name, Email, or Enrollment No."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full"
                />
                <Button type="submit">
                    <Search className="h-4 w-4" />
                </Button>
            </form>

            {/* Status Filter */}
            <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                    setStatusFilter(value);
                    handleFilterChange('accountStatus', value);
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {availableStatuses.filter(s => s !== 'all').map(status => (
                        <SelectItem key={status} value={status}>
                            {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            {/* Batch Filter (Example) */}
            <Select 
                value={batchFilter} 
                onValueChange={(value) => {
                    setBatchFilter(value);
                    handleFilterChange('batch', value);
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by Batch" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {availableBatches.filter(b => b !== 'all').map(batch => (
                        <SelectItem key={batch} value={batch}>
                            Batch of {batch}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </CardContent>
      </Card>
      
      <hr className="my-4" />

      {/* Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni List ({pagination.totalAlumni} Total)</CardTitle>
          <CardDescription>Manage and review all registered alumni accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {alumniList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumni ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Batch/Dept</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alumniList.map((alumni) => (
                    <TableRow key={alumni._id}>
                      <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">
                        <Link to={`/admin/alumni/${alumni._id}`}>
                            {alumni.alumniId || alumni.enrollmentNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{alumni.firstName} {alumni.lastName}</TableCell>
                      <TableCell>{alumni.email}</TableCell>
                      <TableCell>{alumni.batch} - {alumni.department}</TableCell>
                      <TableCell>
                        {getStatusBadge(alumni.accountStatus)}
                      </TableCell>
                      <TableCell className="space-x-2 w-[200px]">
                        {alumni.accountStatus === 'pending_verification' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(alumni._id)}
                              className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4 mr-1" /> Verify
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openRejectModal(alumni)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(alumni._id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
                No alumni found matching the current criteria.
            </p>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Alumni Verification</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>You are about to permanently reject and **delete** the account for <strong>{alumniToReject?.firstName} {alumniToReject?.lastName}</strong>.</p>
            <Textarea
              placeholder="Enter reason for rejection (e.g., mismatching enrollment data)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading || !rejectionReason.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AlumniManagement;