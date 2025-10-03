import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Reusable component for displaying and controlling pagination in data tables.
 * Assumes the use of Shadcn/UI Button component.
 * * @param {object} props
 * @param {number} props.currentPage The current active page number (1-indexed).
 * @param {number} props.totalPages The total number of pages available.
 * @param {(page: number) => void} props.onPageChange Function to call when a new page is selected.
 */
function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  // Determine the pages to display in the control group
  const maxPagesToShow = 5;
  const pageNumbers = [];

  // Always include the first page
  if (totalPages > 0) {
    pageNumbers.push(1);
  }

  // Determine the range of pages around the current page
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  // Add ellipsis if the start is far from the first page
  if (start > 2) {
    pageNumbers.push('...');
  }

  // Add pages in the calculated range
  for (let i = start; i <= end; i++) {
    if (!pageNumbers.includes(i)) {
      pageNumbers.push(i);
    }
  }

  // Add ellipsis if the end is far from the last page
  if (end < totalPages - 1) {
    pageNumbers.push('...');
  }
  
  // Always include the last page, if it's not already the first page
  if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
    pageNumbers.push(totalPages);
  }

  // Filter out duplicate page numbers in case of small totalPages value
  const uniquePageNumbers = [...new Set(pageNumbers)];

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Go to previous page</span>
      </Button>

      {/* Page Number Buttons */}
      <nav aria-label="Pagination" className="flex items-center space-x-1">
        {uniquePageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={index} className="px-2 py-1 text-sm text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = Number(page);
          const isActive = pageNum === currentPage;
          
          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={isActive ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-100"}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </Button>
          );
        })}
      </nav>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Go to next page</span>
      </Button>
    </div>
  );
}

export default PaginationControls;
