import { ArrowUpRight, Check, MoreHorizontal, RefreshCw } from 'lucide-react';
import type { FinanceItem, SectionSlug } from '@/domain/finance';
import { formatCurrency, formatDate } from '@/lib/format';

type ManagementRowProps = {
  item: FinanceItem;
  slug: SectionSlug;
  canceled?: boolean;
  pending?: boolean;
  onAction: (item: FinanceItem) => void;
};

export function ManagementRow({ item, slug, canceled, pending, onAction }: ManagementRowProps) {
  const isSubscription = slug === 'subscriptions';
  return (
    <article className={`management-row ${canceled ? 'management-row--canceled' : ''}`} aria-label={`${item.institution} ${isSubscription ? 'subscription' : 'account'}`}>
      <div className="management-row__identity">
        <span className="row-mark" style={{ background: item.accent }} aria-hidden="true">{item.institution.slice(0, 1)}</span>
        <div><strong>{item.institution}</strong><span>{item.name}</span></div>
      </div>
      <div className="management-row__metric"><span>{item.valueLabel}</span><strong>{item.value < 0 ? '−' : ''}{formatCurrency(Math.abs(item.value))}</strong></div>
      <div className="management-row__detail">
        <span>{isSubscription ? 'Renewal' : 'Connection'}</span>
        <strong>{isSubscription && item.renewalDate ? formatDate(item.renewalDate) : 'Synced 2m ago'}</strong>
      </div>
      <div className="management-row__status">
        <span className={`status-badge status-badge--${canceled ? 'pending' : item.status ?? 'healthy'}`}>
          {canceled ? 'Cancellation staged' : item.status === 'attention' ? 'Needs review' : <><Check size={12} /> Current</>}
        </span>
      </div>
      <div className="management-row__actions">
        <button type="button" className={isSubscription ? 'cancel-button' : 'row-action'} onClick={() => onAction(item)} disabled={pending || canceled}>
          {isSubscription ? (pending ? 'Requesting…' : 'Cancel subscription') : <><RefreshCw size={14} /> {pending ? 'Syncing…' : 'Sync now'}</>}
        </button>
        <button type="button" className="more-button" aria-label={`More actions for ${item.institution}`}><MoreHorizontal size={18} /></button>
        {!isSubscription && <button type="button" className="open-button" aria-label={`Open ${item.institution}`}><ArrowUpRight size={16} /></button>}
      </div>
    </article>
  );
}
