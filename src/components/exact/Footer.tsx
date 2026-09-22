import React, { useEffect, useRef } from 'react';
import { scrollToId } from '../../lib/scrollToId';
import { scrollTo } from '../../lib/smoothScroll';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#product', label: 'Product' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('landing');
    scrollTo(0);
  };

  // The curtain reveal (index.css) scrubs the giant wordmark over exactly the last footer-height of
  // scroll, so it rises while the footer is being uncovered, not while still hidden behind the page.
  const foot = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = foot.current;
    if (!el) return;
    const root = document.documentElement;
    const HEADER = 96; // the sticky header plus a little air
    const measure = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      root.style.setProperty('--foot-h', `${h}px`);
      // Curtain only when the whole footer fits below the header (see index.css).
      if (h <= window.innerHeight - HEADER) root.setAttribute('data-curtain', '');
      else root.removeAttribute('data-curtain');
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      root.removeAttribute('data-curtain');
    };
  }, []);

  return (
    <footer ref={foot} className="aq-foot">
      <div className="aq-foot-grid">
        <div>
          <a href="#hero" onClick={goHome} className="aq-foot-logo">
            <img src="/assets/aquasol-lockup-footer-2x.png" width="242" height="80" loading="lazy" alt="AquaSol" />
          </a>
          <p className="aq-foot-blurb">
            An IoT smart-irrigation prototype from the Department of Electronics and Communication,
            GM University, Davangere, built for Smart India Hackathon 2026.
          </p>
        </div>

        <nav className="aq-foot-nav" aria-label="Footer">
          <h2>Explore</h2>
          <ul className="aq-foot-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('landing');
                    scrollToId(l.href.slice(1));
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Decorative: the brand name is already the logo's alt text above. */}
      <div className="aq-foot-mark" aria-hidden="true">
        <span>AquaSol</span>
      </div>

      <div className="aq-foot-base">
        <p>AquaSol — Intelligence in Every Drop.</p>
        <p>SIH 2026 prototype, problem statement SIH26180.</p>
      </div>
    </footer>
  );
};
