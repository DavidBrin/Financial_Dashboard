import { getSection } from './demoData';

describe('dashboard aggregate figures', () => {
  it('matches the subscriptions total to listed recurring charges', () => {
    const section = getSection('subscriptions')!;
    expect(section.total).toBe(section.items.reduce((total, item) => total + item.value, 0));
  });

  it('matches property value to listed positive property assets', () => {
    const section = getSection('property')!;
    expect(section.total).toBe(section.items.filter((item) => item.value > 0).reduce((total, item) => total + item.value, 0));
  });
});
