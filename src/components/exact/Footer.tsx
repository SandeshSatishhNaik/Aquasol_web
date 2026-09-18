import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="footer">
      <div data-w-id="7b803fd5-5ff2-3318-1ab7-ed611934620d" className="wide-container green">
        <div className="spacer _32" />
        <div className="container">
          <div className="w-layout-grid footer-links-grid">
            <div className="text-wrap">
              <a
                href="#hero"
                onClick={(e) => handleNav(e, 'landing')}
                className="footer-logo-link w-inline-block w--current"
                style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <img
                  src="/assets/aquasol-lockup-white.png"
                  loading="lazy"
                  alt="AquaSol"
                  className="footer-logo"
                  style={{ height: '42px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </a>
              <div className="footer-button-wrap">
                <a
                  data-wf--button--variant="dark"
                  href="https://webflow.com/templates/designers/toms-stals"
                  target="_blank"
                  rel="noreferrer"
                  className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
                >
                  <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">
                    More templates
                  </div>
                  <img
                    src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                    loading="lazy"
                    alt=""
                    className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                  />
                </a>
              </div>
            </div>

            <div id="w-node-_8d9cf31f-cebe-2c52-f947-e6c5cce15032-cce15025" className="footer-links-col">
              <h4 className="footer-col-heading">Pages</h4>
              <a
                href="#hero"
                onClick={(e) => handleNav(e, 'landing')}
                className="navigation-link w-inline-block w--current"
              >
                <div className="link-text">Landing Page</div>
              </a>
              <a
                href="#teaser-1"
                onClick={(e) => handleNav(e, 'teaser-1')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Teaser 1</div>
              </a>
              <a
                href="#teaser-2"
                onClick={(e) => handleNav(e, 'teaser-2')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Teaser 2</div>
              </a>
            </div>

            <div id="w-node-_8d9cf31f-cebe-2c52-f947-e6c5cce1503f-cce15025" className="footer-links-col">
              <h4 className="footer-col-heading">Admin</h4>
              <a
                href="#style-guide"
                onClick={(e) => handleNav(e, 'style-guide')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Style Guide</div>
              </a>
              <a
                href="#licensing"
                onClick={(e) => handleNav(e, 'licensing')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Licensing</div>
              </a>
              <a
                href="#template-guide"
                onClick={(e) => handleNav(e, 'template-guide')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Template Guide</div>
              </a>
              <a
                href="#change-log"
                onClick={(e) => handleNav(e, 'change-log')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Change Log</div>
              </a>
              <a
                href="#password"
                onClick={(e) => handleNav(e, 'password')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">Password</div>
              </a>
              <a
                href="#404"
                onClick={(e) => handleNav(e, 'not-found')}
                className="navigation-link w-inline-block"
              >
                <div className="link-text">404</div>
              </a>
            </div>

            <div id="w-node-_8d9cf31f-cebe-2c52-f947-e6c5cce1505b-cce15025" className="footer-links-col">
              <h4 className="footer-col-heading">Social</h4>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="navigation-link w-inline-block">
                <div className="link-text">Instagram</div>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="navigation-link w-inline-block">
                <div className="link-text">Facebook</div>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="navigation-link w-inline-block">
                <div className="link-text">Youtube</div>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="navigation-link w-inline-block">
                <div className="link-text">Linkedin</div>
              </a>
              <a href="https://x.com/tomsdesign_" target="_blank" rel="noreferrer" className="navigation-link w-inline-block">
                <div className="link-text">X</div>
              </a>
            </div>
          </div>

          <div className="credits-wrap">
            <h1 className="logo-heading">AquaSol</h1>
            <p className="paragraph">
              Made by{' '}
              <a href="http://tomsweb.site" target="_blank" rel="noreferrer" className="copyrights-link">
                Toms Stals
              </a>{' '}
              I Powered by{' '}
              <a href="https://webflow.com/" target="_blank" rel="noreferrer" className="copyrights-link">
                Webflow
              </a>
            </p>
          </div>
        </div>
        <div className="spacer _32" />
      </div>
    </div>
  );
};
