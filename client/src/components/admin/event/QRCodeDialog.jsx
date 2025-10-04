import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function QRCodeDialog({ event, qrCodeData, open, onOpenChange }) {
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    if (open && qrCodeData) {
      // Add a small delay to ensure canvas is mounted
      setTimeout(() => {
        if (qrCanvasRef.current) {
          QRCode.toCanvas(
            qrCanvasRef.current,
            qrCodeData.qrData,
            { width: 300, margin: 2 },
            (error) => {
              if (error) console.error("QR Code generation error:", error);
            }
          );
        }
      }, 100);
    }
  }, [open, qrCodeData]);

  const handleDownload = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${event?.title.replace(/\s+/g, '_')}_QR.png`;
      link.href = url;
      link.click();
    }
  };

  if (!event || !qrCodeData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Attendance QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to mark attendance for {event.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center items-center p-6 bg-white rounded-lg border-2 border-gray-200">
            <canvas ref={qrCanvasRef} />
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Generated:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium">{new Date(qrCodeData.expiresAt).toLocaleString()}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-md mt-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This QR code will expire in 60 minutes. Alumni can scan this code to mark their attendance.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download QR Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default QRCodeDialog;