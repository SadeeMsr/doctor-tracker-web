import { z } from 'zod';

/** Mirrors the API's `loginBody`: same limits, so the client never sends what the API rejects. */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email')
    .max(254)
    .pipe(z.email('Enter a valid email address')),
  password: z.string().min(1, 'Enter your password').max(256),
});

export type LoginValues = z.infer<typeof loginSchema>;
