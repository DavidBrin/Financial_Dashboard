import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronUp, CircleDot, X } from 'lucide-react';
import { Link } from 'wouter';
import type { FinanceItem, SectionSlug } from '@/domain/finance';
import { formatCompactCurrency, formatCurrency, formatPercent } from '@/lib/format';

type FinanceCardProps = {
  item: FinanceItem;
  sectionSlug: SectionSlug;
};

export function FinanceCard({ item, sectionSlug }: FinanceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue = Math.abs(item.value) >= 100000
    ? formatCompactCurrency(Math.abs(item.value))
    : formatCurrency(Math.abs(item.value));

  return (
    <article
      className={`finance-card finance-card--${item.status ?? 'healthy'} ${isOpen ? 'finance-card--open' : ''}`}
      style={{ '--card-accent': item.accent } as CSSProperties}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <div className="card-edge" aria-hidden="true" />
      <div className="finance-card__main">
        <div className="finance-card__brand">
          <span className="institution-mark" aria-hidden="true">{item.institution.slice(0, 1)}</span>
          <div>
            <p>{item.institution}</p>
            <h3>{item.name}</h3>
          </div>
        </div>
        <div className="finance-card__value">
          <strong>{item.value < 0 ? '−' : ''}{displayValue}</strong>
          <span>{item.valueLabel}</span>
        </div>
        <div className="finance-card__signal">
          <CircleDot size={13} aria-hidden="true" />
          <span>{item.signal}</span>
          {item.trend !== undefined && <b className={item.trend < 0 ? 'negative' : ''}>{formatPercent(item.trend)}</b>}
        </div>
        <div className="finance-card__actions">
          <button
            type="button"
            className="receipt-toggle"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <ChevronUp size={15} aria-hidden="true" />
            Reveal recent activity
          </button>
          <Link href={`/manage/${sectionSlug}?item=${item.id}`}>Details</Link>
        </div>
      </div>
      <div className="receipt-drawer" hidden={!isOpen} aria-label={`${item.name} details`}>
        <div className="receipt-drawer__head">
          <span className="receipt-drawer__label">Latest details</span>
          <button type="button" aria-label="Close recent activity" onClick={() => setIsOpen(false)}><X size={14} /></button>
        </div>
        {item.details.slice(0, 3).map((detail) => (
          <div className="receipt-row" key={`${item.id}-${detail.label}`}>
            <span>{detail.label}</span>
            <strong className={detail.tone}>{detail.value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}
