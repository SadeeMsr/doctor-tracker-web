import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FormActions } from './form-actions';

describe('FormActions', () => {
  const base = { isPending: false, submitLabel: 'Add patient', onCancel: () => undefined };

  it('offers "Save & add another" and shows progress after each save', async () => {
    const onSecondary = vi.fn();
    render(
      <FormActions
        {...base}
        secondaryLabel="Save & add another"
        onSecondary={onSecondary}
        note="2 patients added so far."
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save & add another' }));

    expect(onSecondary).toHaveBeenCalledOnce();
    expect(screen.getByText('2 patients added so far.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
  });

  it('disables every button while saving, so a submit can never double-fire', () => {
    render(
      <FormActions {...base} isPending secondaryLabel="Save & add another" onSecondary={vi.fn()} />,
    );

    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  });

  it('shows a form-level error as an alert', () => {
    render(<FormActions {...base} error="The server is unreachable." />);

    expect(screen.getByRole('alert')).toHaveTextContent('The server is unreachable.');
  });
});
