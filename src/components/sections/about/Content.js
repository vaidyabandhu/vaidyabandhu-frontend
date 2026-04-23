import React from "react";
import Whyus from "./Whyus";
import Workprocess from "./Workprocess";
import LeadershipInline from "./Leadership";
import OurStory from "./Ourstory";
import WhoCanBenefit from "./Benifit";

const heroHighlights = [
  "10% - 40% discounts on surgeries, treatments, and diagnostics",
  "Trusted doctors, hospitals, and diagnostic centers",
  "Guided care with patient-first support",
];

const heroStats = [
  { value: "4000+", label: "Verified Doctors" },
  { value: "80+", label: "Specialties Covered" },
  { value: "20000+", label: "Membership Holder" },
];

const Content = () => (
  <div className="vb-about-page vb-about-redesign">
    <section className="vb-about-hero">
      <div className="vb-container vb-about-hero-grid">
        <div className="vb-about-hero-copy">
          <span className="vb-pill">About Vaidya Bandhu</span>
          <h1 className="vb-about-hero-title">
            Affordable, compassionate, and quality medical care.
          </h1>
          <p className="vb-about-hero-lead">
            To create a nationwide ecosystem where patients are respected, doctors are
            honored, and care comes before commerce.
          </p>

          <div className="vb-about-chip-list">
            {heroHighlights.map((item) => (
              <span className="vb-about-chip" key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="vb-about-hero-stats">
            {heroStats.map((item) => (
              <div className="vb-about-hero-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vb-about-hero-visual">
          <div className="vb-about-collage">
            <div className="vb-about-collage-main">
              <img
                src={`${process.env.PUBLIC_URL}/assets/img/doc-1.jpeg`}
                alt="Healthcare consultation"
              />
            </div>
            <div className="vb-about-collage-small vb-about-collage-small-top">
              <img
                src={`${process.env.PUBLIC_URL}/assets/img/doc-6.jpg`}
                alt="Doctor support"
              />
            </div>
            <div className="vb-about-collage-small vb-about-collage-small-bottom">
              <img
                src={`${process.env.PUBLIC_URL}/assets/img/benefit.jpg`}
                alt="Families receiving care"
              />
            </div>
            <div className="vb-about-floating-note">
              <span>10% - 40% benefits</span>
              <strong>Healthcare made more reachable</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="vb-about-stage-wrap">
      <section className="vb-about-stage">
        <OurStory />
      </section>

      <section className="vb-about-stage">
        <Whyus />
      </section>

      <section className="vb-about-stage">
        <LeadershipInline />
      </section>

      <section className="vb-about-stage">
        <Workprocess />
      </section>

      <section className="vb-about-stage">
        <WhoCanBenefit />
      </section>
    </div>
  </div>
);

export default Content;
