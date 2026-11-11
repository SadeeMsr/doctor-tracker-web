'use client';

import { Ellipsis, Pencil, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

import { buttonStyles } from '@/components/ui/button';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ui/menu';

import type { Doctor } from '../types';

interface DoctorRowActionsProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

/** The "more" menu on a doctor row or card. */
export function DoctorRowActions({ doctor, onEdit, onDelete }: DoctorRowActionsProps) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Actions for ${doctor.name}`}
        className={buttonStyles({ variant: 'ghost', size: 'icon' })}
      >
        <Ellipsis aria-hidden />
      </MenuTrigger>
      <MenuContent>
        <MenuItem render={<Link href={`/doctors/${doctor.id}`} />}>
          <Users aria-hidden />
          View patients
        </MenuItem>
        <MenuItem onClick={() => onEdit(doctor)}>
          <Pencil aria-hidden />
          Edit details
        </MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" onClick={() => onDelete(doctor)}>
          <Trash2 aria-hidden />
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
