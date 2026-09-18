import React from 'react';

export const ChangeLogPage: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="overflow-hidden">
          <h1 className="heading h2">Change Log</h1>
        </div>
        <div className="w-layout-grid grid mobile-1-col left-align">
          <div
            id="w-node-e9c06f63-bb00-c569-b631-0b7b4e9523a3-0181bbb4"
            className="credentials-card-wrap"
          >
            <h2 className="heading h4">Version</h2>
            <div className="w-layout-grid _2-2-grid full-width">
              <div className="detail-wrap">
                <p className="paragraph large no-margin">1.0</p>
                <p className="paragraph">Initial template release</p>
              </div>
            </div>
          </div>
          <div className="credentials-card-wrap">
            <h2 className="heading h4">Have feedback?</h2>
            <div className="credit-details-wrap">
              <div className="detail-wrap">
                <div className="text-box s">
                  <p className="paragraph large">
                    Share your experience using our template, by filling the survey!
                  </p>
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
