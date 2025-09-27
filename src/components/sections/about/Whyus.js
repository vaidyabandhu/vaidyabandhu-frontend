import React, { Component } from "react";

// Import Poppins font
// import '@fontsource/poppins/300.css';
// import '@fontsource/poppins/400.css';
// import '@fontsource/poppins/500.css';
// import '@fontsource/poppins/600.css';
// import '@fontsource/poppins/700.css';
// import '@fontsource/poppins/800.css';

// Dummy data for whyus since the import was removed
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

class Whyus extends Component {
  render() {
    return (
      <div
        className="row"
        style={{
          paddingTop: "80px",
          fontFamily: "Poppins", 
        }}
      >
        <div className="col-lg-5 order-2 order-lg-1">
          <div className="sigma_about style-21">
            <div className="section-title" style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "clamp(24px, 4vw, 34px)",
                  fontWeight: 800,
                  color: "#fff",
                  textAlign: "center",
                  marginBottom: "8px",
                  lineHeight: "1.3",
                  fontFamily: "Poppins", 
                }}
              >
                Why Choose VaidyaBandhu?
              </h2>
              <p
                style={{
                  marginLeft: "24px",
                  fontSize: "22px",
                  lineHeight: "1.3",
                  fontFamily:
                    "Poppins" /* Optional: keep font consistent */,
                }}
              >
                Ready to Get Started?
                <br />
                Empower your health journey join VaidyaBandhu for trusted,
                smarter care.
              </p>
            </div>
            <div className="sigma_about-content">
              {/* Data */}
              {whyus.slice(0, 6).map((item, i) => (
                <div className="sigma_info style-15" key={i}>
                  <div className="sigma_info-title">
                    <i className={"sigma_info-icon " + item.icon} />
                  </div>
                  <div
                    className="sigma_info-description"
                    style={{ fontFamily: "Poppins" }} 
                  >
                    <h5
                      style={{
                        fontFamily: "Poppins", 
                      }}
                    >
                      {item.title}
                    </h5>
                    <p
                      style={{
                        fontFamily: "Poppins", 
                        fontSize: "22px",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
              {/* Data */}
            </div>
          </div>
        </div>
        <div className="col-lg-6 offset-lg-1 order-1 order-lg-2">
          <div className="sigma_about style-21 mt-0 w-100 h-100">
            <div className="relative w-full h-72 flex items-center justify-center">
              {/* First Image */}
              <img
                src={process.env.PUBLIC_URL + "/assets/img/doc-1.jpeg"}
                alt="img"
                className="rounded-lg shadow-lg w-[300px] h-auto object-cover z-10"
              />

              {/* Second Image with left margin */}
              <img
                src={process.env.PUBLIC_URL + "/assets/img/doc-6.jpg"}
                alt="img"
                className="rounded-lg shadow-lg w-[280px] h-auto object-cover hidden sm:block z-0"
                style={{ marginTop: "-6%", marginLeft: "21%" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Whyus;
