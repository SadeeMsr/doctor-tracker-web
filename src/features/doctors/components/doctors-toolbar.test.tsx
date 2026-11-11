import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UrlUpdateEvent } from 'nuqs/adapters/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { json, mockApi } from '@/test/fetch';
import { renderWithProviders } from '@/test/render';

import { useDoctorFilters } from '../hooks/use-doctor-filters';

import { DoctorsToolbar } from './doctors-toolbar';

/** The toolbar exactly as the page wires it: filter state comes from the URL hook. */
function Toolbar() {
  return <DoctorsToolbar state={useDoctorFilters()} />;
}

function renderToolbar(searchParams = '') {
  const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
  renderWithProviders(<Toolbar />, { searchParams, onUrlUpdate });
  const lastQuery = () => onUrlUpdate.mock.calls.at(-1)?.[0].queryString ?? '';
  return { onUrlUpdate, lastQuery, user: userEvent.setup() };
}

describe('DoctorsToolbar', () => {
  beforeEach(() => {
    mockApi({
      'GET /api/v1/doctors/hospitals': () =>
        json(200, { data: ['Square Hospital, Dhaka', 'United Hospital'] }),
    });
  });

  it('ticks several specializations into the URL and resets to page 1', async () => {
    const { user, lastQuery } = renderToolbar('?page=3');

    await user.click(screen.getByRole('button', { name: 'Specialization' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Cardiology' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Oncology' }));

    expect(decodeURIComponent(lastQuery())).toContain('specialization=Cardiology,Oncology');
    expect(lastQuery()).not.toContain('page=3');
    expect(screen.getByRole('button', { name: 'Specialization · 2' })).toBeInTheDocument();
  });

  it('keeps hospital names with commas intact', async () => {
    const { user, lastQuery } = renderToolbar();

    await user.click(screen.getByRole('button', { name: 'Hospital' }));
    await user.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Square Hospital, Dhaka' }),
    );
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'United Hospital' }));

    expect(new URLSearchParams(lastQuery()).get('hospital')).toBe(
      'Square Hospital, Dhaka|United Hospital',
    );
  });

  it('clears every filter at once, and counts what is active', async () => {
    const { user, lastQuery } = renderToolbar('?specialization=Cardiology,Oncology&q=ay');

    const clearAll = screen.getByRole('button', { name: /clear all 3 filters/i });
    await user.click(clearAll);

    expect(lastQuery()).toBe('');
  });

  it('shows no Clear all button when nothing is filtered', () => {
    renderToolbar();

    expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument();
  });
});
