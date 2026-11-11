'use client';

import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { AlertDialog } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  /** When set, the action is unavailable and this explains why instead. */
  blocker?: ReactNode;
}

/**
 * Names the item and asks before a destructive action.
 * @example <ConfirmDialog open={open} onOpenChange={setOpen} title="Delete Ana?" description="…" confirmLabel="Delete" onConfirm={remove} />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  blocker,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      media={
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger">
          <TriangleAlert className="size-5" aria-hidden />
        </span>
      }
    >
      {blocker}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
          {blocker ? 'Close' : 'Cancel'}
        </Button>
        {!blocker && (
          <Button variant="danger" onClick={onConfirm} disabled={isPending}>
            {isPending && <Spinner label="Working" />}
            {confirmLabel}
          </Button>
        )}
      </div>
    </AlertDialog>
  );
}
