import { render, screen } from '@testing-library/react';
import { createAppRouter } from './router';

describe('application router', () => {
  it('renders the financial command center landing page', () => {
    render(createAppRouter(['/']));

    expect(screen.getByRole('heading', { name: /financial command center/i })).toBeInTheDocument();
  });
});
