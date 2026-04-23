import React from "react";

const logos = [
  "/assets/img/h1.png",
  "/assets/img/h3.png",
  "/assets/img/h4.png",
  "/assets/img/h5.png",
  "/assets/img/h6.png",
  "/assets/img/h7.png",
  "/assets/img/h8.png",
  "/assets/img/h9.png",
  "/assets/img/h10.png",
  "/assets/img/h11.png",
  "/assets/img/h12.png",
  "/assets/img/h13.png",
  "/assets/img/h14.png",
  "/assets/img/h15.png",
  "/assets/img/h16.png",
  "/assets/img/h17.png",
  "/assets/img/h18.png",
  "/assets/img/h19.png",
  "/assets/img/h20.png",
  "/assets/img/h21.png",
  "/assets/img/h22.png",
  "/assets/img/h23.jpg",
  "/assets/img/h24.jpg",
  "/assets/img/h25.jpg",
  "/assets/img/h26.jpg",
  "/assets/img/h27.jpg",
  "/assets/img/h28.jpg",
  "/assets/img/h29.jpg",
];

const ClientLogosCarousel = () => {
  return (
    <section className="vb-section">
      <div className="vb-container">
        <span className="vb-pill">Network</span>
        <h2 className="vb-section-heading">Partner Hospitals And Care Centers</h2>
        <p className="vb-section-subheading">
          Trusted healthcare partners across the network, aligned to quality and
          ethical care standards.
        </p>

        <div className="vb-logo-grid">
          {logos.map((logo) => (
            <div className="vb-logo-item" key={logo}>
              <img src={process.env.PUBLIC_URL + logo} alt="Healthcare partner" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosCarousel;
