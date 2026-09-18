import React from 'react';

interface NotFoundPageProps {
  onGoHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="section _404">
      <div className="container">
        <div className="w-layout-grid _404-layout">
          <div className="col">
            <img
              className="_404-image"
              src="/assets/691f15da4614063c3d27994e_404-v2.avif"
              alt="404"
              sizes="(max-width: 928px) 100vw, 928px"
              loading="eager"
              srcSet="/assets/691f15da4614063c3d27994e_404-v2-p-500.avif 500w, /assets/691f15da4614063c3d27994e_404-v2.avif 928w"
            />
          </div>
          <div className="col centered _404">
            <h1 className="heading h2 mobile-centered">You&#8217;ve wandered off the map</h1>
            <div className="buttons-wrap no-top-padding">
              <a
                data-wf--button--variant="dark"
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  if (onGoHome) onGoHome();
                }}
                className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
              >
                <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">
                  Head back to basecamp
                </div>
                <img
                  src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                  loading="lazy"
                  alt=""
                  className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
