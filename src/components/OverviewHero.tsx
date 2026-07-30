import { ArrowUpRight, CalendarClock, CircleCheck, TrendingUp, Wallet } from 'lucide-react';
import { Link } from 'wouter';
import { attentionItems, dashboardSummary } from '@/data/demoData';
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/lib/format';

export function OverviewHero() {
  return (
    <section className="overview-hero" aria-labelledby="overview-title">
      <div className="hero-intro">
        <div>
          <span className="hero-date">Thursday · July 30</span>
          <h1 id="overview-title">Your financial command center.</h1>
          <p>Good morning, Maya. Everything you own, owe, and are building—quietly in one place.</p>
        </div>
        <button type="button" className="add-account-button"><span>+</span> Connect account</button>
      </div>
      <div className="net-worth-panel">
        <div className="net-worth-copy">
          <span>Household net worth</span>
          <strong>{formatCurrency(dashboardSummary.netWorth, 0)}</strong>
          <p><TrendingUp size={16} aria-hidden="true" /> {formatPercent(dashboardSummary.netWorthTrend)} over the last 12 months</p>
        </div>
        <div className="tide-chart" role="img" aria-label="Net worth trend rising over the last twelve months">
          <svg viewBox="0 0 720 160" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e77745" stopOpacity=".24"/><stop offset="1" stopColor="#e77745" stopOpacity="0"/></linearGradient>
            </defs>
            <path className="tide-fill" d="M0 139 C55 128 82 135 128 112 S213 103 260 88 S338 96 390 68 S469 75 520 45 S620 53 720 12 L720 160 L0 160 Z" />
            <path className="tide-line" d="M0 139 C55 128 82 135 128 112 S213 103 260 88 S338 96 390 68 S469 75 520 45 S620 53 720 12" />
            <circle cx="720" cy="12" r="5" />
          </svg>
          <div className="chart-axis"><span>Aug '25</span><span>Nov</span><span>Feb</span><span>May</span><span>Today</span></div>
        </div>
        <div className="hero-metrics">
          <div><Wallet size={17} /><span>Monthly cash flow</span><strong>{formatCompactCurrency(dashboardSummary.monthlyCashFlow)}</strong></div>
          <div><CalendarClock size={17} /><span>Next 30 days</span><strong>{formatCompactCurrency(dashboardSummary.upcomingObligations)}</strong></div>
          <div><CircleCheck size={17} /><span>Savings rate</span><strong>{dashboardSummary.savingsRate}%</strong></div>
        </div>
      </div>
      <div className="attention-strip">
        <div className="attention-strip__title"><span>Needs your eye</span><strong>{attentionItems.length}</strong></div>
        {attentionItems.map((item) => (
          <Link href={item.href} className={`attention-item attention-item--${item.tone}`} key={item.id}>
            <i aria-hidden="true" />
            <span><strong>{item.title}</strong><small>{item.detail}</small></span>
            <b>{item.action}<ArrowUpRight size={14} /></b>
          </Link>
        ))}
      </div>
    </section>
  );
}
