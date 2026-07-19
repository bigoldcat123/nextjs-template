import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationBarProps = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function PaginationBar({ total, page, pageSize, totalPages }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">

      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?page=${page - 1}&pageSize=${pageSize}`} />
            </PaginationItem>
          )}

          {page > 2 && (
            <>
              <PaginationItem>
                <PaginationLink href={`?page=1&pageSize=${pageSize}`}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationLink href={`?page=${page}&pageSize=${pageSize}`} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {page < totalPages - 1 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`?page=${totalPages}&pageSize=${pageSize}`}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={`?page=${page + 1}&pageSize=${pageSize}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
