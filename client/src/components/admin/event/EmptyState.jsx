import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function EmptyState({ onCreateEvent }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Calendar size={48} className="text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No events found</p>
        <Button onClick={onCreateEvent} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          Create Your First Event
        </Button>
      </CardContent>
    </Card>
  );
}

export default EmptyState;