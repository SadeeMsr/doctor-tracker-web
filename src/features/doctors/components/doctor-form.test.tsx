import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError, json, mockApi, requestOf } from '@/test/fetch';
import { renderWithProviders } from '@/test/render';

import type { Doctor } from '../types';

import { DoctorForm } from './doctor-form';

const doctor: Doctor = {
  id: 'd1',
  name: 'Ayesha Rahman',
  specialization: 'Cardiology',
  hospital: 'Square Hospital',
  phone: '+880 1711 000000',
  email: 'ayesha@hospital.dev',
  patientCount: 0,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
};

function renderForm(props: Partial<Parameters<typeof DoctorForm>[0]> = {}) {
  const onDone = vi.fn();
  const onSavedAndNext = vi.fn();
  const view = renderWithProviders(
    <DoctorForm addedCount={0} onDone={onDone} onSavedAndNext={onSavedAndNext} {...props} />,
  );
  return { ...view, onDone, onSavedAndNext, user: userEvent.setup() };
}

async function fillNewDoctor(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Nadia Islam');
  await user.click(screen.getByRole('combobox', { name: 'Specialization' }));
  await user.click(await screen.findByRole('option', { name: 'Neurology' }));
  await user.type(screen.getByLabelText('Hospital'), 'United Hospital');
  await user.type(screen.getByLabelText('Phone'), '+880 1811 222333');
  await user.type(screen.getByLabelText('Email'), 'nadia@hospital.dev');
}

describe('DoctorForm', () => {
  let fetchMock: ReturnType<typeof mockApi>;

  beforeEach(() => {
    fetchMock = mockApi({
      'GET /api/v1/doctors/hospitals': () => json(200, { data: ['United Hospital'] }),
      'POST /api/v1/doctors': ({ body }) =>
        json(201, { data: { ...doctor, ...(body as object), id: 'd2' } }),
      'PATCH /api/v1/doctors/d1': ({ body }) =>
        json(200, { data: { ...doctor, ...(body as object) } }),
    });
  });

  it('shows every field error and sends nothing when submitted empty', async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Add doctor' }));

    expect(await screen.findByText('Enter the doctor’s full name')).toBeInTheDocument();
    expect(screen.getByText('Choose a specialization')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid phone number')).toBeInTheDocument();
    expect(requestOf(fetchMock, 'POST', '/api/v1/doctors').body).toBeUndefined();
  });

  it('creates a doctor with an Idempotency-Key, then closes', async () => {
    const { user, onDone } = renderForm();

    await fillNewDoctor(user);
    await user.click(screen.getByRole('button', { name: 'Add doctor' }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    const { body, headers } = requestOf(fetchMock, 'POST', '/api/v1/doctors');
    expect(body).toEqual({
      name: 'Nadia Islam',
      specialization: 'Neurology',
      hospital: 'United Hospital',
      phone: '+880 1811 222333',
      email: 'nadia@hospital.dev',
    });
    expect(headers['Idempotency-Key']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('puts a duplicate-email conflict on the email field and keeps the form open', async () => {
    mockApi({
      'GET /api/v1/doctors/hospitals': () => json(200, { data: [] }),
      'POST /api/v1/doctors': () =>
        apiError(409, {
          code: 'CONFLICT',
          message: 'A doctor with this email already exists',
          details: { fields: ['email'] },
        }),
    });
    const { user, onDone } = renderForm();

    await fillNewDoctor(user);
    await user.click(screen.getByRole('button', { name: 'Add doctor' }));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(onDone).not.toHaveBeenCalled();
  });

  it('"Save & add another" saves, then hands the hospital to the next form', async () => {
    const { user, onDone, onSavedAndNext } = renderForm();

    await fillNewDoctor(user);
    await user.click(screen.getByRole('button', { name: 'Save & add another' }));

    await waitFor(() =>
      expect(onSavedAndNext).toHaveBeenCalledWith({ hospital: 'United Hospital' }),
    );
    expect(onDone).not.toHaveBeenCalled();
  });

  it('edits with a PATCH that carries only the changed field', async () => {
    const { user, onDone } = renderForm({ doctor });

    const name = screen.getByLabelText('Full name');
    await user.clear(name);
    await user.type(name, 'Ayesha R. Khan');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(requestOf(fetchMock, 'PATCH', '/api/v1/doctors/d1').body).toEqual({
      name: 'Ayesha R. Khan',
    });
    expect(screen.queryByRole('button', { name: 'Save & add another' })).not.toBeInTheDocument();
  });
});
