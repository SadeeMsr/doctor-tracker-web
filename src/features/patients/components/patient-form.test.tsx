import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError, json, mockApi, requestOf } from '@/test/fetch';
import { renderWithProviders } from '@/test/render';

import { PatientForm } from './patient-form';

const ADD_PATH = '/api/v1/doctors/d1/patients';

function renderForm() {
  const onDone = vi.fn();
  const onSavedAndNext = vi.fn();
  renderWithProviders(
    <PatientForm doctorId="d1" addedCount={0} onDone={onDone} onSavedAndNext={onSavedAndNext} />,
  );
  return { onDone, onSavedAndNext, user: userEvent.setup() };
}

async function fillPatient(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Full name'), 'Karim Uddin');
  fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '1980-05-04' } });
  await user.click(screen.getByRole('combobox', { name: 'Gender' }));
  await user.click(await screen.findByRole('option', { name: 'Male' }));
  await user.type(screen.getByLabelText('Phone'), '+880 1711 000000');
  await user.type(screen.getByLabelText('Diagnosis'), 'Hypertension, controlled');
}

describe('PatientForm (adding from a doctor)', () => {
  let fetchMock: ReturnType<typeof mockApi>;

  beforeEach(() => {
    fetchMock = mockApi({
      [`POST ${ADD_PATH}`]: ({ body }) => json(201, { data: { id: 'p1', ...(body as object) } }),
    });
  });

  it('hides the doctor picker: the patient joins this doctor', () => {
    renderForm();

    expect(screen.queryByRole('combobox', { name: 'Doctor' })).not.toBeInTheDocument();
  });

  it('flags missing details before anything is sent', async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Add patient' }));

    expect(await screen.findByText('Enter the patient’s full name')).toBeInTheDocument();
    expect(screen.getByText('Choose a gender')).toBeInTheDocument();
    expect(screen.getByText('Describe the diagnosis')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('adds the patient under the doctor, with ISO dates, no email and an Idempotency-Key', async () => {
    const { user, onDone } = renderForm();

    await fillPatient(user);
    await user.click(screen.getByRole('button', { name: 'Add patient' }));

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    const { body, headers } = requestOf(fetchMock, 'POST', ADD_PATH);
    expect(body).toMatchObject({
      name: 'Karim Uddin',
      gender: 'male',
      condition: 'stable',
      email: null,
      dateOfBirth: expect.stringMatching(/^1980-05-04T/),
    });
    expect(headers['Idempotency-Key']).toBeTruthy();
  });

  it('"Save & add another" keeps the doctor and admission date for the next patient', async () => {
    const { user, onSavedAndNext, onDone } = renderForm();

    await fillPatient(user);
    await user.click(screen.getByRole('button', { name: 'Save & add another' }));

    await waitFor(() =>
      expect(onSavedAndNext).toHaveBeenCalledWith({
        doctorId: 'd1',
        admittedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      }),
    );
    expect(onDone).not.toHaveBeenCalled();
  });

  it("shows the server's validation errors on the matching fields", async () => {
    mockApi({
      [`POST ${ADD_PATH}`]: () =>
        apiError(422, {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: [{ path: 'phone', message: 'This number is not reachable' }],
        }),
    });
    const { user, onDone } = renderForm();

    await fillPatient(user);
    await user.click(screen.getByRole('button', { name: 'Add patient' }));

    expect(await screen.findByText('This number is not reachable')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toHaveAttribute('aria-invalid', 'true');
    expect(onDone).not.toHaveBeenCalled();
  });
});
