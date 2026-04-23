import React from "react";

const benefitItems = [
  "Patients who need affordable treatments & surgeries.",
  "Families looking for trusted doctors & hospitals.",
  "Needy individuals requiring free medical support.",
  "Anyone who wants guidance for the best healthcare options.",
];

const WhoCanBenefit = () => (
  <div className="vb-about-shell">
    <div className="vb-about-section-head vb-about-section-head-center">
      <div>
        <span className="vb-about-kicker">Who Can Benefit</span>
        <h2>Who Can Benefit?</h2>
      </div>
      <p>Support designed for patients, families, and anyone seeking guided care.</p>
    </div>

    <div className="vb-benefit-layout">
      <div className="vb-benefit-media">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/benefit.jpg`}
          alt="People benefiting from healthcare"
        />
        <div className="vb-benefit-note">
          <strong>Guided, affordable healthcare</strong>
          <span>Built for people who need clarity, access, and trusted support.</span>
        </div>
      </div>

      <div className="vb-benefit-list">
        {benefitItems.map((item) => (
          <article className="vb-benefit-card" key={item}>
            <span className="vb-about-check">✓</span>
            <p>{item}</p>
          </article>
        ))}
      </div>
    </div>
  </div>
);

export default WhoCanBenefit;
