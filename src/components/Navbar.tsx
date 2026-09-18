import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';

export interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const pageOptions = [
    { id: 'landing', label: 'Landing' },
    { id: 'teaser-1', label: 'Teaser 1' },
    { id: 'teaser-2', label: 'Teaser 2' },
    { id: 'style-guide', label: 'Style Guide' },
    { id: 'licensing', label: 'Licensing' },
    { id: 'not-found', label: '404' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f6f4ee]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(25,40,35,0.06)] py-3'
          : 'bg-[#f6f4ee] py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Trailbase Home"
          >
            <img
              src="/assets/691f58a13e66ff1ebb06d29e_header-logo-icon-d0f324988d.svg"
              alt="Logo Icon"
              className="h-8 w-auto transition-transform duration-300 group-hover:rotate-12"
            />
            <img
              src="/assets/691f58ce67a75e9c5988afb8_header-logo-mark-cce09b886b.svg"
              alt="Trailbase"
              className="h-5 w-auto"
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#edebe3]/70 px-4 py-1.5 rounded-full border border-black/[0.04]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-3.5 py-1 text-sm font-medium text-[#192823]/80 hover:text-[#192823] hover:bg-white/60 rounded-full transition-all duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Sub-Page Selector Dropdown Pill */}
            <div className="h-4 w-[1px] bg-black/10 mx-1" />
            <select
              value={currentPage}
              onChange={(e) => onNavigate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#192823]/70 hover:text-[#192823] cursor-pointer px-2 py-1 rounded-full outline-none focus:bg-white/80 transition-all uppercase tracking-wider"
              aria-label="Switch page view"
            >
              {pageOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="text-sm normal-case font-normal">
                  View: {opt.label}
                </option>
              ))}
            </select>
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="dark"
              href="#contact"
              onClick={() => handleLinkClick('#contact')}
              className="hidden sm:inline-flex text-xs md:text-sm px-4 md:px-5 py-2"
            >
              Get started
            </Button>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#edebe3] flex flex-col items-center justify-center gap-1.5 focus:outline-none transition-colors hover:bg-[#e4e1d6]"
              aria-label="Toggle navigation menu"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-[#192823] rounded-full origin-center"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="w-5 h-0.5 bg-[#192823] rounded-full"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-0.5 bg-[#192823] rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-black/[0.08] bg-[#f6f4ee] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className="block text-lg font-medium text-[#192823] hover:text-[#243831] py-1"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-4 border-t border-black/[0.06]">
                <p className="text-xs uppercase font-semibold tracking-wider text-black/50 mb-2">
                  Template Pages
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {pageOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onNavigate(opt.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === opt.id
                          ? 'bg-[#192823] text-white font-medium'
                          : 'bg-black/[0.03] text-[#192823] hover:bg-black/[0.06]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2.5">
                <Button
                  variant="dark"
                  onClick={() => handleLinkClick('#contact')}
                  className="w-full justify-center"
                >
                  Get started
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onNavigate('licensing');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
