'use client';

import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

const backdropClass = [
  'fixed inset-0 z-40 bg-brand-strong/50 backdrop-blur-[2px] transition-opacity duration-200',
  'data-starting-style:opacity-0 data-ending-style:opacity-0',
].join(' ');

/** A bottom sheet on phones (thumb reach), a centred card from `sm` up. */
const popupStyles = tv({
  base: [
    'fixed z-50 flex flex-col bg-surface text-foreground shadow-2xl outline-none',
    'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[1.75rem]',
    'sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[min(88dvh,46rem)]',
    'sm:w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem]',
    'transition-[opacity,scale,translate] duration-200 ease-out',
    'data-ending-style:opacity-0 data-starting-style:opacity-0',
    'max-sm:data-ending-style:translate-y-10 max-sm:data-starting-style:translate-y-10',
    'sm:data-ending-style:scale-[0.97] sm:data-starting-style:scale-[0.97]',
  ],
  variants: { size: { sm: 'sm:max-w-md', md: 'sm:max-w-xl' } },
  defaultVariants: { size: 'md' },
});

const titleClass = 'text-xl font-semibold tracking-tight';
const descriptionClass = 'mt-1 text-sm text-muted-foreground';
const closeClass =
  'grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md';
  children: ReactNode;
}

function DialogHeader({ title, description }: Pick<DialogProps, 'title' | 'description'>) {
  return (
    <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
      <div className="min-w-0">
        <BaseDialog.Title className={titleClass}>{title}</BaseDialog.Title>
        {description && (
          <BaseDialog.Description className={descriptionClass}>
            {description}
          </BaseDialog.Description>
        )}
      </div>
      <BaseDialog.Close aria-label="Close" className={closeClass}>
        <X className="size-4" aria-hidden />
      </BaseDialog.Close>
    </header>
  );
}

/**
 * Modal for forms. The body unmounts when closed, so each opening starts from a clean state.
 * @example <Dialog open={open} onOpenChange={setOpen} title="Add doctor">…</Dialog>
 */
export function Dialog({ open, onOpenChange, title, description, size, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropClass} />
        <BaseDialog.Popup className={popupStyles({ size })}>
          <DialogHeader title={title} description={description} />
          {/* Inset on the right and bottom so the scrollbar clears the rounded corners. */}
          <div className="mr-1.5 mb-4 scrollbar-subtle overflow-y-auto overscroll-contain pr-4.5 pl-6">
            {children}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

/**
 * Blocking confirmation (role `alertdialog`): no outside-click dismissal.
 * @example <AlertDialog open={open} onOpenChange={setOpen} title="Delete?">{actions}</AlertDialog>
 */
export function AlertDialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={backdropClass} />
        <BaseAlertDialog.Popup className={popupStyles({ size: 'sm', className: 'gap-2 p-6' })}>
          <BaseAlertDialog.Title className={titleClass}>{title}</BaseAlertDialog.Title>
          {description && (
            <BaseAlertDialog.Description className={descriptionClass}>
              {description}
            </BaseAlertDialog.Description>
          )}
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
