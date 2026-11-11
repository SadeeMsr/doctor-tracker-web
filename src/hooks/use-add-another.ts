'use client';

import { useState } from 'react';

/**
 * Session state for a create dialog with "Save & add another". After each save the dialog
 * remounts its form (key it on `addedCount`), so the next record starts truly fresh: clean
 * values, errors and focus, and a new Idempotency-Key. `carry` holds the values worth keeping
 * between records, such as the doctor and admission date.
 * @example const session = useAddAnother<{ doctorId: string }>(); <Form key={session.addedCount} carry={session.carry} />
 */
export function useAddAnother<TCarry>() {
  const [session, setSession] = useState<{ addedCount: number; carry?: TCarry }>({
    addedCount: 0,
  });

  return {
    addedCount: session.addedCount,
    carry: session.carry,
    /** After a successful save: count it and start the next record with these values. */
    startNext: (carry: TCarry) =>
      setSession((current) => ({ addedCount: current.addedCount + 1, carry })),
    /** When the dialog closes, so the next visit starts from zero. */
    end: () => setSession({ addedCount: 0 }),
  };
}
