import { useMemo, useState } from 'react';
import { ArrowLeft, Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'wouter';
import { AppShell } from '@/app/AppShell';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ManagementRow } from '@/components/ManagementRow';
import { ToastRegion } from '@/components/ToastRegion';
import { getSection } from '@/data/demoData';
import type { FinanceItem, SectionSlug } from '@/domain/finance';
import { useDemoCommand } from '@/hooks/useDemoCommand';
import { formatCurrency } from '@/lib/format';
import { NotFoundPage } from './NotFoundPage';

type SubscriptionFilter = 'active' | 'review' | 'canceled';

const actionPaths: Record<Exclude<SectionSlug, 'subscriptions'>, (id: string) => string> = {
  cash: (id) => `/api/v1/connectors/${id}/sync-jobs`,
  investments: (id) => `/api/v1/connectors/${id}/sync-jobs`,
  property: (id) => `/api/v1/properties/${id}/refresh-jobs`,
  credit: (id) => `/api/v1/credit/${id}/refresh-jobs`,
  insurance: (id) => `/api/v1/insurance-policies/${id}/sync-jobs`,
  business: (id) => `/api/v1/business-accounts/${id}/sync-jobs`,
};

export function ManageSectionPage({ slug }: { slug: SectionSlug }) {
  const section = getSection(slug);
  const command = useDemoCommand();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SubscriptionFilter>('active');
  const [selected, setSelected] = useState<FinanceItem | null>(null);
  const [lastResource, setLastResource] = useState<FinanceItem | null>(null);
  const [canceledIds, setCanceledIds] = useState<string[]>([]);

  const items = useMemo(() => {
    if (!section) return [];
    return section.items.filter((item) => {
      const matchesQuery = `${item.name} ${item.institution}`.toLowerCase().includes(query.toLowerCase());
      if (slug !== 'subscriptions') return matchesQuery;
      const canceled = canceledIds.includes(item.id);
      if (filter === 'canceled') return matchesQuery && canceled;
      if (filter === 'review') return matchesQuery && item.status === 'attention' && !canceled;
      return matchesQuery && !canceled;
    });
  }, [section, query, slug, filter, canceledIds]);

  if (!section) return <NotFoundPage />;
  const displayTitle = section.shortTitle?.toLowerCase() ?? slug;

  async function submitAction(item: FinanceItem) {
    setLastResource(item);
    if (slug === 'subscriptions') {
      setSelected(item);
      return;
    }
    await command.submit(actionPaths[slug](item.id), 'POST', { resourceId: item.id, requestedAt: new Date().toISOString() });
  }

  async function confirmCancellation() {
    if (!selected) return;
    const item = selected;
    setLastResource(item);
    const result = await command.submit(`/api/v1/subscriptions/${item.id}/cancellation-requests`, 'POST', {
      subscriptionId: item.id,
      merchant: item.institution,
      effective: 'next-renewal',
    });
    if (result) setCanceledIds((ids) => [...new Set([...ids, item.id])]);
    setSelected(null);
  }

  return (
    <AppShell>
      <div className="manage-page">
        <div className="manage-page__back"><Link href="/"><ArrowLeft size={15} /> Overview</Link><span>/</span><b>{section.shortTitle ?? section.title}</b></div>
        <header className="manage-header">
          <div><span className="section-eyebrow">{section.eyebrow}</span><h1>Manage {displayTitle}</h1><p>{section.description} Review connections, status, and actions from one place.</p></div>
          <button type="button" className="add-account-button"><Plus size={18} /> Add {slug === 'subscriptions' ? 'subscription' : 'account'}</button>
        </header>
        <section className="manage-summary" aria-label={`${section.title} summary`}>
          <div><span>{section.totalLabel}</span><strong>{formatCurrency(section.total)}</strong></div>
          <div><span>Connected sources</span><strong>{section.items.length}</strong></div>
          <div><span>Connection health</span><strong>{section.items.filter((item) => item.status !== 'attention').length} of {section.items.length} current</strong></div>
          <div><span>Last full sync</span><strong>Today, 11:42 AM</strong></div>
        </section>
        <div className="manage-toolbar">
          {slug === 'subscriptions' && <div className="filter-tabs" aria-label="Subscription filters">
            <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active <span>{section.items.length - canceledIds.length}</span></button>
            <button className={filter === 'review' ? 'active' : ''} onClick={() => setFilter('review')}>Needs review <span>{section.items.filter((item) => item.status === 'attention').length}</span></button>
            <button className={filter === 'canceled' ? 'active' : ''} onClick={() => setFilter('canceled')}>Canceled <span>{canceledIds.length}</span></button>
          </div>}
          <label className="manage-search"><Search size={16} /><span className="sr-only">Search records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${displayTitle}`} /></label>
          <button type="button" className="toolbar-button"><Filter size={15} /> Filter</button>
          <button type="button" className="toolbar-button"><SlidersHorizontal size={15} /> View</button>
        </div>
        <section className="management-list" aria-label={`${section.title} records`}>
          <div className="management-list__head"><span>Institution</span><span>Balance / cost</span><span>Renewal / connection</span><span>Status</span><span>Actions</span></div>
          {items.map((item) => <ManagementRow key={item.id} item={item} slug={slug} canceled={canceledIds.includes(item.id)} pending={command.status === 'pending' && lastResource?.id === item.id} onAction={submitAction} />)}
          {items.length === 0 && <div className="management-empty"><strong>No matching records</strong><span>Change the filter or connect a new source.</span></div>}
        </section>
        <div className="manage-footnote"><span>Mock data · changes are staged locally</span><span>Institution writes require a secure connector service</span></div>
      </div>
      {selected && <ConfirmDialog item={selected} pending={command.status === 'pending'} onConfirm={confirmCancellation} onClose={() => setSelected(null)} />}
      <ToastRegion result={command.result} resourceName={lastResource?.institution} canUndo={slug === 'subscriptions' && !!lastResource && canceledIds.includes(lastResource.id)} onUndo={async () => {
        if (!lastResource || !command.result) return;
        const item = lastResource;
        const cancellationRequestId = command.result.requestId;
        await command.submit(`/api/v1/subscriptions/${item.id}/cancellation-requests/${cancellationRequestId}/undo`, 'POST', {
          subscriptionId: item.id,
          cancellationRequestId,
        });
        setCanceledIds((ids) => ids.filter((id) => id !== item.id));
      }} onClose={command.reset} />
    </AppShell>
  );
}
