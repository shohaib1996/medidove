import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type GlobalPaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  className?: string;
};

const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const keep = new Set<number>([
    1,
    2,
    totalPages - 1,
    totalPages,
    page - 1,
    page,
    page + 1,
  ]);
  const sorted = [...keep]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const withEllipsis: (number | "ellipsis")[] = [];
  let previous = 0;

  for (const value of sorted) {
    if (previous && value - previous > 1) {
      withEllipsis.push("ellipsis");
    }
    withEllipsis.push(value);
    previous = value;
  }

  return withEllipsis;
};

const GlobalPagination = ({
  page,
  totalPages,
  buildHref,
  className,
}: GlobalPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(page, totalPages);
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <Pagination className={cn("mt-10", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(Math.max(1, page - 1))}
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            className={isFirstPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pageNumbers.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href={buildHref(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={buildHref(Math.min(totalPages, page + 1))}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={isLastPage ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GlobalPagination;
