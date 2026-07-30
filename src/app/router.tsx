import { Route, Router, Switch } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { DashboardPage } from '@/pages/DashboardPage';
import { ManageSectionPage } from '@/pages/ManageSectionPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import type { SectionSlug } from '@/domain/finance';

export function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/manage/:slug">{(params) => <ManageSectionPage slug={params.slug as SectionSlug} />}</Route>
      <Route><NotFoundPage /></Route>
    </Switch>
  );
}

export function createAppRouter(initialEntries: string[]) {
  const location = memoryLocation({ path: initialEntries[0] ?? '/' });
  return (
    <Router hook={location.hook}>
      <AppRouter />
    </Router>
  );
}
