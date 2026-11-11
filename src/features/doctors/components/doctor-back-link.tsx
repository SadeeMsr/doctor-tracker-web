import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { buttonStyles } from '@/components/ui/button';

/** "All doctors": shown while the doctor loads too, so the banner below never shifts down. */
export function DoctorBackLink() {
  return (
    <Link
      href="/doctors"
      className={buttonStyles({ variant: 'ghost', size: 'sm', className: '-ml-3' })}
    >
      <ArrowLeft aria-hidden />
      All doctors
    </Link>
  );
}
