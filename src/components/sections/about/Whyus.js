import React from "react";

const whyus = [
  {
    icon: "flaticon-doctor",
    title: "Affordable Healthcare for All",
    text: "Get cost-effective medical treatments without compromising quality.",
  },
  {
    icon: "flaticon-hospital",
    title: "Top Doctors Across Specialties",
    text: "Consult experienced specialists in cardiology, orthopedics, oncology, and 80+ departments.",
  },
  {
    icon: "flaticon-stethoscope",
    title: "Trusted Network of Health Warriors",
    text: "Partnered with hospitals and doctors dedicated to patient-first care.",
  },
  {
    icon: "flaticon-clipboard",
    title: "Available Across Karnataka",
    text: "Access services anywhere in the state - urban or rural.",
  },
  {
    icon: "flaticon-heart",
    title: "₹49 Membership Benefits",
    text: "Unlock 10% – 40% discounts on surgeries, treatments and diagnostics.",
  },
  {
    icon: "flaticon-call",
    title: "9 AM to 6 PM. 24/7 Helpline will be coming soon",
    text: "Free medical advice and assistance available whenever you need it.",
  },
];

const Whyus = () => (
  <div className="vb-about-shell">
    <div className="vb-about-section-head">
      <div>
        <span className="vb-about-kicker">Why Choose Us</span>
        <h2>Why Choose VaidyaBandhu?</h2>
      </div>
      <p>
        Ready to Get Started? Empower your health journey join VaidyaBandhu for trusted,
        smarter care.
      </p>
    </div>

    <div className="vb-about-why-layout">
      <div className="vb-about-why-media">
        <div className="vb-about-why-collage">
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/doc-1.jpeg`}
            alt="Doctor consultation"
            className="vb-about-why-photo vb-about-why-photo-main"
          />
          <img
            src={`${process.env.PUBLIC_URL}/assets/img/doc-6.jpg`}
            alt="Healthcare support"
            className="vb-about-why-photo vb-about-why-photo-secondary"
          />
        </div>
        <div className="vb-about-why-note">
          <strong>Patient-first care</strong>
          <span>Affordable access with trusted medical guidance.</span>
        </div>
      </div>

      <div className="vb-about-why-list">
        {whyus.map((item) => (
          <article className="vb-about-why-card" key={item.title}>
            <span className="vb-about-why-icon">
              <i className={item.icon} />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </div>
);

export default Whyus;
