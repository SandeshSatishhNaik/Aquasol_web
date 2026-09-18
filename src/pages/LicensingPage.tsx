import React from 'react';

export const LicensingPage: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="overlay-hidden">
          <h1 className="heading h2">Licensing</h1>
        </div>
        <div className="text-box m">
          <p className="paragraph large">
            All graphical assets in this template are licensed for personal and commercial use. If you’d like to use a specific asset, please check the license below.
          </p>
        </div>
        <div className="spacer _32" />
        <div className="w-layout-grid _2-2-grid">
          <div className="credentials-card-wrap">
            <h2 className="heading h4">Images</h2>
            <div className="w-layout-grid _2-2-grid full-width">
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Pexels</p>
                <a href="https://www.pexels.com/license/" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Figma Community</p>
                <a href="https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Midjourney</p>
                <a href="https://docs.midjourney.com/docs/terms-of-service" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
            </div>
          </div>

          <div className="credentials-card-wrap">
            <div className="text-box s">
              <h2 className="heading h4">Fonts (Switzer Variable &amp; Inter Tight)</h2>
            </div>
            <div className="w-layout-grid _2-2-grid full-width">
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Google Fonts</p>
                <a href="https://fonts.google.com/knowledge/glossary/licensing" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Fontshare</p>
                <a href="https://www.fontshare.com/licenses/sil-ofl" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
            </div>
          </div>

          <div className="credentials-card-wrap">
            <h2 className="heading h4">Icons</h2>
            <div className="credit-details-wrap">
              <div className="detail-wrap">
                <p className="paragraph large no-margin">Phosphor Icons</p>
                <a href="https://github.com/phosphor-icons/web/blob/master/LICENSE" target="_blank" rel="noreferrer" className="license-link">
                  Licensing
                </a>
              </div>
            </div>
          </div>

          <div className="credentials-card-wrap">
            <h2 className="heading h4">Have feedback?</h2>
            <div className="credit-details-wrap">
              <div className="detail-wrap">
                <div className="text-box s">
                  <p className="paragraph large">Share your experience using our template, by filling the survey!</p>
                </div>
                <div className="feedback-button-wrap">
                  <a
                    data-wf--button--variant="base"
                    href="https://tally.so/r/mDEqaj"
                    target="_blank"
                    rel="noreferrer"
                    className="button-wrap w-inline-block"
                  >
                    <div className="button-text">Leave Feedback</div>
                    <img
                      src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                      loading="lazy"
                      alt=""
                      className="image"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
