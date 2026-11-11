import { describe, expect, it } from 'vitest';

import { doctorSchema } from './schemas';

const valid = {
  name: 'Nadia Islam',
  specialization: 'Neurology',
  hospital: 'United Hospital',
  phone: '+880 1811-222333',
  email: 'nadia@hospital.dev',
};

const errorsFor = (input: object) =>
  doctorSchema.safeParse(input).error?.issues.map((issue) => issue.path.join('.')) ?? [];

/** The form mirrors the API's rules, so bad input is caught before a request is sent. */
describe('doctorSchema', () => {
  it('accepts a complete doctor and trims the text', () => {
    expect(doctorSchema.parse({ ...valid, name: '  Nadia Islam  ' }).name).toBe('Nadia Islam');
  });

  it('rejects specializations outside the list', () => {
    expect(errorsFor({ ...valid, specialization: 'Astrology' })).toEqual(['specialization']);
  });

  it('accepts common phone formats and rejects junk', () => {
    expect(errorsFor({ ...valid, phone: '01711000000' })).toEqual([]);
    expect(errorsFor({ ...valid, phone: '+1 (555) 123-4567' })).toEqual([]);
    expect(errorsFor({ ...valid, phone: 'call me' })).toEqual(['phone']);
  });

  it('requires a real email address', () => {
    expect(errorsFor({ ...valid, email: '' })).toEqual(['email']);
    expect(errorsFor({ ...valid, email: 'not-an-email' })).toEqual(['email']);
  });
});
