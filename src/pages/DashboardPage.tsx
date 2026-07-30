import { AppShell } from '@/app/AppShell';
import { FinanceRail } from '@/components/FinanceRail';
import { OverviewHero } from '@/components/OverviewHero';
import { dashboardSections } from '@/data/demoData';

export function DashboardPage() {
  return (
    <AppShell>
      <div className="dashboard-page">
        <OverviewHero />
        <div className="dashboard-sections">
          {dashboardSections.map((section) => <FinanceRail key={section.slug} section={section} />)}
        </div>
        <footer className="dashboard-footer"><span>Ledger demo workspace</span><span>Data refreshed locally · No real institutions connected</span></footer>
      </div>
    </AppShell>
  );
}
