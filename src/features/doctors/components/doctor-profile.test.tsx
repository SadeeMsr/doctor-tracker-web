import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { json, mockApi } from '@/test/fetch';
import { renderWithProviders } from '@/test/render';

import { DoctorProfile } from './doctor-profile';

describe('DoctorProfile', () => {
  it('keeps the back link in place while loading, so the banner never shifts down', () => {
    // A request that never answers keeps the component in its loading state.
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => undefined)),
    );
    renderWithProviders(<DoctorProfile id="d1" />);

    expect(screen.getByRole('link', { name: 'All doctors' })).toHaveAttribute('href', '/doctors');
    expect(screen.getByRole('status', { name: 'Loading doctor' })).toBeInTheDocument();
  });

  it('shows the doctor under the same back link once loaded', async () => {
    mockApi({
      'GET /api/v1/doctors/d1': () =>
        json(200, {
          data: {
            id: 'd1',
            name: 'Ayesha Rahman',
            specialization: 'Cardiology',
            hospital: 'Square Hospital',
            phone: '+880 1711 000000',
            email: 'ayesha@hospital.dev',
            patientCount: 22,
            createdAt: '2026-11-01T00:00:00.000Z',
            updatedAt: '2026-11-01T00:00:00.000Z',
          },
        }),
    });
    renderWithProviders(<DoctorProfile id="d1" />);

    expect(await screen.findByRole('heading', { name: 'Ayesha Rahman' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'All doctors' })).toHaveLength(1);
    expect(screen.queryByRole('status', { name: 'Loading doctor' })).not.toBeInTheDocument();
  });
});
