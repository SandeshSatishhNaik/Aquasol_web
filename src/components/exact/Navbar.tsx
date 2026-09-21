import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { scrollToId } from '../../lib/scrollToId';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const NAV_LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#product', label: 'Product' },
  { href: '#tech', label: 'Tech stack' },
  { href: '#roadmap', label: 'Roadmap' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'landing', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // A sentinel pinned to the top of the document replaces a scroll listener: the observer
  // only fires when the page crosses the 8px threshold, instead of on every scroll frame.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [mobileOpen]);

  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';


  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace(/^(\.\/#|#)/, '');
    if (onNavigate && currentPage !== 'landing') {
      onNavigate('landing');
      setTimeout(() => scrollToId(id), 100);
    } else {
      scrollToId(id);
    }
  };

  return (
    <>
    <div
      ref={sentinelRef}
      aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '8px', pointerEvents: 'none' }}
    />
    <header data-w-id="677ce8dc-20c3-795f-1d3a-dd0f52d52492" className={`header sticky${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container">
        <div className="navigation-wrapper">
          <div className="navigation">
            <div id="w-node-_677ce8dc-20c3-795f-1d3a-dd0f52d52496-52d52492" className="navigation-left">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('landing');
                  window.scrollTo({ top: 0, behavior: scrollBehavior() });
                }}
                className="logo-link w-inline-block w--current"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <img
                  src="/assets/aquasol-lockup-dark-2x.png"
                  width="308"
                  height="72"
                  loading="eager"
                  alt="AquaSol"
                  className="header-logo"
                  style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </a>
            </div>

            <div className="navigation-middle">
              <nav className="links-wrap" aria-label="Primary">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                    className="navigation-link no-margin w-inline-block"
                  >
                    <div className="link-text">{l.label}</div>
                  </a>
                ))}
              </nav>
            </div>

            <div id="w-node-_677ce8dc-20c3-795f-1d3a-dd0f52d52499-52d52492" className="navigation-right">
              <div className="navigation-menu">
                <div className="navbar-button-wrap">
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                    className="aq-cta"
                  >
                    <span>Contact us</span>
                    <span className="aq-cta-icon" aria-hidden="true">
                      <ArrowRight size={15} strokeWidth={2.6} />
                    </span>
                  </a>
                </div>
              </div>

              <div className="mobile-menu-toggle">
                <button
                  type="button"
                  className="burger-menu"
                  ref={burgerRef}
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  style={{ cursor: 'pointer', padding: 0, border: 0 }}
                >
                  <div className="bar-1" style={mobileOpen ? { transform: 'translateY(6px) rotate(45deg)' } : {}} />
                  <div className="bar-2" style={mobileOpen ? { opacity: 0 } : {}}>
                    <div className="bar-1-middle" />
                  </div>
                  <div className="bar-3" style={mobileOpen ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          id="mobile-menu"
          className="mobile-menu aq-drawer"
          data-open={mobileOpen}
          ref={drawerRef}
          inert={!mobileOpen}
        >
          <div className="mobile-menu-wrapper">
            <nav className="mobile-menu-navigation" aria-label="Mobile">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                  className="mobile-menu-link w-inline-block"
                >
                  <div className="mobile-link-text">{l.label}</div>
                </a>
              ))}

              <div className="mobile-menu-buttons-wrap">
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="aq-cta"
                >
                  <span>Contact us</span>
                  <span className="aq-cta-icon" aria-hidden="true">
                    <ArrowRight size={15} strokeWidth={2.6} />
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};
