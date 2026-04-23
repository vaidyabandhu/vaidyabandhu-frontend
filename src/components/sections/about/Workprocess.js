import React from "react";
import MembershipModal from "../../layouts/MembershipModal";

const dummyWorkprocess = [
  {
    title: "Activate Your ₹49 Membership",
    points: [
      "Access our healthcare network and add your family in minutes.",
      "Pay ₹49 (valid for 1 year).",
      "Receive your membership card at your doorstep.",
    ],
    imageUrl: "https://cdn-icons-png.flaticon.com/128/3135/3135768.png",
  },
  {
    title: "Get Support for Consultations & Hospital Care",
    points: [
      "Call or Email Us – Tell us your medical concern.",
      "Consult Top Doctors – We connect you with the best specialists.",
      "Avail 10% to 40% Discounts – On surgeries, treatments, and diagnostics.",
      "Visit Partner Hospitals & Diagnostic Centers – Use your membership card to get benefits.",
    ],
    imageUrl: "https://cdn-icons-png.flaticon.com/128/3209/3209265.png",
  },
  {
    title: "Get Complete <br/>Healthcare Support",
    points: [
      "Free Medical Advice – Talk to our experts anytime.",
      "Best Treatment Plans – We help you choose the right hospital and doctor.",
      "Priority Support for Critical Cases – Quick access to necessary treatments.",
    ],
    imageUrl: "https://cdn-icons-png.flaticon.com/128/2991/2991158.png",
  },
];

const Workprocess = () => (
  <div className="vb-about-shell">
    <div className="vb-process-head">
      <div className="vb-about-section-head">
        <div>
          <span className="vb-about-kicker">How It Works</span>
          <h2>How it Works?</h2>
        </div>
        <p>
          At Vaidya Bandhu, we make quality healthcare simple, affordable, and
          accessible. Here&apos;s how you can benefit from our services.
        </p>
      </div>
      <div className="vb-process-cta">
        <MembershipModal />
      </div>
    </div>

    <div className="vb-process-grid">
      {dummyWorkprocess.map((item, index) => (
        <article className="vb-process-card" key={item.title}>
          <div className="vb-process-card-top">
            <span className="vb-process-step">Step {index + 1}</span>
            <div className="vb-process-icon">
              <img src={item.imageUrl} alt={`Step ${index + 1}`} />
            </div>
          </div>

          <h3 dangerouslySetInnerHTML={{ __html: item.title }} />

          <ul className="vb-process-points">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </div>
);

export default Workprocess;
