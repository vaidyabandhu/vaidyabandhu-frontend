import React from "react";
import { Link } from "react-router-dom";
import counter from "../../../data/counter.json";

const heroContent = {
  title: "Trusted Healthcare, Better Savings",
  intro:
    "Find verified doctors, hospitals, and diagnostics with guided support.",
  benefits: [
    "Save up to 40% on treatments.",
    "Get quick support from our care team.",
    "Free surgeries available 10% money back",
    "Free advice: 9 AM–6 PM",
    "Right doctor guidance",
  ],
};

const Banner = () => {
  const quickStats = counter.slice(0, 3).map((item) =>
    item.title === "Diagnostic Centers"
      ? { ...item, title: "Hospitals" }
      : item
  );

  return (
    <section className="vb-home-hero">
      <div className="vb-container">
        <div className="vb-hero-grid">
          <div>
            <span className="vb-pill">Trusted Healthcare Support</span>
            <h1 className="vb-hero-title">{heroContent.title}</h1>
            <p className="vb-hero-lead">{heroContent.intro}</p>

            <ul className="vb-hero-points">
              {heroContent.benefits.map((benefit) => (
                <li key={benefit}>
                  <i className="fas fa-check-circle" /> {benefit}
                </li>
              ))}
            </ul>

            <div className="vb-hero-actions">
              <Link to="/doctor-list" className="vb-btn vb-btn-primary">
                Find Doctors
              </Link>
              <Link to="/about" className="vb-btn vb-btn-secondary">
                About Vaidya Bandhu
              </Link>
            </div>

            <div className="vb-hero-stat-strip">
              {quickStats.map((item) => (
                <article className="vb-hero-stat" key={item.id}>
                  <h4>{item.value}+</h4>
                  <p>{item.title}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="vb-hero-visual" aria-hidden="true">
            <img
              src={process.env.PUBLIC_URL + "/assets/img/banner-2.jpg"}
              alt="Doctor greeting a patient in a hospital"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
