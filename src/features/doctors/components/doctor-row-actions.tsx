'use client';

import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

import { buttonStyles } from '@/components/ui/button';
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ui/menu';

import type { Doctor } from '../types';

interface DoctorRowActionsProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

/** Edit and delete for a doctor row or card. Opening the doctor is a visible link instead. */
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
