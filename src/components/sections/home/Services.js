import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    image:
      "https://img.icons8.com/fluency/240/stethoscope.png",
    imageMode: "contain",
    title: "Consult Doctors",
    short: "Book trusted consultations",
    link: "/doctor-list",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop",
    title: "Find Specialists",
    short: "Explore care by speciality",
    link: "/doctor-grid",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    title: "Hospital Network",
    short: "Browse trusted hospitals",
    link: "/hospital-list",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1200&auto=format&fit=crop",
    title: "Diagnostics & Labs",
    short: "Find tests and lab centers",
    link: "/clinic-list",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    title: "Membership Benefits",
    short: "Save more with your ₹49 card",
    link: "/",
    featured: true,
  },
];

const Services = () => {
  return (
    <section className="vb-section">
      <div className="vb-container">
        <div className="vb-services-card-grid">
          {services.map((item) => (
            <Link
              to={item.link}
              className={`vb-service-card-new ${item.featured ? "is-featured" : ""}`}
              key={item.id}
            >
              <div
                className={`vb-service-image ${
                  item.imageMode === "contain" ? "is-illustration" : ""
                }`}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>

              <div className="vb-service-content">
                <h3>{item.title}</h3>
                <p>{item.short}</p>
                {item.featured && <span className="vb-service-badge">Most Loved</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
