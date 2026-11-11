import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiError, json, mockApi, requestOf } from '@/test/fetch';
import { renderWithProviders } from '@/test/render';

import { LoginForm } from './login-form';

const router = { replace: vi.fn(), refresh: vi.fn() };
let nextParam: string | null = null;

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(nextParam ? { next: nextParam } : {}),
}));

async function signIn(password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email'), 'admin@doctortracker.dev');
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: /sign in/i }));
}

describe('LoginForm', () => {
  beforeEach(() => {
    router.replace.mockReset();
    nextParam = null;
  });

  it('validates the fields before calling the API', async () => {
    const fetchMock = mockApi({});
    renderWithProviders(<LoginForm />);

    await userEvent.setup().click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findAllByRole('alert')).not.toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('signs in and returns the user to the page they came from', async () => {
    nextParam = '/patients?condition=critical';
    const fetchMock = mockApi({
      'POST /api/v1/auth/login': () =>
        json(200, { data: { id: 'u1', name: 'Admin', email: 'admin@doctortracker.dev' } }),
    });
    renderWithProviders(<LoginForm />);

    await signIn('Correct-Horse-9');

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith('/patients?condition=critical'),
    );
    expect(requestOf(fetchMock, 'POST', '/api/v1/auth/login').body).toEqual({
      email: 'admin@doctortracker.dev',
      password: 'Correct-Horse-9',
    });
  });

  it('ignores an off-site ?next= after login', async () => {
    nextParam = '//evil.example';
    mockApi({ 'POST /api/v1/auth/login': () => json(200, { data: { id: 'u1' } }) });
    renderWithProviders(<LoginForm />);

    await signIn('Correct-Horse-9');

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'));
  });

  it('shows one generic message for bad credentials and clears the password', async () => {
    mockApi({
      'POST /api/v1/auth/login': () =>
        apiError(401, { code: 'UNAUTHORIZED', message: 'Invalid email or password' }),
    });
    renderWithProviders(<LoginForm />);

    await signIn('wrong-password');

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(router.replace).not.toHaveBeenCalled();
  });
});
