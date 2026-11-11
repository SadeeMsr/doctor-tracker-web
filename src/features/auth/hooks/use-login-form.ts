'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { isApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/lib/errors';

import { useLogin } from '../queries';
import { safeNextPath } from '../redirect';
import { loginSchema, type LoginValues } from '../schemas';

/** All login behaviour, so the form component only renders. */
export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  // Bumped on every failure, so the form can re-trigger its shake animation.
  const [failures, setFailures] = useState(0);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      router.replace(safeNextPath(searchParams.get('next')));
      router.refresh();
    } catch (error) {
      setFailures((count) => count + 1);
      if (isApiError(error) && error.code === 'VALIDATION_ERROR' && Array.isArray(error.details)) {
        for (const issue of error.details as { path: string; message: string }[]) {
          if (issue.path === 'email' || issue.path === 'password') {
            form.setError(issue.path, { message: issue.message });
          }
        }
        return;
      }
      form.setError('root', { message: getErrorMessage(error) });
      form.resetField('password', { keepError: true });
      form.setFocus('password');
    }
  });

  return { form, onSubmit, isPending: login.isPending || login.isSuccess, failures };
}
