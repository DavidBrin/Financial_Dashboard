import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAppRouter } from '@/app/router';

describe.each([
  ['cash', 'Manage cash'],
  ['investments', 'Manage investments'],
  ['subscriptions', 'Manage subscriptions'],
  ['property', 'Manage property'],
  ['credit', 'Manage credit'],
  ['insurance', 'Manage protection'],
  ['business', 'Manage business'],
])('management route /manage/%s', (slug, heading) => {
  it(`renders ${heading}`, () => {
    render(createAppRouter([`/manage/${slug}`]));
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});

describe('subscription management', () => {
  it('filters services that need review', async () => {
    const user = userEvent.setup();
    render(createAppRouter(['/manage/subscriptions']));

    await user.click(screen.getByRole('button', { name: /needs review/i }));

    expect(screen.getByText('Adobe')).toBeInTheDocument();
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
  });

  it('stages a real cancellation request and offers undo', async () => {
    const user = userEvent.setup();
    render(createAppRouter(['/manage/subscriptions']));
    const adobe = screen.getByRole('article', { name: /adobe subscription/i });

    await user.click(within(adobe).getByRole('button', { name: /cancel subscription/i }));
    await user.click(screen.getByRole('button', { name: /request cancellation/i }));

    expect(await screen.findByText(/demo mode: request staged/i)).toBeInTheDocument();
    expect(screen.getByText(/request id/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /undo staged cancellation/i })).toBeInTheDocument();
  });

  it('focuses the safe modal action, closes on Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(createAppRouter(['/manage/subscriptions']));
    const adobe = screen.getByRole('article', { name: /adobe subscription/i });
    const trigger = within(adobe).getByRole('button', { name: /cancel subscription/i });

    await user.click(trigger);

    expect(screen.getByRole('button', { name: /keep subscription/i })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

it('renders the useful not-found view for an invalid management slug', () => {
  render(createAppRouter(['/manage/loans']));
  expect(screen.getByRole('heading', { name: /this account view does not exist/i })).toBeInTheDocument();
});
