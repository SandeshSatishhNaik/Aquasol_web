import React, { useRef, useState } from 'react';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div id="hero" className="section hero">
      <div className="wide-container light">
        <div className="hero-wrap">
          <div className="w-layout-grid grid full-width mobile-1-col">
            <div id="w-node-_8f8f427a-a162-3030-0935-806ef126dc00-0181bba9" className="hero-text-wrap">
              <div className="overflow-hidden">
                <h1 data-w-id="f84372ae-39f3-d558-b059-862642443e0b" className="heading h1">
                  Grow projects like forests. <span className="accent-text">Reliably.</span>
                </h1>
              </div>
              <div className="text-box s">
                <p data-w-id="ba4f1ae9-7aa9-bbab-3e23-81ec90e8f9f7" className="paragraph large">
                  Create a clear roadmap to align your entire team, track milestones, and ensure confident project advancement.
                </p>
                <div className="spacer _32" />
                <div className="overlay-hidden">
                  <div data-w-id="7db7f76a-15f4-c6d4-c5a5-01dce3c647ca" className="buttons-wrap _16-padding-bottom">
                    <a
                      data-wf--button--variant="dark"
                      href="#contact"
                      className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
                    >
                      <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">Sign up</div>
                      <img
                        src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                        loading="lazy"
                        alt=""
                        className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                      />
                    </a>
                    <a
                      data-wf--button--variant="outline"
                      href="#features"
                      className="button-wrap w-variant-486b2865-bdcd-be19-167e-94f873d72fb3 w-inline-block"
                    >
                      <div className="button-text">See more</div>
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
              <div className="spacer _32" />
              <p data-w-id="2689d2e6-8617-35df-713d-de6c17cb6ef1" className="paragraph small">
                <strong>•</strong> Free demo • No credit card needed
              </p>
            </div>

            <div className="bg-video-wrap">
              <div
                data-poster-url="/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-f2ea23f690.jpg"
                className="background-video w-background-video w-background-video-atom"
              >
                <video
                  ref={videoRef}
                  id="76357cac-5e72-109f-5a72-9ad65220e100-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    backgroundImage: 'url(/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-f2ea23f690.jpg)',
                  }}
                  data-wf-ignore="true"
                  data-object-fit="cover"
                >
                  <source
                    src="/assets/Playback_vid.webm"
                    data-wf-ignore="true"
                  />
                </video>
                <div aria-live="polite">
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className="w-backgroundvideo-backgroundvideoplaypausebutton play-pause-button w-background-video--control"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <span>
                        <img
                          src="/assets/6a631eb305cafa158af0143f_play-btn-f12bc81c9a.svg"
                          loading="lazy"
                          alt="Pause video"
                        />
                      </span>
                    ) : (
                      <span>
                        <img
                          loading="lazy"
                          alt="Play video"
                          src="/assets/6a631ed5586b0856e5bbe7c1_pause-btn-cee5609190.svg"
                        />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Top-Right Cutout Corner & Rotating Logomark */}
              <div className="cutout-shape-wrap">
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape bottom"
                />
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape top-left"
                />
                <img
                  src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
                  loading="lazy"
                  style={{ transform: 'rotate(45deg)' }}
                  data-w-id="b66b72d9-e026-fdcb-6d3c-4f988ea07a0d"
                  alt=""
                  className="logo-mark"
                />
              </div>

              {/* Bottom-Left Cutout Corner & Users Avatars */}
              <div className="cutout-shape-wrap bottom-left">
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape second"
                />
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape first"
                />
                <div className="agri-feature-wrap">
                  <div className="agri-feature-icon-box" title="Smart Agriculture">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Sprout icon"
                    >
                      <path d="M7 20h10" />
                      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                    </svg>
                  </div>
                  <div className="agri-feature-title">
                    Smart Agriculture
                  </div>
                </div>
              </div>

              {/* Floating Slogans */}
              <div className="slogans-wrap">
                <div data-w-id="1a93fbd8-50a6-3681-5f63-9f75694bf098" className="green-slogan-wrap">
                  <div className="hero-small-text light">Real-time insights.</div>
                </div>
                <div data-w-id="1a93fbd8-50a6-3681-5f63-9f75694bf09b" className="cream-slogan-wrap">
                  <div className="hero-small-text">Available now!</div>
                </div>
              </div>

              {/* Floating Illustration */}
              <div data-w-id="9be411ff-966f-4519-293d-878b59eb9f45" className="hero-illustration-wrap">
                <img
                  src="/assets/68aec695eac9b687bc4c0741_hero-illustration-b7dd9f6cd0.svg"
                  loading="eager"
                  data-w-id="bcf7a115-99b6-c348-b603-7279c5eb1fa3"
                  alt=""
                  className="hero-illustration"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container" />
      </div>
    </div>
  );
};
