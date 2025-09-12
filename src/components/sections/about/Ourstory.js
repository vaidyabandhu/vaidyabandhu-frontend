import React, { useState, useEffect } from "react";

const OurStory = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null); // State for section hover effects

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Unified, smoother transition for hover effects and animations
  const baseTransition = "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"; // More expressive cubic-bezier

  return (
    <section
      style={{
        padding: "40px 10px" /* Generous padding for section */,
        background:
          "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)" /* Light, inviting gradient */,
        fontFamily: "poppins" /* Consistent font */,
        color: "#4a5568" /* Soft dark gray for main text */,
        lineHeight: "1.4", // Adjusted for better readability
        overflow: "hidden",
        position: "relative", // For absolute positioned background elements
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "min(150px, 15vw)",
          height: "min(150px, 15vw)",
          backgroundColor: "rgba(0, 122, 126, 0.08)", // Teal accent with transparency
          borderRadius: "50%",
          filter: "blur(30px)",
          animation: "floatShape1 12s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1.5s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "min(180px, 18vw)",
          height: "min(180px, 18vw)",
          backgroundColor: "rgba(0, 122, 126, 0.05)", // Lighter teal accent with transparency
          borderRadius: "50%",
          filter: "blur(35px)",
          animation: "floatShape2 14s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1.5s ease-out",
          zIndex: 0,
        }}
      ></div>

      <div
        className="container"
        style={{
          maxWidth: "1250px" /* Wider max-width for a more spacious feel */,
          margin: "0 auto",
          padding: "0 10px",
          position: "relative", // Ensures content is above background elements
          zIndex: 1,
        }}
      >
        <div
          className="row"
          style={{ display: "flex", flexDirection: "column", gap: "40px" }}
        >
          {" "}
          {/* Increased gap */}
          {/* Our Story Section */}
          <div
            style={{
              padding: "30px" /* Increased padding within the card */,
              backgroundColor:
                "#FFFFFF" /* Pure white background for a crisp look */,
              borderRadius: "20px" /* More rounded corners */,
              border:
                "1px solid rgba(0, 77, 79, 0.1)" /* Subtle border matching dark primary */,
              boxShadow:
                hoveredSection === "story"
                  ? "0 25px 60px rgba(0, 77, 79, 0.25)"
                  : "0 12px 35px rgba(0, 77, 79, 0.12)", // Enhanced shadow on hover
              transition: baseTransition,
              opacity: animated ? 1 : 0,
              transform: animated
                ? "translateY(0) scale(1)"
                : "translateY(50px) scale(0.98)", // More pronounced entrance
              transitionDelay: "0.2s",
            }}
            onMouseEnter={() => setHoveredSection("story")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              style={{
                fontSize:
                  "clamp(24px, 4.5vw, 36px)" /* Larger, responsive title size */,
                fontWeight: 800, // Bolder
                color: "#004d4f" /* Dark teal for headings */,
                position: "relative",
                paddingBottom: "10px", // More space for underline
                textAlign: "center",
                marginBottom: "10px",
                fontFamily: "Poppins",
              }}
            >
              Our <span style={{ color: "#007a7e" }}>Story</span>
              {/* Custom underline effect: double line */}
            </h2>
            <p
              style={{
                fontSize: "clamp(17px, 2.2vw, 19px)",
                color: "#4a5568",
                fontFamily: "Poppins",
                marginBottom: "20px",
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s`,
              }}
            >
              Healthcare is a basic necessity, yet millions of people struggle
              to afford quality medical care. High treatment costs, lack of
              guidance, and financial stress prevent many from getting the care
              they need.
            </p>
            <p
              style={{
                fontSize: "clamp(17px, 2.2vw, 19px)",
                color: "#4a5568",
                fontFamily: "Poppins",
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s`,
              }}
            >
              Understanding these challenges,
              <strong style={{ color: "#007a7e" }}>
                Vaidya Bandhu was created to bridge the gap between patients and
                affordable healthcare.
              </strong>{" "}
              Our goal is simple: No one should suffer due to financial
              limitations.
            </p>
          </div>
          {/* Our Vision Section */}
          <div
            style={{
              padding: "40px",
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              fontFamily: "poppins",
              border: "1px solid rgba(0, 77, 79, 0.1)",
              boxShadow:
                hoveredSection === "vision"
                  ? "0 25px 60px rgba(0, 77, 79, 0.25)"
                  : "0 12px 35px rgba(0, 77, 79, 0.12)",
              transition: baseTransition,
              opacity: animated ? 1 : 0,
              transform: animated
                ? "translateY(0) scale(1)"
                : "translateY(50px) scale(0.98)",
              transitionDelay: "0.4s",
            }}
            onMouseEnter={() => setHoveredSection("vision")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 4.5vw, 36px)",
                fontWeight: 800,
                color: "#004d4f",
                fontFamily: "poppins",
                position: "relative",
                paddingBottom: "10px",
                textAlign: "center",
                marginBottom: "15px",
                fontFamily: "Poppins",
              }}
            >
              Our <span style={{ color: "#007a7e" }}>Vision</span>
            </h2>
            <p
              style={{
                fontWeight: 600,
                fontFamily: "Poppins",
                color: "#007a7e", // Bright teal accent for vision statement
                fontSize:
                  "clamp(20px, 3vw, 19px)" /* Larger font size for vision statement */,
                textAlign: "center",
                padding: "10px 20px" /* More padding for emphasis */,
                backgroundColor:
                  "rgba(0, 122, 126, 0.05)" /* Subtle background highlight */,
                borderRadius: "18px", // Slightly more rounded
                border:
                  "1px solid #007a7e" /* Solid border matching primary accent */,
                boxShadow:
                  "0 10px 25px rgba(0, 122, 126, 0.15)" /* More prominent shadow */,
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s`,
              }}
            >
              To create a nationwide ecosystem where patients are respected,
              doctors are honored, and care comes before commerce. VaidyaBandhu
              empowers patients by upholding privacy, reliability, and
              inclusivity.
            </p>
          </div>
          {/* Our Mission Section */}
          <div
            style={{
              padding: "40px",
              backgroundColor: "#FFFFFF",

              borderRadius: "20px",
              border: "1px solid rgba(0, 77, 79, 0.1)",
              boxShadow:
                hoveredSection === "mission"
                  ? "0 25px 60px rgba(0, 77, 79, 0.25)"
                  : "0 12px 35px rgba(0, 77, 79, 0.12)",
              transition: baseTransition,
              opacity: animated ? 1 : 0,
              transform: animated
                ? "translateY(0) scale(1)"
                : "translateY(50px) scale(0.98)",
              transitionDelay: "0.6s",
            }}
            onMouseEnter={() => setHoveredSection("mission")}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 4.5vw, 36px)",
                fontWeight: 800,
                fontFamily: "Poppins",
                color: "#004d4f",
                position: "relative",
                paddingBottom: "10px",
                textAlign: "center", // Centered title for mission
                marginBottom: "10px",
              }}
            >
              Our <span style={{ color: "#007a7e" }}>Mission</span>
            </h2>
            <p
              style={{
                marginBottom: "25px",
                fontSize: "clamp(17px, 2.2vw, 19px)",
                color: "#4a5568",
                textAlign: "center",
                maxWidth: "1100px",
                margin: "0 auto 25px",
                fontFamily: "Poppins",
              }}
            >
              At Vaidya Bandhu, we empower patients with timely medical
              guidance, seamless access to trusted hospitals, and compassionate
              care at every step of their healthcare journey.
            </p>

            {/* Mission Content: Image Left, Text Right */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap", // Allow wrapping on smaller screens
                alignItems: "center", // Vertically align items
                gap: "30px", // Gap between image and text
              }}
            >
              {/* Left Column: Image for Mission */}
              <div
                style={{
                  flex: "1 1 300px", // Flexible width, minimum 300px
                  maxWidth: "40%", // Max 40% width on larger screens
                  textAlign: "center",
                  opacity: animated ? 1 : 0,
                  transform: animated ? "translateX(0)" : "translateX(-50px)", // Slide in from left
                  transition: `opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s`,
                }}
              >
                <img
                  src="assets/img/cvv.jpeg"
                  alt="Our Mission"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "800px", // You can adjust this value as needed
                    objectFit: "contain", // Ensures full image is shown without cropping
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0, 122, 126, 0.1)",
                    transition: baseTransition,
                  }}
                />
              </div>

              {/* Right Column: Mission Text Content */}
              <div
                style={{
                  flex: "1 1 400px", // Flexible width, minimum 400px
                  maxWidth: "60%", // Max 60% width on larger screens
                  opacity: animated ? 1 : 0,
                  transform: animated ? "translateX(0)" : "translateX(50px)", // Slide in from right
                  transition: `opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s`,
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    padding: "20px",
                    paddingBottom: "5px",
                    paddingTop: "5px",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px", // Consistent gap between items
                  }}
                >
                  {[
                    "10% – 40% off on surgeries, treatments & diagnostics.",
                    "Free medical guidance for informed decisions.",
                    "Get 10% Cashback: Send your bill to Vaidya Bandhu via WhatsApp or Email. Cashback will be credited to your account within 7 working days.",
                    "Top doctors across all specialties and everywhere.",
                    "Free surgeries for the needy through our social impact programs.",
                    "Personalized support in selecting the Ideal Doctor, Hospital, or Diagnostic centers.",
                  ].map((item, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: 0, // Remove bottom margin since we're using gap
                        fontSize: "clamp(16px, 2vw, 18px)",
                        color: "#4a5568",
                        display: "flex",
                        fontFamily: "Poppins",
                        alignItems: "flex-start",
                        padding: "12px 8px!important",
                        backgroundColor: "rgba(0, 122, 126, 0.03)",
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 122, 126, 0.1)",
                        boxShadow: "0 4px 12px rgba(0, 77, 79, 0.06)",
                        opacity: animated ? 1 : 0,
                        transform: animated
                          ? "translateY(0)"
                          : "translateY(15px)",
                        transition: `opacity 0.8s ease-out ${
                          1.0 + index * 0.1
                        }s, transform 0.8s ease-out ${1.0 + index * 0.1}s`,
                      }}
                    >
                      <span
                        style={{
                          marginRight: "15px",
                          color: "#007a7e",
                          fontSize: "1.4rem",
                          lineHeight: "1.3",
                          flexShrink: 0,
                          marginTop: "2px", // Better alignment with first line of text
                        }}
                      >
                        ✓
                      </span>
                      <span style={{ flex: 1 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes for the floating background shapes */}
      <style>
        {`
          @keyframes floatShape1 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(25px, 25px) rotate(7deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          @keyframes floatShape2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-25px, -25px) rotate(-7deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }

          /* Responsive adjustments */
          @media (max-width: 992px) {
            .row[style*="flex-direction: column"] > div { /* All main section cards */
                padding: 30px !important; /* Adjust card padding */
            }
            h2[style*="font-size: clamp(24px, 4.5vw, 40px)"] { /* Section titles */
              font-size: clamp(28px, 5.5vw, 36px) !important;
              padding-bottom: 15px !important;
            }
            h2 span[style*="bottom: 12px"] { /* Underline position */
                bottom: 8px !important;
            }
            h2 span[style*="bottom: 0"] { /* Underline position */
                bottom: -2px !important;
            }
            p[style*="font-size: clamp(17px, 2.2vw, 19px)"],
            p[style*="font-size: clamp(20px, 3vw, 24px)"],
            li[style*="font-size: clamp(16px, 2vw, 18px)"] { /* Paragraphs and list items */
              font-size: clamp(16px, 2.8vw, 18px) !important;
            }
            li span[style*="font-size: 1.6rem"] { /* Checkmark size */
              font-size: 1.4rem !important;
              margin-right: 12px !important;
            }
            ul li { /* List item spacing */
              margin-bottom: 12px !important;
            }
            div[style*="gap: 60px"] { /* Gap between sections */
                gap: 40px !important;
            }

            /* Mission section specific adjustments for stacking */
            div[style*="display: flex"][style*="flex-wrap: wrap"][style*="gap: 30px"] { /* Mission's inner flex container */
                flex-direction: column !important; /* Stack image and text */
                gap: 30px !important; /* Adjust gap when stacked */
            }
            div[style*="flex: 1 1 300px"][style*="max-width: 40%"], /* Mission image column */
            div[style*="flex: 1 1 400px"][style*="max-width: 60%"] { /* Mission content column */
                max-width: 100% !important; /* Take full width when stacked */
                text-align: center !important; /* Center image and content */
            }
            div[style*="flex: 1 1 400px"] p, div[style*="flex: 1 1 400px"] ul { /* Mission content alignment */
                text-align: left !important; /* Keep text aligned left within its container */
            }
          }

          @media (max-width: 480px) {
            section[style*="padding: 40px 10px"] { /* Main section padding */
              padding: 30px 10px !important;
            }
            div[style*="padding: 40px"] { /* Card padding */
              padding: 20px !important;
            }
            h2[style*="font-size: clamp(24px, 4.5vw, 40px)"] { /* Section titles */
              font-size: clamp(22px, 7vw, 30px) !important;
              padding-bottom: 12px !important;
            }
            h2 span[style*="bottom: 12px"] { /* Underline position */
                bottom: 6px !important;
                width: 70px !important;
            }
            h2 span[style*="bottom: 0"] { /* Underline position */
                bottom: -4px !important;
                width: 40px !important;
            }
            p[style*="font-size: clamp(17px, 2.2vw, 19px)"],
            p[style*="font-size: clamp(20px, 3vw, 24px)"],
            li[style*="font-size: clamp(16px, 2vw, 18px)"] { /* Paragraphs and list items */
              font-size: clamp(15px, 3.5vw, 17px) !important;
            }
            li span[style*="font-size: 1.6rem"] { /* Checkmark size */
              font-size: 1.2rem !important;
              margin-right: 10px !important;
            }
            ul li { /* List item spacing */
              margin-bottom: 10px !important;
            }
            div[style*="gap: 60px"] { /* Gap between sections */
                gap: 30px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default OurStory;
