import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResultCount } from './result-count';

describe('ResultCount', () => {
  it('states the total, and says when filters narrow it', () => {
    const { rerender } = render(
      <ResultCount total={132} noun={['doctor', 'doctors']} isFiltered={false} />,
    );
    expect(screen.getByText(/doctors$/).parentElement).toHaveTextContent('132 doctors');

    rerender(<ResultCount total={1} noun={['doctor', 'doctors']} isFiltered />);
    expect(screen.getByText(/matches your filters/)).toHaveTextContent(
      '1 doctor matches your filters',
    );
  });
});
