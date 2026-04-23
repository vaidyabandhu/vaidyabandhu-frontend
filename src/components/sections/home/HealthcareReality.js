import React from "react";

const challengeCards = [
  {
    title: "Rising Costs",
    copy: "Treatment costs are still high for families.",
  },
  {
    title: "Care Confusion",
    copy: "Choosing the right provider is hard.",
  },
  {
    title: "Delayed Treatment",
    copy: "Late decisions increase risk and stress.",
  },
  {
    title: "Need Guidance",
    copy: "Patients need trusted guidance.",
  },
];

const HealthcareReality = () => {
  return (
    <section className="vb-section">
      <div className="vb-container">
        <span className="vb-pill">Why This Matters</span>
        <h2 className="vb-section-heading">Healthcare Challenges Today</h2>
        <p className="vb-section-subheading">
          Better guidance and affordability improve care decisions.
        </p>

        <div className="vb-trust-grid" style={{ marginTop: "1.5rem" }}>
          {challengeCards.map((item) => (
            <article className="vb-trust-card" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthcareReality;
