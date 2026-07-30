import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PropsWithChildren } from 'react';
import { BarChart3, Bell, BriefcaseBusiness, Building2, CreditCard, Home, Landmark, Menu, Search, ShieldCheck, Sparkles, WalletCards, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const navigation = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/manage/cash', label: 'Cash', icon: Landmark },
  { href: '/manage/investments', label: 'Investments', icon: BarChart3 },
  { href: '/manage/subscriptions', label: 'Subscriptions', icon: WalletCards },
  { href: '/manage/property', label: 'Property', icon: Building2 },
  { href: '/manage/credit', label: 'Credit', icon: CreditCard },
  { href: '/manage/insurance', label: 'Protection', icon: ShieldCheck },
  { href: '/manage/business', label: 'Business', icon: BriefcaseBusiness },
];

export function AppShell({ children }: PropsWithChildren) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    menuCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      menuTriggerRef.current?.focus();
    };
  }, [menuOpen]);

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    menuTriggerRef.current = event.currentTarget;
    setMenuOpen(true);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="side-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark" aria-label="Ledger overview">
          <Sparkles size={22} aria-hidden="true" />
          <span>Ledger</span>
        </Link>
        <nav>
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={location === href ? 'active' : ''} aria-current={location === href ? 'page' : undefined}>
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="side-nav__profile">
          <span className="avatar">MB</span>
          <div><strong>Maya Brooks</strong><small>Personal workspace</small></div>
        </div>
      </aside>
      <div className="app-frame">
        <header className="topbar">
          <Link href="/" className="mobile-brand"><Sparkles size={18} /> Ledger</Link>
          <label className="global-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search your finances</span>
            <input placeholder="Search your finances" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="topbar__actions">
            <span className="sync-pill"><i /> All accounts synced</span>
            <button type="button" className="icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button>
            <button type="button" className="icon-button mobile-menu" aria-label="Open menu" onClick={openMenu}><Menu size={20} /></button>
          </div>
        </header>
        <main id="main-content">{children}</main>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={location === href ? 'active' : ''}>
            <Icon size={20} aria-hidden="true" /><span>{label}</span>
          </Link>
        ))}
        <button type="button" onClick={openMenu}><Menu size={20} /><span>More</span></button>
      </nav>
      {menuOpen && (
        <div className="mobile-drawer-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}>
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="All financial sections">
            <div className="mobile-drawer__head"><div><span>Navigate</span><strong>Every financial section</strong></div><button ref={menuCloseRef} type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
            <nav aria-label="All sections">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={location === href ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                  <Icon size={20} aria-hidden="true" /><span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
