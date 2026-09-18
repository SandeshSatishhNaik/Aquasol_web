import React, { useState } from 'react';

export const VideoPreview: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="section">
        <div className="wide-container dark">
          <div className="spacer _32" />
          <div className="_2-1-grid full-width no-bottom-margin side-padding video-preview">
            <div id="w-node-_625ba4cd-97cb-e5be-18c1-5d91873d514f-0181bba9" className="left-col-wrap">
              <div data-w-id="5d658e18-0ae2-e35a-b8be-99febd39c644" className="outer-wrap preview">
                <div className="preview-text-wrap">
                  <h1 className="heading h2 light">
                    See it in <span className="accent-text">action.</span>
                  </h1>
                  <div className="text-box m">
                    <p className="paragraph large white no-bottom-margin">
                      Watch a quick demo and discover how easy project management can be.
                    </p>
                  </div>
                </div>
                <a
                  data-wf--button--variant="light"
                  href="#pricing"
                  className="button-wrap w-variant-6469cb50-26d0-1dd1-7436-c9d960826821 w-inline-block"
                >
                  <div className="button-text">Learn more</div>
                  <img
                    src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                    loading="lazy"
                    alt=""
                    className="image"
                  />
                </a>
              </div>

              <div
                data-w-id="f2b19ac7-40e0-5703-1c01-daa01201ec18"
                className="placeholder-video-overlay-wrap"
                style={{ cursor: 'pointer' }}
                onClick={() => setModalOpen(true)}
              >
                <img
                  sizes="(max-width: 2842px) 100vw, 2842px"
                  srcSet="/assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif 500w, /assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif 800w, /assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif 1080w, /assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif 1600w, /assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif 2842w"
                  alt="placeholder image"
                  src="/assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif"
                  loading="eager"
                  className="placeholder-video-image"
                />
                <div className="lightbox-link w-inline-block w-lightbox">
                  <img
                    loading="lazy"
                    src="/assets/68ca73ff0b3abba4a0867eda_play-417427fee3.svg"
                    alt="play"
                    className="video-placeholder-play-button"
                  />
                </div>
              </div>
            </div>

            <div
              id="w-node-_8e182ba7-f6d2-6647-38a8-df8b63fe799a-0181bba9"
              data-w-id="8e182ba7-f6d2-6647-38a8-df8b63fe799a"
              className="green-block-wrap"
            />
          </div>
          <div className="spacer _32" />
        </div>
      </div>

      {/* Video Modal Lightbox */}
      {modalOpen && (
        <div className="video-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setModalOpen(false)}>
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/pLgPFfFdpDs?autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};
