import React, { useState } from 'react';
import { NumberTicker } from '../components/addons/NumberTicker';

export const TeaserOne: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div id="integrations" className="section">
      <div className="container centered">
        <div className="teaser-1-wrap">
          <div className="overflow-hidden">
            <div className="text-box s">
              <h1 className="heading h2 white">
                A new path is <span className="accent-text">opening soon.</span>
              </h1>
            </div>
          </div>
          <div className="text-box s">
            <p className="paragraph large white">
              Something truly exciting and innovative is on the horizon - stay tuned for the next big step in project management.
            </p>
            <div className="spacer _16" />
          </div>

          <div className="teaser-video-1-wrap">
            <div
              data-poster-url="/assets/68beb49b27e61761e195cb51_teaser-1-crop-poster-00001.jpg"
              className="teaser-video-1 w-background-video w-background-video-atom"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  backgroundImage:
                    "url('/assets/68beb49b27e61761e195cb51_teaser-1-crop-poster-00001.jpg')",
                }}
              >
                <source src="/assets/68beb49b27e61761e195cb51_teaser-1-crop-transcode.mp4" />
              </video>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="form-block w-form">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="form-wrap">
                  <div className="field-wrap">
                    <label htmlFor="email" className="field-name white">
                      Email
                    </label>
                    <input
                      className="text-field w-input"
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
                    className="button green w-button"
                    value="Join early access"
                  />
                </form>
              ) : (
                <div className="success-message w-form-done" style={{ display: 'block' }}>
                  <div className="text-block">Thank you! Your submission has been received!</div>
                </div>
              )}
            </div>
          </div>

          <div className="signups-wrap">
            <div className="user-avatars-wral">
              <img
                loading="eager"
                src="/assets/68aeb6f92fe9039518894928_testimonial-2-a2fbfe8b70.png"
                alt="user"
                className="customer-avatar overlap green"
              />
              <img
                loading="eager"
                src="/assets/68aeb6f92fe9039518894925_testimonial-1-85d606003a.png"
                alt="user"
                className="customer-avatar overlap green"
              />
              <img
                loading="eager"
                src="/assets/68aeb6f92fe903951889492e_testimonial-3-795decde7f.png"
                alt="user"
                className="customer-avatar overlap green"
              />
              <img
                loading="eager"
                src="/assets/68aeb6f92fe903951889492b_user-4-a82b4f515e.png"
                alt="user"
                className="customer-avatar overlap green"
              />
            </div>
            <p className="paragraph small no-magin white-text">
              Join <strong><NumberTicker value={1500} suffix="+" /></strong> early access users{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
