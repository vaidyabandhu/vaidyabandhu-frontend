import React from "react";

const benefits = [
  "Up to 40% savings on treatments and diagnostics.",
  "Up to 10% cashback on eligible bills.",
  "₹49 yearly card with quick activation.",
  "Care guidance and helpline support.",
];

const MembershipCardBenefits = () => {
  return (
    <section
      id="membership-benefits"
      className="vb-section"
      style={{ scrollMarginTop: "132px" }}
    >
      <div className="vb-container">
        <span className="vb-pill">Membership Benefits</span>
        <h2 className="vb-section-heading">
          Save More With ₹49 Membership
        </h2>
        <p className="vb-section-subheading">
          Affordable card benefits with trusted support.
        </p>

        <div className="vb-process-shell" style={{ marginTop: "1.5rem" }}>
          <div className="vb-steps-grid">
            {benefits.map((item, index) => (
              <article className="vb-step-card" key={item}>
                <div className="vb-step-index">{index + 1}</div>
                <div>
                  <h3 className="vb-step-title">Benefit</h3>
                  <p className="vb-step-copy">{item}</p>
                </div>
              </article>
            ))}
          </div>

          <article className="vb-process-video" style={{ cursor: "default" }}>
            <img
              src={process.env.PUBLIC_URL + "/assets/img/gh.png"}
              alt="Vaidya Bandhu membership card"
              loading="lazy"
            />
            <p className="vb-process-caption">Vaidya Bandhu Health Card</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default MembershipCardBenefits;
