'use client';

import { ArrowRight, AtSign, CircleAlert, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, fieldErrorId } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { useLoginForm } from '../hooks/use-login-form';

import { DemoAccess } from './demo-access';
import { PasswordInput } from './password-input';

const rise = (step: number) => ({ animationDelay: `${String(80 + step * 70)}ms` });

function FormError({ message, failures }: { message?: string; failures: number }) {
  if (!message) return null;
  return (
    <div
      key={failures}
      role="alert"
      className="flex animate-shake items-start gap-3 rounded-2xl bg-danger/8 px-4 py-3 text-sm text-danger ring-1 ring-danger/20"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </div>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" size="lg" className="w-full justify-between pr-2 pl-6" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
      <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 group-hover/button:translate-x-0.5">
        {pending ? <Spinner label="Signing in" /> : <ArrowRight aria-hidden />}
      </span>
    </Button>
  );
}

export function LoginForm() {
  const { form, onSubmit, isPending, failures } = useLoginForm();
  const { errors } = form.formState;
  const fill = (email: string, password: string) => {
    form.setValue('email', email, { shouldValidate: true });
    form.setValue('password', password, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="w-full max-w-[26rem] space-y-6"
      aria-busy={isPending}
    >
      <header className="animate-lift space-y-3">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
          Admin portal
        </p>
        <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Welcome back</h1>
        <p className="text-[0.95rem] text-muted-foreground">
          Sign in to manage doctors, patients and insights.
        </p>
      </header>

      <FormError message={errors.root?.message} failures={failures} />

      <div className="animate-rise space-y-1" style={rise(1)}>
        <Field htmlFor="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            size="lg"
            type="email"
            icon={<AtSign />}
            placeholder="you@clinic.com"
            autoComplete="username"
            inputMode="email"
            autoFocus
            aria-invalid={Boolean(errors.email)}
            aria-describedby={fieldErrorId('email')}
            {...form.register('email')}
          />
        </Field>
        <Field htmlFor="password" label="Password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            size="lg"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={fieldErrorId('password')}
            {...form.register('password')}
          />
        </Field>
      </div>

      <div className="animate-rise space-y-4" style={rise(2)}>
        <SubmitButton pending={isPending} />
        <DemoAccess onFill={fill} />
      </div>

      <p
        className="flex animate-rise items-center gap-2 text-xs text-muted-foreground"
        style={rise(3)}
      >
        <ShieldCheck className="size-4 text-status-stable" aria-hidden />
        Your session is encrypted and signs out automatically.
      </p>
    </form>
  );
}
