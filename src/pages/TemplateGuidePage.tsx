import React from 'react';

export const TemplateGuidePage: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="overflow-hidden">
          <h1 className="heading h2">Welcome</h1>
        </div>
        <div className="text-box l">
          <p className="paragraph large">
            Thank you for purchasing this template! This quick guide will help you get up and
            running quickly, showing you how to customize your site, update content, and make the
            most of everything this template has to offer. Let&apos;s just jump right in!
          </p>
        </div>
        <div className="spacer _32" />
        <h2 className="heading h3">
          <sup className="small-number">[1]</sup> Basics
        </h2>
        <div className="text-box m">
          <p className="paragraph">
            Whether you&apos;re just starting out with Webflow or have a bit of experience, we&apos;ve
            put together some handy resources to help you along the way.
          </p>
          <div className="spacer _32" />
          <div className="grid bottom-margin">
            <div className="left-col gap-16">
              <a
                href="https://www.youtube.com/watch?v=7gpZ-E2dSdM&ab_channel=Webflow"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                Webflow Beginner&apos;s Guide
              </a>
              <a
                href="https://www.youtube.com/watch?v=brrC1W6LXRk&ab_channel=Webflow"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                Webflow CMS
              </a>
              <a
                href="https://www.youtube.com/watch?v=UG9U-G_OK3I&ab_channel=Webflow"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                Interactions
              </a>
            </div>
            <div className="right-col gap-16">
              <a
                href="https://www.youtube.com/watch?v=1LtUdMH6iqk&ab_channel=Webflow"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                Components
              </a>
              <a
                href="https://www.youtube.com/watch?v=GQQo_zcCjdE&ab_channel=Webflow"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                Variables
              </a>
              <a
                href="https://help.webflow.com/hc/en-us/articles/33961237278611-Add-SEO-title-and-meta-description#h_01JQ4D4EY3BE2ZFT57J30Y0D48"
                target="_blank"
                rel="noreferrer"
                className="link-text"
              >
                SEO Basics
              </a>
            </div>
          </div>
        </div>
        <div className="spacer _32" />
        <h1 className="heading h3">
          <sup className="small-number">[2]</sup> Editing Content
        </h1>
        <div className="text-box m">
          <p className="paragraph">
            Learn how to edit the content and find icons and images for your site.
          </p>
        </div>
        <div className="spacer _32" />
        <div className="text-box m">
          <h2 className="heading h5">Starter Page</h2>
          <p className="paragraph">
            We suggest kicking things off with the Starter page (you&apos;ll find it in the Admin folder)
            when you&apos;re setting up a new page. It&apos;s got the header, section, and footer all set
            up, so you can skip the hassle of building from the ground up.
          </p>
        </div>
        <img
          sizes="(max-width: 935px) 100vw, 935px"
          srcSet="/assets/68ac094ada452bf00181bbd8_Starter-Page.avif 500w, /assets/68ac094ada452bf00181bbd8_Starter-Page.avif 935w"
          alt="starter page"
          src="/assets/68ac094ada452bf00181bbd8_Starter-Page.avif"
          loading="lazy"
          className="guide-image"
        />
        <div className="spacer _32" />
        <div className="text-box m">
          <h2 className="heading h5">Customizing Colors</h2>
          <p className="paragraph">
            This template uses Webflow Variables to keep the color scheme consistent and easy to
            manage. To update using your brand&apos;s colors, head over to{' '}
            <strong>Variables/Base Collection</strong> on the left panel. Pick the color you want
            to change, pop in your hex color code, and boom! Every element using that color will
            update across the template.
          </p>
        </div>
        <img
          sizes="(max-width: 1400px) 100vw, 1400px"
          srcSet="/assets/68ac094ada452bf00181bbd9_Change-Colors.avif 500w, /assets/68ac094ada452bf00181bbd9_Change-Colors.avif 1400w"
          alt="change colors"
          src="/assets/68ac094ada452bf00181bbd9_Change-Colors.avif"
          loading="lazy"
          className="guide-image"
        />
        <div className="spacer _32" />
        <div className="text-box m">
          <h2 className="heading h5">Changing Text</h2>
          <p className="paragraph">
            LotusW uses fonts available for free on{' '}
            <a
              href="http://fonts.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Google Fonts
            </a>
            . See Licensing page for more details. To update template text head over to{' '}
            <strong>Variables/Base Collection</strong> and under <em>Fonts</em> section edit{' '}
            <em>Headings</em> or <em>Body</em> variables accordingly. This will update all the
            text on the template that is tied to particular variables. <br />
            <br />
            If you need a custom font that isn’t available in Webflow, you can head to{' '}
            <strong>Project Settings &gt; Fonts</strong> to upload your own or link your Adobe Fonts
            account.
          </p>
          <img
            loading="lazy"
            src="/assets/68c11517fcbd50afb3d1d3b3_text.avif"
            alt=""
            className="guide-image"
          />
        </div>
        <div className="spacer _32" />
        <div className="text-box m">
          <h2 className="heading h5">Adding Icons and Images</h2>
          <p className="paragraph">
            You can find the sources for images and icons used in the template on the Licensing page.
            If you&apos;re on the hunt for more images or icons, we suggest checking out sites like{' '}
            <a
              href="https://unsplash.com/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Unsplash
            </a>{' '}
            or{' '}
            <a
              href="https://www.pexels.com/"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Pexels
            </a>
            , where you can find license-free assets for your site.
          </p>
        </div>
        <img
          sizes="(max-width: 2318px) 100vw, 2318px"
          srcSet="/assets/68ac094ada452bf00181bbda_Add-Icons-Images-p-500.png 500w, /assets/68ac094ada452bf00181bbda_Add-Icons-Images.avif 2318w"
          alt="image"
          src="/assets/68ac094ada452bf00181bbda_Add-Icons-Images.avif"
          loading="lazy"
          className="guide-image"
        />
        <div className="spacer _32" />
        <div className="text-box m">
          <h2 className="heading h5">Backups</h2>
          <p className="paragraph">
            If you ever mess up or accidentally delete images or CMS data and want to roll back to
            an earlier version, just head over to the <strong>Settings/Backups</strong> section on
            the left panel. Pick the version you want to return to, click on <em>Restore Backup</em>{' '}
            under the three dots icon, and publish your site. Boom, your old site is back!
          </p>
        </div>
        <img
          sizes="(max-width: 1866px) 100vw, 1866px"
          srcSet="/assets/68ac094ada452bf00181bbdb_Restore-Backup.avif 500w, /assets/68ac094ada452bf00181bbdb_Restore-Backup.avif 800w, /assets/68ac094ada452bf00181bbdb_Restore-Backup.avif 1866w"
          alt="backup image"
          src="/assets/68ac094ada452bf00181bbdb_Restore-Backup.avif"
          loading="lazy"
          className="guide-image"
        />
        <div className="spacer _32" />
        <h2 className="heading h3">
          <sup className="small-number">[3]</sup> Quick Tips/Customer Support
        </h2>
        <div className="text-box l">
          <p className="paragraph">
            Here, we&apos;ll share some extra tips and show you how to reach out for customer support
            if you ever need a hand.
          </p>
        </div>
        <h2 className="heading h5">Tips</h2>
        <div className="text-box l">
          <ul role="list" className="list">
            <li className="list-item">
              <p className="paragraph">
                After adding any image, don&apos;t forget to compress it to .avif or .webp formats(using
                Webflow built in compression feature) to allow for better site speed and improved
                SEO.
              </p>
            </li>
            <li className="list-item">
              <p className="paragraph">
                CMS Collections are perfect for dynamic stuff like blogs, portfolios, or team
                members. Super easy to manage and grow your content.
              </p>
            </li>
            <li className="list-item">
              <p className="paragraph">
                Use the “Clean Up” feature in the Style Manager to remove unused classes and keep
                things tidy. You can also delete unused Interactions the same way, under interactions
                panel on the right side.
              </p>
            </li>
            <li className="list-item">
              <p className="paragraph">
                Preview your design on all breakpoints (desktop, tablet, mobile) to ensure your
                design is responsive and accessible.
              </p>
            </li>
            <li className="list-item">
              <p className="paragraph">
                Use keyboard shortcuts like Cmd/Ctrl + E to quickly search and jump to any element or
                page.
              </p>
            </li>
          </ul>
        </div>
        <h2 className="heading h5">Customer Support</h2>
        <div className="text-box l">
          <p className="paragraph">
            If you have any questions on how to use the template, feel free to reach out either on{' '}
            <a
              href="https://x.com/tomsdesign_"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              X(Twitter)
            </a>{' '}
            or{' '}
            <a href="mailto:hello@tomsweb.site" className="text-link">
              Email
            </a>
            , and I will get back to you within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
