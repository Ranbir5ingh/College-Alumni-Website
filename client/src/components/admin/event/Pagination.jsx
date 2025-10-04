import { Button } from "@/components/ui/button";

function Pagination({ currentPage, totalPages, hasPrevPage, hasNextPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        className="bg-white border hover:bg-gray-50 text-gray-700"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        className="bg-white border hover:bg-gray-50 text-gray-700"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;