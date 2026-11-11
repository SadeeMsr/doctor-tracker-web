import { describe, expect, it } from 'vitest';

import { safeNextPath } from './redirect';

/** `?next=` after login must never become an open redirect to another site. */
describe('safeNextPath', () => {
  it('keeps same-site paths, including their query', () => {
    expect(safeNextPath('/patients?condition=critical')).toBe('/patients?condition=critical');
  });

  it.each([
    ['https://evil.example', 'an absolute URL'],
    ['//evil.example', 'a protocol-relative URL'],
    ['/\\evil.example', 'a backslash trick'],
    ['javascript:alert(1)', 'a script URL'],
  ])('sends %s (%s) to the dashboard instead', (next) => {
    expect(safeNextPath(next)).toBe('/');
  });

  it('avoids a loop back to the login page, and handles no value', () => {
    expect(safeNextPath('/login?next=/doctors')).toBe('/');
    expect(safeNextPath(null)).toBe('/');
  });
});
