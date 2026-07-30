import type { AttentionItem, DashboardSummary, FinanceSection, SectionSlug } from '@/domain/finance';

export const dashboardSummary: DashboardSummary = {
  netWorth: 2374820,
  netWorthTrend: 8.4,
  monthlyCashFlow: 8432,
  upcomingObligations: 12680,
  savingsRate: 34.2,
  lastSynced: '2 minutes ago',
};

export const attentionItems: AttentionItem[] = [
  { id: 'a1', title: 'Adobe price changed', detail: '$54.99 → $59.99 next renewal', action: 'Review', href: '/manage/subscriptions', tone: 'warning' },
  { id: 'a2', title: 'Quarterly tax reserve', detail: '$2,140 until you reach the target', action: 'View plan', href: '/manage/business', tone: 'info' },
  { id: 'a3', title: 'Emergency fund complete', detail: 'Six months of core expenses set aside', action: 'See goal', href: '/manage/cash', tone: 'positive' },
];

export const dashboardSections: FinanceSection[] = [
  {
    slug: 'cash', eyebrow: '01 · Available', title: 'Cash & banking', shortTitle: 'Cash',
    description: 'Every liquid dollar, from everyday spending to the quiet reserves.', total: 142860, totalLabel: 'Available cash',
    items: [
      { id: 'chase-checking', name: 'Everyday checking', institution: 'Chase', value: 18420.16, valueLabel: 'Available balance', signal: '$4,188 in · $3,204 out this month', trend: 2.6, accent: '#1758A6', status: 'healthy', details: [{ label: 'Borough Market', value: '-$84.20' }, { label: 'Salary', value: '+$6,240.00', tone: 'positive' }, { label: 'Con Edison', value: '-$142.18' }] },
      { id: 'marcus-savings', name: 'High-yield reserve', institution: 'Marcus', value: 76240.43, valueLabel: 'Current balance', signal: '4.40% APY · $279 earned this month', trend: 4.4, accent: '#7254A7', status: 'healthy', details: [{ label: 'Interest earned', value: '+$279.48', tone: 'positive' }, { label: 'Monthly transfer', value: '+$1,500.00', tone: 'positive' }, { label: 'Emergency target', value: '100%', tone: 'positive' }] },
      { id: 'ally-joint', name: 'Household checking', institution: 'Ally', value: 12884.08, valueLabel: 'Available balance', signal: 'Mortgage funded · 18 days of runway', accent: '#67308F', status: 'healthy', details: [{ label: 'Whole Foods', value: '-$126.44' }, { label: 'Mortgage hold', value: '-$4,820.00' }, { label: 'Shared transfer', value: '+$3,000.00', tone: 'positive' }] },
      { id: 'treasury', name: 'Treasury ladder', institution: 'Public', value: 35315.33, valueLabel: 'Market value', signal: 'Next maturity September 12', trend: 3.9, accent: '#1E705B', status: 'healthy', details: [{ label: '4-week T-bill', value: '$10,000' }, { label: '8-week T-bill', value: '$15,000' }, { label: '13-week T-bill', value: '$10,315' }] },
    ],
  },
  {
    slug: 'investments', eyebrow: '02 · Build', title: 'Investments & retirement', shortTitle: 'Investments',
    description: 'Long-term capital across every custodian, plan, and mandate.', total: 1248000, totalLabel: 'Invested assets',
    items: [
      { id: 'fidelity-brokerage', name: 'Individual brokerage', institution: 'Fidelity', value: 486220.84, valueLabel: 'Portfolio value', signal: '+$4,840 today · 71% equities', trend: 12.4, accent: '#2F7A4D', status: 'healthy', details: [{ label: 'VTI', value: '$192,480' }, { label: 'VXUS', value: '$82,310' }, { label: 'BND', value: '$64,920' }] },
      { id: 'vanguard-401k', name: 'Employer 401(k)', institution: 'Vanguard', value: 392450.60, valueLabel: 'Retirement balance', signal: 'On track · 72% of annual limit', trend: 9.8, accent: '#8A2635', status: 'healthy', details: [{ label: 'Target 2055', value: '64%' }, { label: 'US equity index', value: '24%' }, { label: 'Bond index', value: '12%' }] },
      { id: 'schwab-ira', name: 'Roth IRA', institution: 'Charles Schwab', value: 214680.12, valueLabel: 'Tax-free assets', signal: '2026 contribution complete', trend: 10.2, accent: '#1A75A8', status: 'healthy', details: [{ label: 'SCHB', value: '$108,540' }, { label: 'SCHF', value: '$62,110' }, { label: 'Cash', value: '$7,820' }] },
      { id: 'coinbase', name: 'Digital assets', institution: 'Coinbase', value: 154648.44, valueLabel: 'Market value', signal: '6.2% of invested assets', trend: -1.7, accent: '#225DEB', status: 'attention', details: [{ label: 'Bitcoin', value: '$118,210' }, { label: 'Ethereum', value: '$31,840' }, { label: 'Other', value: '$4,598' }] },
    ],
  },
  {
    slug: 'subscriptions', eyebrow: '03 · Recurring', title: 'Bills & subscriptions', shortTitle: 'Subscriptions',
    description: 'Recurring commitments, upcoming charges, and anything worth reconsidering.', total: 684.42, totalLabel: 'Monthly recurring',
    items: [
      { id: 'adobe', name: 'Creative Cloud', institution: 'Adobe', value: 59.99, valueLabel: 'Next charge · Aug 3', signal: 'Price increases $5 next cycle', accent: '#D94C45', status: 'attention', renewalDate: '2026-08-03', frequency: 'monthly', details: [{ label: 'Last charge', value: '$54.99' }, { label: 'Annualized', value: '$719.88' }, { label: 'Used', value: 'Yesterday' }] },
      { id: 'netflix', name: 'Premium', institution: 'Netflix', value: 24.99, valueLabel: 'Next charge · Aug 8', signal: 'Used 4 days ago · Shared household', accent: '#B81D24', status: 'healthy', renewalDate: '2026-08-08', frequency: 'monthly', details: [{ label: 'Last charge', value: '$24.99' }, { label: 'Annualized', value: '$299.88' }, { label: 'Active since', value: '2019' }] },
      { id: 'equinox', name: 'Destination membership', institution: 'Equinox', value: 315, valueLabel: 'Next charge · Aug 1', signal: '8 visits this month', accent: '#252827', status: 'healthy', renewalDate: '2026-08-01', frequency: 'monthly', details: [{ label: 'Cost per visit', value: '$39.38' }, { label: 'Annualized', value: '$3,780' }, { label: 'Renewal', value: 'Monthly' }] },
      { id: 'nyt', name: 'All Access', institution: 'The New York Times', value: 25, valueLabel: 'Next charge · Aug 12', signal: 'Promotional rate ends in 44 days', accent: '#424242', status: 'attention', renewalDate: '2026-08-12', frequency: 'monthly', details: [{ label: 'Current rate', value: '$25.00' }, { label: 'Future rate', value: '$40.00' }, { label: 'Used', value: 'Today' }] },
    ],
  },
  {
    slug: 'property', eyebrow: '04 · Grounded', title: 'Property & real estate', shortTitle: 'Property',
    description: 'Homes, mortgages, and the equity quietly accumulating between them.', total: 926000, totalLabel: 'Estimated property value',
    items: [
      { id: 'brooklyn-home', name: 'Brooklyn townhome', institution: 'Zillow estimate', value: 926000, valueLabel: 'Estimated market value', signal: '$514,380 equity · 44.5% LTV', trend: 3.1, accent: '#2D7083', status: 'healthy', details: [{ label: 'Mortgage', value: '$411,620' }, { label: 'Monthly payment', value: '$4,820' }, { label: 'Last valuation', value: 'Jul 28' }] },
      { id: 'mortgage', name: '30-year fixed mortgage', institution: 'Better Mortgage', value: -411620, valueLabel: 'Principal remaining', signal: '3.125% APR · Due August 1', accent: '#E77745', status: 'healthy', details: [{ label: 'Principal', value: '$1,420' }, { label: 'Interest', value: '$1,074' }, { label: 'Escrow', value: '$2,326' }] },
      { id: 'rental', name: 'Hudson Valley cabin', institution: 'Manual asset', value: 382000, valueLabel: 'Estimated market value', signal: '$2,840 net income this quarter', trend: 4.6, accent: '#6B7652', status: 'healthy', details: [{ label: 'Mortgage', value: '$238,210' }, { label: 'Occupancy', value: '71%' }, { label: 'YTD expenses', value: '$8,420' }] },
    ],
  },
  {
    slug: 'credit', eyebrow: '05 · Owed', title: 'Credit & debt', shortTitle: 'Credit',
    description: 'Every balance, due date, and borrowing cost—with no surprises.', total: 43825, totalLabel: 'Revolving & installment debt',
    items: [
      { id: 'amex', name: 'Platinum', institution: 'American Express', value: 4284.22, valueLabel: 'Statement balance', signal: 'Due Aug 14 · Autopay on', accent: '#738C99', status: 'healthy', details: [{ label: 'Available credit', value: '$45,716' }, { label: 'Utilization', value: '8.6%' }, { label: 'Points', value: '224,810' }] },
      { id: 'chase-sapphire', name: 'Sapphire Reserve', institution: 'Chase', value: 2140.60, valueLabel: 'Current balance', signal: 'Due Aug 20 · 7% utilization', accent: '#173E73', status: 'healthy', details: [{ label: 'Statement', value: '$1,884' }, { label: 'Available', value: '$27,859' }, { label: 'Points', value: '94,240' }] },
      { id: 'tesla-loan', name: 'Auto loan', institution: 'Tesla Finance', value: 37399.86, valueLabel: 'Principal remaining', signal: '4.49% APR · 31 payments left', accent: '#A0393B', status: 'healthy', details: [{ label: 'Payment', value: '$1,245' }, { label: 'Due', value: 'Aug 9' }, { label: 'Payoff date', value: 'Feb 2029' }] },
    ],
  },
  {
    slug: 'insurance', eyebrow: '06 · Protected', title: 'Insurance & protection', shortTitle: 'Protection',
    description: 'Coverage, premiums, and renewals for the assets and people that matter.', total: 11840, totalLabel: 'Annual premiums',
    items: [
      { id: 'home-policy', name: 'Homeowners', institution: 'Chubb', value: 4280, valueLabel: 'Annual premium', signal: '$1.4M dwelling coverage · Renews Nov 8', accent: '#682B45', status: 'healthy', renewalDate: '2026-11-08', frequency: 'annual', details: [{ label: 'Deductible', value: '$5,000' }, { label: 'Liability', value: '$1M' }, { label: 'Renewal', value: 'Nov 8' }] },
      { id: 'auto-policy', name: 'Auto bundle', institution: 'Progressive', value: 2160, valueLabel: 'Annual premium', signal: 'Two vehicles · Renews Sep 22', accent: '#2F65A7', status: 'healthy', renewalDate: '2026-09-22', frequency: 'annual', details: [{ label: 'Vehicles', value: '2' }, { label: 'Deductible', value: '$1,000' }, { label: 'Renewal', value: 'Sep 22' }] },
      { id: 'life-policy', name: 'Term life', institution: 'Ladder', value: 5400, valueLabel: 'Annual premium', signal: '$3M coverage · Beneficiaries verified', accent: '#E77745', status: 'healthy', renewalDate: '2027-01-15', frequency: 'annual', details: [{ label: 'Coverage', value: '$3M' }, { label: 'Term remaining', value: '24 years' }, { label: 'Beneficiaries', value: '2 verified' }] },
    ],
  },
  {
    slug: 'business', eyebrow: '07 · Operating', title: 'Business & taxes', shortTitle: 'Business',
    description: 'Operating cash, open invoices, profit, and the tax reserve behind it all.', total: 186420, totalLabel: 'Business liquidity',
    items: [
      { id: 'mercury', name: 'Operating account', institution: 'Mercury', value: 128440.28, valueLabel: 'Available balance', signal: '7.2 months operating runway', trend: 18.2, accent: '#5964A8', status: 'healthy', details: [{ label: 'July revenue', value: '$84,200' }, { label: 'July expenses', value: '$47,180' }, { label: 'Runway', value: '7.2 months' }] },
      { id: 'stripe', name: 'Merchant balance', institution: 'Stripe', value: 18340.12, valueLabel: 'Available to pay out', signal: '$8,420 arriving tomorrow', trend: 11.6, accent: '#665BDA', status: 'healthy', details: [{ label: 'Today', value: '$4,840' }, { label: 'This month', value: '$76,220' }, { label: 'Disputes', value: '0' }] },
      { id: 'tax-reserve', name: 'Quarterly tax reserve', institution: 'Mercury Vault', value: 39639.60, valueLabel: 'Reserved cash', signal: '84% funded · Due September 15', accent: '#C66A3E', status: 'attention', details: [{ label: 'Target', value: '$47,200' }, { label: 'Gap', value: '$7,560' }, { label: 'Due', value: 'Sep 15' }] },
      { id: 'quickbooks', name: 'Open invoices', institution: 'QuickBooks', value: 28400, valueLabel: 'Accounts receivable', signal: '3 open · 1 overdue', accent: '#2C8A72', status: 'attention', details: [{ label: 'Northstar Co.', value: '$18,000' }, { label: 'Aster Labs', value: '$8,400' }, { label: 'Overdue', value: '$2,000' }] },
    ],
  },
];

export function getSection(slug: SectionSlug) {
  return dashboardSections.find((section) => section.slug === slug);
}
