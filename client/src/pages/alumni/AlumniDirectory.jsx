import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchAlumniDirectory, getAlumniProfileById } from '@/store/user/alumni-slice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, ChevronLeft, ChevronRight, Building2, Calendar, Briefcase, Linkedin, MapPin, Users, GraduationCap, ArrowLeft } from 'lucide-react';

const DEPARTMENTS = [
  { name: 'Computer Science & Engineering', icon: '💻', color: 'bg-blue-500' },
  { name: 'Electronics & Communication', icon: '⚡', color: 'bg-purple-500' },
  { name: 'Mechanical Engineering', icon: '⚙️', color: 'bg-orange-500' },
  { name: 'Civil Engineering', icon: '🏗️', color: 'bg-green-500' },
  { name: 'Electrical Engineering', icon: '🔌', color: 'bg-yellow-500' },
  { name: 'Management', icon: '📱', color: 'bg-cyan-500' },
];

// Generate batches from 2000 to current year
const BATCHES = Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse();

const AlumniDirectory = () => {
  const dispatch = useDispatch();
  const { alumniDirectory, directoryPagination, isLoading, selectedAlumni } = useSelector(state => state.userAlumni);
  
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (selectedDepartment && selectedBatch) {
      fetchAlumni();
    }
  }, [selectedDepartment, selectedBatch, currentPage, searchQuery]);

  const fetchAlumni = () => {
    const params = {
      page: currentPage,
      limit: 12,
      department: selectedDepartment,
      batch: selectedBatch,
    };
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    dispatch(searchAlumniDirectory(params));
  };

  const handleDepartmentSelect = (deptName) => {
    setSelectedDepartment(deptName);
    setSelectedBatch(null);
    setCurrentPage(1);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
  };

  const handleBack = () => {
    if (selectedBatch) {
      setSelectedBatch(null);
      setSearchQuery('');
    } else if (selectedDepartment) {
      setSelectedDepartment(null);
    }
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAlumni();
  };

  const viewProfile = (id) => {
    dispatch(getAlumniProfileById(id));
    setIsProfileOpen(true);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Department Selection View
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">Alumni Directory</h1>
            <p className="text-lg text-slate-600">Connect with alumni from your department</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept) => (
              <Card
                key={dept.name}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-slate-300"
                onClick={() => handleDepartmentSelect(dept.name)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-16 h-16 ${dept.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                    {dept.icon}
                  </div>
                  <CardTitle className="text-xl">{dept.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4" />
                    Explore alumni network
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Batch Selection View
  if (selectedDepartment && !selectedBatch) {
    const selectedDept = DEPARTMENTS.find(d => d.name === selectedDepartment);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-slate-200"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Departments
          </Button>

          <div className="text-center mb-12">
            <div className={`w-20 h-20 ${selectedDept.color} rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto shadow-lg`}>
              {selectedDept.icon}
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-3">{selectedDept.name}</h1>
            <p className="text-lg text-slate-600">Select your batch year</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BATCHES.map((batch) => (
              <Card
                key={batch}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 border-2"
                onClick={() => handleBatchSelect(batch)}
              >
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-2xl font-bold text-slate-800">{batch}</p>
                  <p className="text-xs text-slate-500 mt-1">Batch</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Alumni List View
  const selectedDept = DEPARTMENTS.find(d => d.name === selectedDepartment);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-slate-200"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Batches
        </Button>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 ${selectedDept.color} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
              {selectedDept.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{selectedDept.name}</h1>
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <GraduationCap className="w-4 h-4" />
                Batch of {selectedBatch}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or alumni ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="pl-10 h-12"
              />
            </div>
            <Button onClick={handleSearch} className="h-12 px-8">
              Search
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-slate-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : alumniDirectory.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Alumni Found</h3>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {alumniDirectory.map((alumni) => (
                <Card
                  key={alumni._id}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-2 hover:border-slate-300"
                >
                  <div className={`h-2 ${selectedDept.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                        <AvatarImage src={alumni.profilePicture} alt={`${alumni.firstName} ${alumni.lastName}`} />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {getInitials(alumni.firstName, alumni.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-800 truncate">
                          {alumni.firstName} {alumni.lastName}
                        </h3>
                        <p className="text-sm text-slate-500">{alumni.alumniId}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {alumni.currentCompany && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{alumni.currentCompany}</span>
                        </div>
                      )}
                      {alumni.currentDesignation && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{alumni.currentDesignation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <GraduationCap className="w-4 h-4 flex-shrink-0" />
                        <span>{alumni.degree} • {alumni.yearOfPassing || alumni.batch}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => viewProfile(alumni._id)}
                      >
                        View Profile
                      </Button>
                      {alumni.linkedInProfile && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(alumni.linkedInProfile, '_blank')}
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {directoryPagination.totalPages > 1 && (
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, directoryPagination.totalUsers)} of {directoryPagination.totalUsers} alumni
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={!directoryPagination.hasPrevPage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {[...Array(directoryPagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === directoryPagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!directoryPagination.hasNextPage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAlumni && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src={selectedAlumni.profilePicture} alt={`${selectedAlumni.firstName} ${selectedAlumni.lastName}`} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getInitials(selectedAlumni.firstName, selectedAlumni.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">
                      {selectedAlumni.firstName} {selectedAlumni.lastName}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedAlumni.alumniId}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedAlumni.bio && (
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">About</h4>
                    <p className="text-slate-600 text-sm">{selectedAlumni.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Education</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        <strong>Degree:</strong> {selectedAlumni.degree}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Department:</strong> {selectedAlumni.department}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Batch:</strong> {selectedAlumni.batch}
                      </p>
                      {selectedAlumni.yearOfPassing && (
                        <p className="text-sm text-slate-600">
                          <strong>Year of Passing:</strong> {selectedAlumni.yearOfPassing}
                        </p>
                      )}
                    </div>
                  </div>

                  {(selectedAlumni.currentCompany || selectedAlumni.currentDesignation || selectedAlumni.industry) && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Professional</h4>
                      <div className="space-y-2">
                        {selectedAlumni.currentCompany && (
                          <p className="text-sm text-slate-600">
                            <strong>Company:</strong> {selectedAlumni.currentCompany}
                          </p>
                        )}
                        {selectedAlumni.currentDesignation && (
                          <p className="text-sm text-slate-600">
                            <strong>Designation:</strong> {selectedAlumni.currentDesignation}
                          </p>
                        )}
                        {selectedAlumni.industry && (
                          <p className="text-sm text-slate-600">
                            <strong>Industry:</strong> {selectedAlumni.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {(selectedAlumni.email || selectedAlumni.phone) && (
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Contact</h4>
                    <div className="space-y-2">
                      {selectedAlumni.email && (
                        <p className="text-sm text-slate-600">
                          <strong>Email:</strong> {selectedAlumni.email}
                        </p>
                      )}
                      {selectedAlumni.phone && (
                        <p className="text-sm text-slate-600">
                          <strong>Phone:</strong> {selectedAlumni.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedAlumni.linkedInProfile && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedAlumni.linkedInProfile, '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    Connect on LinkedIn
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniDirectory;