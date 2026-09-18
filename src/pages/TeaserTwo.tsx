import React, { useState } from 'react';

export const TeaserTwo: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div id="testimonials" className="section">
      <div className="wide-container cream bg-image bg-small">
        <div className="container centered">
          <div className="spacer _64" />
          <div className="overflow-hidden">
            <h1 className="heading h2 mobile-centered">Something new on the horizon.</h1>
          </div>
          <div className="text-box s">
            <p className="paragraph large centered">
              We're building the next stage of the journey - and you'll be the first to see it.
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="form-block alternate w-form">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="form-wrap alternate">
                  <div className="field-wrap coming-soon">
                    <input
                      className="text-field no-bottom-margin short w-input"
                      maxLength={256}
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      type="email"
                      id="email"
                      required
                    />
                  </div>
                  <input
                    type="submit"
                    className="button no-bottom-margin w-button"
                    value="Sign up now"
                  />
                </form>
              ) : (
                <div className="success-message w-form-done" style={{ display: 'block' }}>
                  <div className="text-block">Thank you! Your submission has been received!</div>
                </div>
              )}
            </div>
          </div>

          <div className="coming-soon-text">Coming Soon</div>

          <div className="dashboard-wrap white-border cropped">
            <img
              src="/assets/68b17368b29db635be2d2b58_0bc9048c77c347a1d758e8373cab62ba_Main-Dashboard-acb9b21a44.avif"
              loading="eager"
              sizes="(max-width: 1440px) 100vw, 1440px"
              srcSet="/assets/68b17368b29db635be2d2b58_0bc9048c77c347a1d758e8373cab62ba_Main-Dashboard-p-500-047dcee606.avif 500w, /assets/68b17368b29db635be2d2b58_0bc9048c77c347a1d758e8373cab62ba_Main-Dashboard-p-800-f33d4aa0b7.avif 800w, /assets/68b17368b29db635be2d2b58_0bc9048c77c347a1d758e8373cab62ba_Main-Dashboard-acb9b21a44.avif 1440w"
              alt=""
              className="dashboard-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
