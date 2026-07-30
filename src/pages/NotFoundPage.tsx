import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { AppShell } from '@/app/AppShell';

export function NotFoundPage() {
  return <AppShell><div className="not-found"><span>404 · Off the ledger</span><h1>This account view does not exist.</h1><p>Return to your overview to keep everything in view.</p><Link href="/"><ArrowLeft size={16} /> Back to overview</Link></div></AppShell>;
}
