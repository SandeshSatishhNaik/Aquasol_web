import React, { useState } from 'react';

export const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div id="testimonials" className="section">
      <div className="wide-container cream bg-image mobile-padding">
        <div className="container centered">
          <div className="spacer _64" />
          <div className="text-box l">
            <h1 className="heading h2 centered">Voices from the Trail.</h1>
          </div>
          <div className="text-box s">
            <p className="paragraph large centered">See how other teams found their path to smoother projects.</p>
          </div>
          <div className="spacer _32" />

          {/* Testimonials Slider */}
          <div data-delay="4000" data-animation="slide" className="slider w-slider">
            <div className="mask w-slider-mask" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  width: `${totalSlides * 100}%`,
                  transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                  transition: 'transform 0.5s ease',
                }}
              >
                {/* Slide 1 */}
                <div className="w-slide" style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}>
                  <div className="outer-wrap">
                    <div className="testimonial-wrap">
                      <div className="text-box m extra-padding">
                        <h1 className="heading h5 no-top-margin">
                          This platform keeps our team aligned from day one of every project. Before, we wasted hours chasing updates across emails and spreadsheets. Now, everything is mapped out in one clear roadmap that&#39;s easy to follow.{' '}
                        </h1>
                        <div className="spacer _32 mobile-hidden" />
                        <div className="name-title-wrap">
                          <p className="paragraph no-margin">Daniel Carter / Operations Manager</p>
                        </div>
                      </div>
                      <div className="cutout-shape-wrap testimonial mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape bottom" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape top-left" />
                      </div>
                      <div className="cutout-shape-wrap testimonial bottom-left mobile-size mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape second" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape first" />
                        <img loading="lazy" src="/assets/68b55255c6bc26fb514c26e5_quatation-mark-fb0f2a2ac7.svg" alt="" className="quotes" />
                      </div>
                      <img loading="lazy" src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg" alt="" className="logo-mark top-left" />
                      <img loading="eager" src="/assets/68b5626ee534d02c268b1b26_testimonial-2-8a0bb6aeff.avif" alt="" className="testimonial-avatar bottom-right" />
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="w-slide" style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}>
                  <div className="outer-wrap">
                    <div className="testimonial-wrap">
                      <div className="text-box m extra-padding">
                        <h1 className="heading h5 no-top-margin">
                          Deadlines used to feel overwhelming, especially as our projects grew in size and complexity. With this platform, every milestone is broken down into manageable steps, and we can track progress in real time.
                        </h1>
                        <div className="spacer _32" />
                        <div className="name-title-wrap">
                          <p className="paragraph no-margin">Sarah Norman / Creative Director</p>
                        </div>
                      </div>
                      <div className="cutout-shape-wrap testimonial mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape bottom" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape top-left" />
                      </div>
                      <div className="cutout-shape-wrap testimonial bottom-left mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape second" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape first" />
                        <img loading="lazy" src="/assets/68b55255c6bc26fb514c26e5_quatation-mark-fb0f2a2ac7.svg" alt="" className="quotes" />
                      </div>
                      <img loading="lazy" src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg" alt="" className="logo-mark top-left" />
                      <img loading="lazy" src="/assets/68b553a82bb82a30cbd195a6_testimonial-1-cacab22ca2.png" alt="" className="testimonial-avatar bottom-right" />
                    </div>
                  </div>
                </div>

                {/* Slide 3 */}
                <div className="w-slide" style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}>
                  <div className="outer-wrap">
                    <div className="testimonial-wrap">
                      <div className="text-box m extra-padding">
                        <h1 className="heading h5 no-top-margin">
                          It&#39;s the only tool that made collaboration enjoyable for our team. Tasks, progress, and updates are all in one dashboard, so nobody feels left out. I Finally feel in sync.{' '}
                        </h1>
                        <div className="spacer _32" />
                        <div className="name-title-wrap">
                          <p className="paragraph no-margin">Jessica Sower / Marketing Manager</p>
                        </div>
                      </div>
                      <div className="cutout-shape-wrap testimonial mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape bottom" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape top-left" />
                      </div>
                      <div className="cutout-shape-wrap testimonial bottom-left mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape second" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape first" />
                        <img loading="lazy" src="/assets/68b55255c6bc26fb514c26e5_quatation-mark-fb0f2a2ac7.svg" alt="" className="quotes" />
                      </div>
                      <img loading="lazy" src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg" alt="" className="logo-mark top-left" />
                      <img loading="lazy" src="/assets/68b56929687bc6a168918d20_testimonial-3-198d3acda6.avif" alt="" className="testimonial-avatar bottom-right" />
                    </div>
                  </div>
                </div>

                {/* Slide 4 */}
                <div className="w-slide" style={{ width: `${100 / totalSlides}%`, flexShrink: 0 }}>
                  <div className="outer-wrap">
                    <div className="testimonial-wrap">
                      <div className="text-box m extra-padding">
                        <h1 className="heading h5 no-top-margin">
                          Our productivity has doubled since switching to this platform. The visual roadmap gives clarity at every step, so everyone from leadership to interns knows where the project stands. We no longer waste time second-guessing priorities or chasing updates.{' '}
                        </h1>
                        <div className="spacer _32" />
                        <div className="name-title-wrap">
                          <p className="paragraph no-margin">Marcus Allen / CEO &amp; Founding Partner</p>
                        </div>
                      </div>
                      <div className="cutout-shape-wrap testimonial mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape bottom" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape top-left" />
                      </div>
                      <div className="cutout-shape-wrap testimonial bottom-left mobile-hidden">
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape second" />
                        <img loading="lazy" src="/assets/68b54f64ea77044cbf19995b_corner-shape-cream-6d74a2e900.svg" alt="" className="corner-shape first" />
                        <img loading="lazy" src="/assets/68b55255c6bc26fb514c26e5_quatation-mark-fb0f2a2ac7.svg" alt="" className="quotes" />
                      </div>
                      <img loading="lazy" src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg" alt="" className="logo-mark top-left" />
                      <img loading="lazy" src="/assets/68b569ab3f3c2a85d83bd475_testimonial-4-69f76e999a.avif" alt="" className="testimonial-avatar bottom-right" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Arrow Controls */}
            <div
              className="left-arrow w-slider-arrow-left"
              onClick={prevSlide}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              aria-label="Previous testimonial slide"
            >
              <img loading="lazy" src="/assets/691f5d3cd2de474aac34c356_d18439d31abe34842bd33a8cabd670b7_hand-drawn-arrow-7f7de71b2f.svg" alt="" className="arrow flipped" />
            </div>
            <div
              className="right-arrow w-slider-arrow-right"
              onClick={nextSlide}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              aria-label="Next testimonial slide"
            >
              <img loading="lazy" src="/assets/691f5d3cd2de474aac34c356_d18439d31abe34842bd33a8cabd670b7_hand-drawn-arrow-7f7de71b2f.svg" alt="" className="arrow" />
            </div>

            {/* Slide Navigation Dots */}
            <div className="slide-nav w-slider-nav w-round">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-slider-dot ${currentSlide === idx ? 'w-active' : ''}`}
                  style={{ cursor: 'pointer', display: 'inline-block' }}
                />
              ))}
            </div>
          </div>

          <div className="spacer _64 mobile-hidden" />
          <div className="spacer _64" />

          {/* Social Proof Logos */}
          <div className="overflow-hidden">
            <div data-w-id="0ad5cca5-36b1-a393-5123-bc736b463092" className="text-box l">
              <h2 className="heading h4 mobile-centered">You&#39;re in good company.</h2>
            </div>
          </div>
          <div className="text-box s">
            <p data-w-id="6ffe576d-9191-67f5-aa38-58dd482189d3" className="paragraph large centered">
              Join the growing list of teams already using our platform every day.
            </p>
          </div>
          <div className="spacer _32" />
          <div className="placeholder-logos-wrap">
            <div className="left-gradient" />
            <div className="right-gradient" />
            <div className="logos-grid-wrap">
              <div className="w-layout-grid _10-1-grid">
                <img loading="lazy" src="/assets/68b573c366157f9f5c903ca2_placeholder-7-9a046f5c41.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b573f7a9aef3ef2ed5dd75_placeholder-8-c0bb8c49e0.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b57451f7c68a70370650e5_placeholder-9-de2d5eda1b.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b5746992d2b3414c11632b_placeholder-10-0758a83b5c.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b57367dcaa8695e8b127d2_placeholder-6-23dc7f0abe.svg" alt="" className="placeholder-logo" />
              </div>
              <div className="w-layout-grid _10-1-grid">
                <img loading="lazy" src="/assets/68b573c366157f9f5c903ca2_placeholder-7-9a046f5c41.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b573f7a9aef3ef2ed5dd75_placeholder-8-c0bb8c49e0.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b57451f7c68a70370650e5_placeholder-9-de2d5eda1b.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b5746992d2b3414c11632b_placeholder-10-0758a83b5c.svg" alt="" className="placeholder-logo" />
                <img loading="lazy" src="/assets/68b57367dcaa8695e8b127d2_placeholder-6-23dc7f0abe.svg" alt="" className="placeholder-logo" />
              </div>
            </div>
          </div>
          <div className="spacer _64" />
        </div>
      </div>
    </div>
  );
};
