import React, { useState } from 'react';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'landing', onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (onNavigate && currentPage !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const id = href.replace(/^(\.\/#|#)/, '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const id = href.replace(/^(\.\/#|#)/, '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div data-w-id="677ce8dc-20c3-795f-1d3a-dd0f52d52492" className="header sticky">
      <div className="container">
        <div className="navigation-wrapper">
          <div className="navigation">
            <div id="w-node-_677ce8dc-20c3-795f-1d3a-dd0f52d52496-52d52492" className="navigation-left">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="logo-link w-inline-block w--current"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <img
                  src="/assets/aquasol-lockup-dark.png"
                  loading="eager"
                  alt="AquaSol"
                  className="header-logo"
                  style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </a>
            </div>

            <div className="navigation-middle">
              <div className="links-wrap">
                <a
                  href="#problem"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#problem'); }}
                  className="navigation-link no-margin w-inline-block"
                >
                  <div className="link-text">Problem</div>
                </a>
                <a
                  href="#solution"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#solution'); }}
                  className="navigation-link no-margin w-inline-block"
                >
                  <div className="link-text">Solution</div>
                </a>
                <a
                  href="#product"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#product'); }}
                  className="navigation-link no-margin w-inline-block"
                >
                  <div className="link-text">Product</div>
                </a>
                <a
                  href="#about"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }}
                  className="navigation-link no-margin w-inline-block"
                >
                  <div className="link-text">About</div>
                </a>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="navigation-link no-margin w-inline-block"
                >
                  <div className="link-text">Contact</div>
                </a>

              </div>
            </div>

            <div id="w-node-_677ce8dc-20c3-795f-1d3a-dd0f52d52499-52d52492" className="navigation-right">
              <nav className="navigation-menu">
                <div className="navbar-button-wrap">
                  <a
                    data-wf--button--variant="dark"
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                    className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
                  >
                    <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">Contact us</div>
                    <img
                      src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                      loading="lazy"
                      alt=""
                      className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                    />
                  </a>
                </div>
              </nav>

              <div
                className="mobile-menu-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ cursor: 'pointer' }}
              >
                <div className="burger-menu">
                  <div className="bar-1" style={mobileOpen ? { transform: 'translateY(6px) rotate(45deg)' } : {}} />
                  <div className="bar-2" style={mobileOpen ? { opacity: 0 } : {}}>
                    <div className="bar-1-middle" />
                  </div>
                  <div className="bar-3" style={mobileOpen ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className="mobile-menu"
          style={{ display: mobileOpen ? 'block' : 'none', opacity: 1, transition: 'all 0.3s' }}
        >
          <div className="mobile-menu-wrapper">
            <div className="mobile-menu-navigation">
              <a
                href="#problem"
                onClick={(e) => { e.preventDefault(); handleNavClick('#problem'); }}
                className="mobile-menu-link w-inline-block"
              >
                <div className="mobile-link-text">Problem</div>
              </a>
              <a
                href="#solution"
                onClick={(e) => { e.preventDefault(); handleNavClick('#solution'); }}
                className="mobile-menu-link w-inline-block"
              >
                <div className="mobile-link-text">Solution</div>
              </a>
              <a
                href="#product"
                onClick={(e) => { e.preventDefault(); handleNavClick('#product'); }}
                className="mobile-menu-link w-inline-block"
              >
                <div className="mobile-link-text">Product</div>
              </a>
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }}
                className="mobile-menu-link w-inline-block"
              >
                <div className="mobile-link-text">About</div>
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                className="mobile-menu-link w-inline-block"
              >
                <div className="mobile-link-text">Contact</div>
              </a>

              {onNavigate && (
                <div style={{ marginTop: 12, marginBottom: 12 }}>
                  <select
                    value={currentPage}
                    onChange={(e) => {
                      onNavigate(e.target.value);
                      setMobileOpen(false);
                    }}
                    className="page-switch-select"
                    style={{ width: '100%' }}
                  >
                    <option value="landing">Landing Page</option>
                    <option value="teaser-1">Teaser 1</option>
                    <option value="teaser-2">Teaser 2</option>
                    <option value="style-guide">Style Guide</option>
                    <option value="licensing">Licensing</option>
                    <option value="not-found">404</option>
                  </select>
                </div>
              )}

              <div className="mobile-menu-buttons-wrap">
                <a
                  data-wf--button--variant="base"
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                  className="button-wrap w-inline-block w--current"
                >
                  <div className="button-text">Contact us</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image" />
                </a>
                <a
                  data-wf--button--variant="outline"
                  href="admin-licensing.html"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('licensing');
                    setMobileOpen(false);
                  }}
                  className="button-wrap w-variant-486b2865-bdcd-be19-167e-94f873d72fb3 w-inline-block"
                >
                  <div className="button-text">Learn more</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
