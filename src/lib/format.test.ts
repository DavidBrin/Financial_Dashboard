import { formatCompactCurrency, formatCurrency, formatDate, formatPercent } from './format';

describe('financial formatting', () => {
  it('keeps exact balances readable', () => {
    expect(formatCurrency(123456.78)).toBe('$123,456.78');
  });

  it('compacts large portfolio values', () => {
    expect(formatCompactCurrency(1248000)).toBe('$1.25M');
  });

  it('adds a directional sign to positive percentages', () => {
    expect(formatPercent(6.2)).toBe('+6.2%');
    expect(formatPercent(-1.4)).toBe('-1.4%');
  });

  it('formats an ISO renewal date without shifting time zones', () => {
    expect(formatDate('2026-08-04')).toBe('Aug 4');
  });
});
