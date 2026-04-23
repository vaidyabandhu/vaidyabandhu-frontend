import React from "react";

const storyParagraphs = [
  "Healthcare is a basic necessity, yet millions of people struggle to afford quality medical care. High treatment costs, lack of guidance, and financial stress prevent many from getting the care they need.",
  "Understanding these challenges, Vaidya Bandhu was created to bridge the gap between patients and affordable healthcare. Our goal is simple: No one should suffer due to financial limitations.",
];

const missionPoints = [
  "10% – 40% off on surgeries, treatments & diagnostics.",
  "Free medical guidance for informed decisions.",
  "Get 10% Cashback: Send your bill to Vaidya Bandhu via WhatsApp or Email. Cashback will be credited to your account within 7 working days.",
  "Top doctors across all specialties and everywhere.",
  "Free surgeries for the needy through our social impact programs.",
  "Personalized support in selecting the Ideal Doctor, Hospital, or Diagnostic centers.",
];

const OurStory = () => (
  <div className="vb-about-shell">
    <div className="vb-about-grid">
      <article className="vb-about-panel vb-about-story-panel">
        <span className="vb-about-kicker">Our Story</span>
        <h2>Our Story</h2>
        {storyParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <article className="vb-about-panel vb-about-vision-panel">
        <span className="vb-about-kicker">Our Vision</span>
        <h2>Our Vision</h2>
        <p className="vb-about-vision-quote">
          To create a nationwide ecosystem where patients are respected, doctors are
          honored, and care comes before commerce. VaidyaBandhu empowers patients by
          upholding privacy, reliability, and inclusivity.
        </p>
      </article>
    </div>

    <article className="vb-about-panel vb-about-mission-panel">
      <div className="vb-about-panel-head">
        <div>
          <span className="vb-about-kicker">Our Mission</span>
          <h2>Our Mission</h2>
        </div>
        <p>
          At Vaidya Bandhu, we empower patients with timely medical guidance, seamless
          access to trusted hospitals, and compassionate care at every step of their
          healthcare journey.
        </p>
      </div>

      <div className="vb-about-mission-layout">
        <div className="vb-about-mission-media">
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/cvv.jpeg`}
            alt="Our mission"
          />
        </div>

        <ul className="vb-about-checklist">
          {missionPoints.map((item) => (
            <li key={item}>
              <span className="vb-about-check">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  </div>
);

export default OurStory;
