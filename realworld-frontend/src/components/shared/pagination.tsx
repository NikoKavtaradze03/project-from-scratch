import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const buttonStyle =
  "border-(--color-accent) text-(--color-accent) hover:bg-(--color-accent-hover) hover:text-(--color-text) cursor-pointer";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-6">
      <Button
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        className={buttonStyle}
      >
        Previous
      </Button>

      <span className="text-sm text-(--color-text-muted)">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={buttonStyle}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
