import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

// Dummy data for the banner
const dummyBannerData = [
{
  id: 1,
  image: "assets/img/ban1.jpeg",
  title:
    "India's Premier All-in-One Healthcare Ecosystem.\nSeamless Access to Top Doctors, Hospitals, and Diagnostics",
  benefits: [
    "Save 10% to 40% on surgeries, treatments, and diagnostics Services.",
    "Get 10% Cashback: Send your medical bill to Vaidya Bandhu via WhatsApp or Email. Cashback will be credited to your account within 7 working days.",
    "Free surgeries available for those in need through our social programs.",
    "Call our helpline from 9 AM to 6 PM for free medical advice.",
    "We help you choose the right doctor, hospital, or diagnostic center.",
  ],
},

];

const Banner = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const baseTransition = "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  const item = dummyBannerData[0];

  return (
    <div
      className="sigma_banner style-8"
      style={{
        overflow: "hidden",
        position: "relative",
        marginTop: "-14px",
      }}
    >
      <div
        className="banner-slider-inner secondary-overlay"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          filter: "brightness(1.2)",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.6) 100%)",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div
          className="sigma_banner-text text-center"
          style={{ position: "relative", zIndex: 3 }}
        >
          <div
            className="container"
            style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 15px" }}
          >
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Title */}
                <h1
                  className="title text-white"
                  style={{
                    color: "#ffffff",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "700",
                    fontSize: "clamp(1.2rem, 4.5vw, 2.8rem)",
                    marginBottom: "20px",
                    letterSpacing: "1px",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(-30px)",
                    transition: `opacity 1s ease-out, transform 1s ease-out`,
                  }}
                >
                  {item.title}
                </h1>

                {/* Benefits List */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 auto 40px auto",
                    textAlign: "left",
                    maxWidth: "750px",
                  }}
                >
                  {item.benefits.map((benefit, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        color: "#e0f7fa",
                        fontSize: "clamp(1.1rem, 1.9vw, 1.3rem)",
                        marginBottom: "12px",
                        lineHeight: "1.3",
                        opacity: animated ? 1 : 0,
                        transform: animated ? "translateY(0)" : "translateY(20px)",
                        transition: `opacity 0.8s ease-out ${0.6 + idx * 0.1}s, transform 0.8s ease-out ${0.6 + idx * 0.1}s`,
                      }}
                    >
                      <CheckCircle
                        size={22}
                        style={{
                          marginRight: "12px",
                          flexShrink: 0,
                          color: "#34d399",
                        }}
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div
                  className="banner-links"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "25px",
                    flexWrap: "wrap",
                    opacity: animated ? 1 : 0,
                    transform: animated ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 1s ease-out 1.5s, transform 1s ease-out 1.5s`,
                  }}
                >
                  {/* Find Doctor Button */}
                  <a
                    href="/doctor-list"
                    className="sigma_btn"
                    style={{
                      background: "linear-gradient(to right, #007a7e, #004d4f)",
                      color: "#ffffff",
                      border: "none",
                      padding: "14px 20px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "17px",
                      fontWeight: "600",
                      boxShadow:
                        hoveredButton === "findDoctor"
                          ? "0 8px 20px rgba(0, 122, 126, 0.4)"
                          : "0 4px 10px rgba(0, 122, 126, 0.2)",
                      transition: baseTransition,
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      transform:
                        hoveredButton === "findDoctor"
                          ? "translateY(-3px) scale(1.02)"
                          : "translateY(0) scale(1)",
                      textDecoration: "none", // Remove underline
                      pointerEvents: "auto", // Ensure clickable
                      touchAction: "manipulation",
                      zIndex: 100,
                    }}
                    onMouseEnter={() => setHoveredButton("findDoctor")}
                    onMouseLeave={() => setHoveredButton(null)}
                    aria-label="Find a Doctor"
                  >
                    Find A Doctor
                    <ArrowRight size={20} style={{ marginLeft: "12px" }} />
                  </a>

                  {/* Read More Button */}
                  <a
                    href="/about"
                    className="sigma_btn light"
                    style={{
                      background:
                        hoveredButton === "readMore"
                          ? "rgba(255, 255, 255, 0.3)"
                          : "rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      border:
                        hoveredButton === "readMore"
                          ? "1px solid #ffffff"
                          : "1px solid rgba(255, 255, 255, 0.5)",
                      padding: "14px 30px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "17px",
                      fontWeight: "700",
                      boxShadow:
                        hoveredButton === "readMore"
                          ? "0 8px 20px rgba(0, 0, 0, 0.2)"
                          : "0 4px 10px rgba(0, 0, 0, 0.1)",
                      transition: baseTransition,
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                      transform:
                        hoveredButton === "readMore"
                          ? "translateY(-3px) scale(1.02)"
                          : "translateY(0) scale(1)",
                      textDecoration: "none", // Clean link
                      pointerEvents: "auto", // Critical for mobile
                      touchAction: "manipulation", // Improves tap response
                      zIndex: 100,
                    }}
                    onMouseEnter={() => setHoveredButton("readMore")}
                    onMouseLeave={() => setHoveredButton(null)}
                    aria-label="Learn more about us"
                  >
                    Read More
                    <ArrowRight size={20} style={{ marginLeft: "12px" }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        .sigma_banner-text h1 {
          font-size: clamp(2.2rem, 5vw, 2.8rem);
        }

        .sigma_banner-text h5 {
          font-size: clamp(1.4rem, 3.5vw, 2rem);
        }

        .sigma_banner-text ul li {
          font-size: clamp(1rem, 2.2vw, 1.2rem);
        }

        @media (max-width: 768px) {
          .banner-slider-inner {
            min-height: 480px;
            padding: 40px 15px;
          }

          .sigma_banner-text h1 {
            font-size: clamp(2rem, 6vw, 2.5rem) !important;
            margin-bottom: 15px !important;
          }

          .sigma_banner-text ul li {
            font-size: clamp(0.95rem, 2.8vw, 1.15rem) !important;
            margin-bottom: 10px !important;
          }

          .sigma_banner-text ul {
            margin-bottom: 30px !important;
          }

          .banner-links {
            flex-direction: column;
            gap: 16px;
          }

          .banner-links a {
            width: 100%;
            justify-content: center;
            padding: 14px 20px;
            font-size: 16px;
            border-radius: 8px;
            text-align: center;
            pointer-events: auto !important;
            touch-action: manipulation !important;
            box-sizing: border-box;
          }

          .col-lg-10 {
            padding-top: 60px;
          }
        }

        @media (max-width: 480px) {
          .banner-slider-inner {
            min-height: 400px;
            padding: 30px 10px;
          }

          .sigma_banner-text h1 {
            font-size: clamp(1.8rem, 7vw, 2.2rem) !important;
          }

          .sigma_banner-text ul li {
            font-size: clamp(0.9rem, 3.5vw, 1rem) !important;
          }

          .banner-links a {
            font-size: 15px;
            padding: 12px 16px;
          }
        }

        /* Ensure no parent is blocking pointer events */
        .sigma_banner,
        .banner-slider-inner,
        .sigma_banner-text,
        .container,
        .row,
        .col-lg-10 {
          pointer-events: auto;
        }

        .sigma_banner-text > *,
        .banner-links a {
          pointer-events: auto; /* Only interactive children can be clicked */
        }
      `}</style>
    </div>
  );
};

export default Banner; // ✅ Fixed: Removed the extra dot