import React from 'react';

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
  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.('landing');
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  };

  return (
    <footer className="aq-foot">
      <div className="aq-foot-grid">
        <div>
          <a href="#hero" onClick={goHome} className="aq-foot-logo">
            <img src="/assets/aquasol-lockup-white.png" width="851" height="199" loading="lazy" alt="AquaSol" />
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
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="aq-foot-base">
        <p>AquaSol — Intelligence in Every Drop.</p>
        <p>SIH 2026 prototype, problem statement SIH26180.</p>
      </div>
    </footer>
  );
};
