'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { ScrollArea } from './scroll-area';

const backdropClass = [
  'fixed inset-0 z-40 bg-brand-strong/45 backdrop-blur-sm transition-opacity duration-200',
  'data-starting-style:opacity-0 data-ending-style:opacity-0',
].join(' ');

/** A bottom sheet on phones (thumb reach), a centred card from `sm` up. */
const popupStyles = tv({
  base: [
    'fixed z-50 flex flex-col overflow-hidden bg-surface text-foreground outline-none',
    'shadow-[0_32px_80px_-24px_rgb(1_39_34/0.45)] ring-1 ring-brand-ink/10',
    'inset-x-0 bottom-0 max-h-[94dvh] rounded-t-[1.75rem]',
    'sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[min(90dvh,48rem)]',
    'sm:w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem]',
    'transition-[opacity,scale,translate] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]',
    'data-ending-style:opacity-0 data-starting-style:opacity-0',
    'max-sm:data-ending-style:translate-y-12 max-sm:data-starting-style:translate-y-12',
    'sm:data-ending-style:scale-[0.96] sm:data-starting-style:scale-[0.96]',
  ],
  variants: { size: { sm: 'sm:max-w-md', md: 'sm:max-w-2xl' } },
  defaultVariants: { size: 'md' },
});

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Shown beside the title: a `DialogIcon` or an avatar. */
  media?: ReactNode;
  size?: 'sm' | 'md';
  children: ReactNode;
}

/**
 * Lime tile for a dialog header icon.
 * @example <DialogIcon><UserPlus /></DialogIcon>
 */
export function DialogIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground [&_svg]:size-5">
      {children}
    </span>
  );
}

function DialogHeader({
  title,
  description,
  media,
}: Omit<DialogProps, 'open' | 'onOpenChange' | 'children'>) {
  return (
    <header className="relative isolate flex shrink-0 items-center gap-4 bg-brand px-6 pt-8 pb-7 text-brand-foreground sm:px-8">
      <div className="absolute inset-0 -z-10 ecg-grid" aria-hidden />
      {/* Grab handle: tells phone users the sheet can be dismissed. */}
      <span
        className="absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-brand-foreground/25 sm:hidden"
        aria-hidden
      />
      {media}
      <div className="min-w-0 flex-1">
        <BaseDialog.Title className="text-xl font-semibold tracking-tight">
          {title}
        </BaseDialog.Title>
        {description && (
          <BaseDialog.Description className="mt-0.5 truncate text-sm text-brand-muted">
            {description}
          </BaseDialog.Description>
        )}
      </div>
      <BaseDialog.Close
        aria-label="Close"
        className="grid size-9 shrink-0 place-items-center self-start rounded-full text-brand-muted transition-colors hover:bg-brand-foreground/10 hover:text-brand-foreground"
      >
        <X className="size-4" aria-hidden />
      </BaseDialog.Close>
    </header>
  );
}

/**
 * Modal with a branded header. Compose the inside with `DialogBody` and `DialogFooter`; for a
 * form, make the `<form>` the flex column: `className="flex min-h-0 flex-1 flex-col"`.
 * The content unmounts when closed, so each opening starts from a clean state.
 * @example <Dialog open={open} onOpenChange={setOpen} title="Add doctor"><DialogBody>…</DialogBody></Dialog>
 */
export function Dialog({ open, onOpenChange, size, children, ...header }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropClass} />
        <BaseDialog.Popup className={popupStyles({ size })}>
          <DialogHeader {...header} />
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/** The scrolling middle of a dialog. */
export function DialogBody({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <ScrollArea
      className="flex-1"
      contentClassName={cn('space-y-9 px-6 pt-8 pb-6 sm:px-8', className)}
    >
      {children}
    </ScrollArea>
  );
}

/** The fixed bottom of a dialog, for its actions. */
export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="shrink-0 space-y-3 border-t bg-canvas-soft/70 px-6 py-5 max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
      {children}
    </footer>
  );
}

interface AlertDialogProps extends Omit<DialogProps, 'size'> {
  /** e.g. a warning icon tile. */
  media?: ReactNode;
}

function AlertDialogHeading({
  title,
  description,
  media,
}: Pick<AlertDialogProps, 'title' | 'description' | 'media'>) {
  return (
    <div className="flex items-start gap-4">
      {media}
      <div className="min-w-0 space-y-1.5 pt-0.5">
        <BaseAlertDialog.Title className="text-lg font-semibold tracking-tight">
          {title}
        </BaseAlertDialog.Title>
        {description && (
          <BaseAlertDialog.Description className="text-sm text-muted-foreground">
            {description}
          </BaseAlertDialog.Description>
        )}
      </div>
    </div>
  );
}

/**
 * Blocking confirmation (role `alertdialog`): no outside-click dismissal.
 * @example <AlertDialog open={open} onOpenChange={setOpen} title="Delete?">{actions}</AlertDialog>
 */
export function AlertDialog({ open, onOpenChange, children, ...heading }: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={backdropClass} />
        <BaseAlertDialog.Popup className={popupStyles({ size: 'sm', className: 'p-6' })}>
          <AlertDialogHeading {...heading} />
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
