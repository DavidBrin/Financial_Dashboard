import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import type { FinanceSection } from '@/domain/finance';
import { formatCompactCurrency, formatCurrency } from '@/lib/format';
import { FinanceCard } from './FinanceCard';

export function FinanceRail({ section }: { section: FinanceSection }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ behavior: 'smooth', left: 348 * direction });
  };

  return (
    <section className="finance-section" aria-labelledby={`${section.slug}-title`}>
      <div className="finance-section__header">
        <div>
          <span className="section-eyebrow">{section.eyebrow}</span>
          <h2 id={`${section.slug}-title`}>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <div className="finance-section__summary">
          <span>{section.totalLabel}</span>
          <strong>{Math.abs(section.total) >= 100000 ? formatCompactCurrency(section.total) : formatCurrency(section.total)}</strong>
        </div>
        <div className="finance-section__controls">
          <Link className="manage-link" href={`/manage/${section.slug}`}>Manage {section.shortTitle?.toLowerCase() ?? section.slug}</Link>
          <button type="button" onClick={() => scroll(-1)} aria-label={`Previous ${section.shortTitle ?? section.slug}`}><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => scroll(1)} aria-label={`Next ${section.shortTitle ?? section.slug}`}><ArrowRight size={18} /></button>
        </div>
      </div>
      <div
        className="finance-rail"
        ref={railRef}
        role="list"
        aria-label={`${section.title} accounts`}
      >
        {section.items.map((item) => (
          <div role="listitem" key={item.id}>
            <FinanceCard item={item} sectionSlug={section.slug} />
          </div>
        ))}
        {section.items.length === 0 && <p className="rail-empty">Connect an account to begin.</p>}
      </div>
    </section>
  );
}
