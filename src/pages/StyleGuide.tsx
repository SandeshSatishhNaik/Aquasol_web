import React from 'react';

export const StyleGuide: React.FC = () => {
  return (
    <div className="sg-body">
      <div className="sg-content">
        <div className="wrapper">
          <div className="sg-section header">
            <div className="text-box m">
              <div className="overflow-hidden">
                <h1 className="heading h2">Style Guide</h1>
              </div>
            </div>
          </div>

          {/* Typography */}
          <section id="Typography" className="sg-section">
            <div className="ds-section-header">
              <h2 className="sg-title">Typography</h2>
              <p className="sg-description">The different text sizes used throughout the site.</p>
            </div>
            <div className="text-box l">
              <div className="sg-block">
                <h3 className="sg-label">h1</h3>
                <h1 className="heading h1">This is a Header.</h1>
              </div>
              <div className="sg-block">
                <h2 className="sg-label">h2</h2>
                <h2 className="heading h2">This is a Header.</h2>
              </div>
              <div className="sg-block">
                <h2 className="sg-label">h3</h2>
                <h3 className="heading h3">This is a Header.</h3>
              </div>
              <div className="sg-block">
                <h2 className="sg-label">h4</h2>
                <h4 className="heading h4">This is a Header.</h4>
              </div>
              <div className="sg-block">
                <h2 className="sg-label">h5</h2>
                <h5 className="heading h5">This is a Header</h5>
              </div>
              <div className="sg-block">
                <h2 className="sg-label">h6</h2>
                <h6 className="heading h6">This is a Header</h6>
              </div>
              <div className="spacer _48" />
              <div className="sg-block">
                <h5 className="sg-label">Large Paragraph</h5>
                <p className="paragraph large">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="sg-block">
                <h5 className="sg-label">Paragraph</h5>
                <p className="paragraph">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="sg-block">
                <h5 className="sg-label">Small Paragraph</h5>
                <p className="paragraph small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="sg-block">
                <h5 className="sg-label">Quote</h5>
                <blockquote className="block-quote">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </blockquote>
              </div>
            </div>
            <div className="horizontal-line design-system" />
          </section>

          {/* Colors */}
          <section id="Colours" className="sg-section">
            <div className="ds-section-header">
              <h3 className="sg-title">Colors</h3>
              <p className="sg-description">The different weights of greys and colours used throughout the website.</p>
            </div>
            <div className="ds-colour-grid">
              <div className="ds-colour-block">
                <div className="color-block dark-grey" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block grey" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block light-grey" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block soft-grey" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block silver" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block back-grey" />
                <div className="spacer _24" />
              </div>
              <div className="ds-colour-block">
                <div className="color-block white" />
                <div className="spacer _24" />
              </div>
            </div>
            <div className="horizontal-line design-system" />
          </section>

          {/* Buttons */}
          <div id="Buttons" className="sg-section">
            <div className="ds-section-header">
              <h3 className="sg-title">Buttons</h3>
              <p className="sg-description">The different types of buttons used throughout the website.</p>
            </div>
            <div className="_12-columns align-left">
              <div className="column desk-4">
                <h3 className="sg-label">Primary</h3>
                <a data-wf--button--variant="base" href="#Buttons" className="button-wrap w-inline-block">
                  <div className="button-text">Get started</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image" />
                </a>
              </div>
              <div className="column desk-4">
                <h3 className="sg-label">DARK</h3>
                <a data-wf--button--variant="dark" href="#Buttons" className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block">
                  <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">Get started</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2" />
                </a>
              </div>
              <div className="column desk-4">
                <h3 className="sg-label">Light</h3>
                <a data-wf--button--variant="light" href="#Buttons" className="button-wrap w-variant-6469cb50-26d0-1dd1-7436-c9d960826821 w-inline-block">
                  <div className="button-text">Get started</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image" />
                </a>
              </div>
              <div className="column desk-4">
                <h3 className="sg-label">Outline</h3>
                <a data-wf--button--variant="outline" href="#Buttons" className="button-wrap w-variant-486b2865-bdcd-be19-167e-94f873d72fb3 w-inline-block">
                  <div className="button-text">Get started</div>
                  <img src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg" loading="lazy" alt="" className="image" />
                </a>
              </div>
            </div>
            <div className="horizontal-line design-system" />
          </div>

          <div id="Footer" className="sg-section">
            <p className="paragraph">
              © Style Guide for Trailbase. Powered by{' '}
              <a href="https://www.webflow.com" target="_blank" rel="noreferrer" className="text-link">
                Webflow
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
