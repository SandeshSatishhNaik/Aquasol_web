import React from 'react';
import { Button } from './ui/Button';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#192823] text-[#f6f4ee] pt-16 pb-12 rounded-t-[2.5rem] mt-16 md:mt-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Logo & Template CTA */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start gap-6">
            <button
              onClick={() => {
                onNavigate('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-none cursor-pointer text-left"
              aria-label="Back to top"
            >
              <img
                src="/assets/691f0c59b6644b74c328905b_4fae3279a1e09495c9bf181a9af5fd6f_light-mark-logo-08fc212810.svg"
                alt="Trailbase"
                className="h-10 w-auto"
              />
            </button>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed">
              A modern SaaS platform designed for project management, journey roadmaps, and confident team alignment.
            </p>
            <Button
              variant="dark"
              href="https://webflow.com/templates/designers/toms-stals"
              className="bg-[#101e19] border border-white/20 text-xs py-2 px-4"
            >
              More templates
            </Button>
          </div>

          {/* Pages Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Pages
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Landing Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('teaser-1');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Teaser 1
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('teaser-2');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Teaser 2
                </button>
              </li>
            </ul>
          </div>

          {/* Admin Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Admin & System
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => {
                    onNavigate('style-guide');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Style Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('licensing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Licensing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('not-found');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  404 Error
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a
                  href="https://x.com/tomsdesign_"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Giant Brand Wordmark & Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-baseline justify-between gap-4">
          <span className="font-['Bricolage_Grotesque'] text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white/90 lowercase">
            trailbase
          </span>
          <div className="text-xs text-white/60 space-y-1 md:text-right">
            <p>
              Original Webflow template by{' '}
              <a
                href="http://tomsweb.site"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white transition-colors"
              >
                Toms Stals
              </a>{' '}
              • React &amp; Tailwind Replica
            </p>
            <p>© {new Date().getFullYear()} Trailbase. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
