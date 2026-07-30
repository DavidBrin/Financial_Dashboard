import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { AppShell } from './AppShell';

describe('AppShell mobile navigation', () => {
  it('opens a complete navigation menu from More and closes it', async () => {
    const user = userEvent.setup();
    const location = memoryLocation({ path: '/' });
    render(<Router hook={location.hook}><AppShell><p>Page</p></AppShell></Router>);

    await user.click(screen.getByRole('button', { name: 'More' }));
    const dialog = screen.getByRole('dialog', { name: 'All financial sections' });
    expect(within(dialog).getByRole('link', { name: 'Property' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog', { name: 'All financial sections' })).not.toBeInTheDocument();
  });
});
