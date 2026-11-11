import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ClearFiltersButton } from './clear-filters-button';

describe('ClearFiltersButton', () => {
  it('hides with no active filters, and clears all of them in one click', async () => {
    const onClear = vi.fn();
    const { rerender } = render(<ClearFiltersButton count={0} onClear={onClear} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<ClearFiltersButton count={3} onClear={onClear} />);
    const button = screen.getByRole('button', { name: /clear all 3 filters/i });
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Shift+X');
    await userEvent.click(button);

    expect(onClear).toHaveBeenCalledOnce();
  });
});
