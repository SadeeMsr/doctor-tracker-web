import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/format';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Plural noun for the summary: "1–10 of 132 doctors". */
  noun: string;
}

/**
 * Range summary plus previous/next.
 * @example <Pagination {...meta} noun="doctors" onPageChange={setPage} />
 */
export function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  noun,
}: PaginationProps) {
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <span className="font-medium text-foreground tabular-nums">
          {formatNumber(first)}–{formatNumber(last)}
        </span>{' '}
        of {formatNumber(total)} {noun}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft aria-hidden />
          Previous
        </Button>
        <span className="px-2 text-sm text-muted-foreground tabular-nums">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
