import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinanceCard } from './FinanceCard';
import type { FinanceItem } from '@/domain/finance';

const item: FinanceItem = {
  id: 'checking-1',
  name: 'Everyday checking',
  institution: 'Chase',
  value: 18420.16,
  valueLabel: 'Available balance',
  signal: 'Healthy buffer',
  trend: 4.2,
  accent: '#176b57',
  details: [
    { label: 'Borough Market', value: '-$84.20' },
    { label: 'Salary', value: '+$6,240.00' },
  ],
};

describe('FinanceCard', () => {
  it('reveals receipt details with an explicit keyboard-operable control', async () => {
    const user = userEvent.setup();
    render(<FinanceCard item={item} sectionSlug="cash" />);

    expect(screen.queryByText('Borough Market')).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: /reveal recent activity/i }));

    expect(screen.getByText('Borough Market')).toBeVisible();
    expect(screen.getByText('-$84.20')).toBeVisible();
  });
});
