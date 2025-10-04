import { Download, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function RegistrationsDialog({ event, registrations, isLoading, open, onOpenChange, onExport }) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Registrations - {event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Total: {registrations?.length || 0} registrations</p>
            <Button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => onExport(event._id)}
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading registrations...</div>
          ) : !registrations || registrations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No registrations yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumni</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attended</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td className="px-4 py-3 text-sm">
                        {reg.alumniId?.firstName} {reg.alumniId?.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm">{reg.alumniId?.email}</td>
                      <td className="px-4 py-3 text-sm">{reg.alumniId?.batch}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reg.status === "confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {reg.attended ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <XCircle className="text-gray-400" size={20} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegistrationsDialog;