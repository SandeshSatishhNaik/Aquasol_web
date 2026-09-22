import React, { useState } from 'react';
import { Magnetic } from '../motion/Magnetic';
import { ArrowRight } from 'lucide-react';
import { SplitHeading } from '../motion/SplitHeading';
import { Reveal } from '../motion/Reveal';

// The site has no server, so the form hands the message to the visitor's email
// app. Set VITE_CONTACT_EMAIL (in .env or the host's settings) to the inbox that
// should receive it.
const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim();

type Status = 'idle' | 'opened' | 'error';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = formData.message.trim();
    if (!message) {
      setError('Please write a message so we know how to help.');
      setStatus('error');
      return;
    }
    if (!CONTACT_EMAIL) {
      setError('Sending is not connected yet, so your message was not sent. Please try again later.');
      setStatus('error');
      return;
    }
    const name = formData.name.trim();
    const subject = name ? `AquaSol enquiry from ${name}` : 'AquaSol enquiry';
    const body = `${message}

${name ? name + ' ' : ''}<${formData.email.trim()}>`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setError('');
    setStatus('opened');
  };

  return (
    <section id="contact" className="aq-sec aq-sec--sand" aria-labelledby="contact-title">
      <div className="aq-wrap aq-contact">
        <div className="aq-contact-text">
          <SplitHeading as="h2" id="contact-title" className="aq-h2 aq-h2--sm">Let&rsquo;s talk irrigation.</SplitHeading>
          <Reveal delay={220}><p className="aq-lead">
            Questions about AquaSol, or want to request a demo? Send us a message.
          </p></Reveal>

          {status !== 'opened' ? (
            <form onSubmit={handleSubmit} className="aq-form" noValidate>
              <div className="aq-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="aq-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="aq-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  maxLength={1500}
                  placeholder="How can we help?"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  aria-invalid={status === 'error' && !formData.message.trim() ? true : undefined}
                  aria-describedby={status === 'error' ? 'contact-error' : undefined}
                />
              </div>

              {status === 'error' && (
                <p id="contact-error" role="alert" className="contact-form-error">
                  {error}
                </p>
              )}

              <div className="aq-form-actions">
                <Magnetic>
                <button type="submit" className="aq-cta">
                  <span>Send message</span>
                  <span className="aq-cta-icon" aria-hidden="true">
                    <ArrowRight size={15} strokeWidth={2.6} />
                  </span>
                </button>
                </Magnetic>
              </div>
              <p className="contact-form-note">
                This opens your email app with your message ready to send.
              </p>
            </form>
          ) : (
            <div className="contact-form-block">
              <div className="success-message" role="status">
                <div className="text-block">
                  Your email app should have opened with your message. If it did not, write to{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </div>
                <button type="button" className="contact-form-back" onClick={() => setStatus('idle')}>
                  Edit message
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="aq-contact-stage" aria-hidden="true">
          <span className="aq-phone">
            <span className="aq-phone-screen">
              <img
                src="/assets/aquasol-control-center.jpg"
                alt=""
                width="498"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};
