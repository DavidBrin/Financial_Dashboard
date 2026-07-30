export type SectionSlug =
  | 'cash'
  | 'investments'
  | 'subscriptions'
  | 'property'
  | 'credit'
  | 'insurance'
  | 'business';

export type DetailRow = {
  label: string;
  value: string;
  tone?: 'positive' | 'warning' | 'muted';
};

export type FinanceItem = {
  id: string;
  name: string;
  institution: string;
  value: number;
  valueLabel: string;
  signal: string;
  trend?: number;
  accent: string;
  details: DetailRow[];
  status?: 'healthy' | 'attention' | 'pending';
  renewalDate?: string;
  frequency?: 'monthly' | 'annual';
  description?: string;
};

export type FinanceSection = {
  slug: SectionSlug;
  eyebrow: string;
  title: string;
  shortTitle?: string;
  description: string;
  total: number;
  totalLabel: string;
  items: FinanceItem[];
};

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  action: string;
  href: string;
  tone: 'warning' | 'info' | 'positive';
};

export type DashboardSummary = {
  netWorth: number;
  netWorthTrend: number;
  monthlyCashFlow: number;
  upcomingObligations: number;
  savingsRate: number;
  lastSynced: string;
};
