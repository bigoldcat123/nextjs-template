import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Suspense } from "react";
import PaginationBarSkeleton from "./pagination-bar-skeleton";

type PaginationBarProps = {
  pageInfo: Promise<{
    totalPages: number;
    total: number;
  }>;
  page: number;
  pageSize: number;
};

export async function PaginationBar({
  pageInfo,
  page,
  pageSize,
}: PaginationBarProps) {
  const { totalPages } = await pageInfo;
  if (totalPages <= 1) return null;

  return (
    <Suspense fallback={<PaginationBarSkeleton />}>
      <div className="flex items-center justify-between">
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${page - 1}&pageSize=${pageSize}`}
                />
              </PaginationItem>
            )}

            {page > 2 && (
              <>
                <PaginationItem>
                  <PaginationLink href={`?page=1&pageSize=${pageSize}`}>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationLink
                href={`?page=${page}&pageSize=${pageSize}`}
                isActive
              >
                {page}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages - 1 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href={`?page=${totalPages}&pageSize=${pageSize}`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`?page=${page + 1}&pageSize=${pageSize}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </Suspense>
  );
}
