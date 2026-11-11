'use client';

import { useState } from 'react';

/**
 * Open/closed state for a dialog about one item. The item is kept after closing, so the
 * dialog's content doesn't blank out during its exit animation.
 */
export function useDisclosure<TItem>() {
  const [state, setState] = useState<{ isOpen: boolean; item: TItem | null }>({
    isOpen: false,
    item: null,
  });

  return {
    isOpen: state.isOpen,
    item: state.item,
    show: (item: TItem) => setState({ isOpen: true, item }),
    hide: () => setState((current) => ({ ...current, isOpen: false })),
  };
}
