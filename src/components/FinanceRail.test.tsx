import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { FinanceRail } from './FinanceRail';
import type { FinanceSection } from '@/domain/finance';

const section: FinanceSection = {
  slug: 'investments',
  eyebrow: '02 · Build',
  title: 'Investments & retirement',
  description: 'Long-term capital across every custodian.',
  total: 1248000,
  totalLabel: 'Invested assets',
  items: [],
};

describe('FinanceRail', () => {
  it('links to the matching management route', async () => {
    const location = memoryLocation({ path: '/', record: true });
    const user = userEvent.setup();
    render(
      <Router hook={location.hook}>
        <FinanceRail section={section} />
      </Router>,
    );

    await user.click(screen.getByRole('link', { name: /manage investments/i }));
    expect(location.history).toContain('/manage/investments');
  });

  it('moves the rail one card at a time', async () => {
    const user = userEvent.setup();
    render(<FinanceRail section={section} />);
    const rail = screen.getByRole('list', { name: /investments & retirement accounts/i });
    rail.scrollBy = vi.fn();

    await user.click(screen.getByRole('button', { name: /next investments/i }));
    expect(rail.scrollBy).toHaveBeenCalledWith({ behavior: 'smooth', left: 348 });
  });

  it('does not add a redundant tab stop to the list container', () => {
    render(<FinanceRail section={section} />);
    expect(screen.getByRole('list', { name: /investments & retirement accounts/i })).not.toHaveAttribute('tabindex');
  });
});
