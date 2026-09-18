import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div id="contact" className="section">
      <div className="wide-container cream bg-image">
        <div className="container">
          <div className="spacer _32" />
          <div className="w-layout-grid grid mobile-1-col">
            <div className="contact-col-left-wrap">
              <h1 className="heading h2">Let's map it out.</h1>
              <div className="text-box s">
                <p className="paragraph large">
                  Every journey needs a guide. Whether you're just starting out or aiming for the summit, we're here to help you find the path forward.
                </p>
              </div>
              <div className="spacer _16" />
              <div className="contact-form-block w-form">
                {!submitted ? (
                  <form
                    id="wf-form-Message"
                    name="wf-form-Message"
                    data-name="Message"
                    onSubmit={handleSubmit}
                    className="form-wrap"
                  >
                    <label htmlFor="name" className="field-name">
                      Name
                    </label>
                    <div className="field-wrap">
                      <input
                        className="text-field w-input"
                        maxLength={256}
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        type="text"
                        id="name"
                      />
                    </div>
                    <div className="field-wrap">
                      <label htmlFor="email" className="field-name">
                        Email
                      </label>
                      <input
                        className="text-field w-input"
                        maxLength={256}
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your email"
                        type="email"
                        id="email"
                        required
                      />
                    </div>
                    <div className="area-wrap">
                      <label htmlFor="field" className="field-name">
                        Message
                      </label>
                      <textarea
                        placeholder="Message goes here.."
                        maxLength={5000}
                        id="field"
                        name="field"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="text-area w-input"
                      />
                    </div>
                    <input
                      type="submit"
                      data-wait="Please wait..."
                      className="button w-button"
                      value="Submit"
                    />
                  </form>
                ) : (
                  <div className="success-message w-form-done" style={{ display: 'block' }}>
                    <div className="text-block">Thank you! Your submission has been received!</div>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-right-col-wrap">
              <div className="contact-image-wrap">
                <img
                  src="/assets/68ba8ec8f651b2ae80f960fe_ba5500884d46502af729b760c287bb32_contact-image-4008f4fa5b.avif"
                  loading="eager"
                  sizes="(max-width: 479px) 100vw, 49vw"
                  srcSet="/assets/68ba8ec8f651b2ae80f960fe_ba5500884d46502af729b760c287bb32_contact-image-p-500-84ad04cd88.avif 500w, /assets/68ba8ec8f651b2ae80f960fe_ba5500884d46502af729b760c287bb32_contact-image-4008f4fa5b.avif 1024w"
                  alt=""
                  className="contact-image"
                />
                <img
                  src="/assets/68ba9a7a825a0321bef7f539_contact-graph-2-9ebb8ef66b.svg"
                  loading="eager"
                  alt=""
                  className="contact-graph-2"
                />
                <img
                  src="/assets/68ba96bb5377bdddf1fa26ad_2c705921994c7bc05a2108938c122481_contact-graph-1-90aeb7c403.svg"
                  loading="eager"
                  alt=""
                  className="contact-graph-1"
                />
                <div className="logo-mark-square-wrap">
                  <img
                    src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
                    loading="eager"
                    alt=""
                    className="logo-mark"
                  />
                </div>
                <img
                  className="contact-graph-3"
                  src="/assets/68baa317a9f5ee09be2d988c_faffe888364f1b13094c1a424f997e58_contact-graph-3-0da7404b17.avif"
                  alt=""
                  sizes="(max-width: 479px) 100vw, 49vw"
                  loading="eager"
                  srcSet="/assets/68baa317a9f5ee09be2d988c_faffe888364f1b13094c1a424f997e58_contact-graph-3-p-500-0909cc16cb.avif 500w, /assets/68baa317a9f5ee09be2d988c_faffe888364f1b13094c1a424f997e58_contact-graph-3-0da7404b17.avif 700w"
                />
              </div>
            </div>
          </div>
          <div className="spacer _32" />
        </div>
      </div>
    </div>
  );
};
