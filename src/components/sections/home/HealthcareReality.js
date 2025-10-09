import React, { useEffect, useState } from "react";

const HealthcareReality = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts with a slight delay
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "linear-gradient(135deg, #fdfefe 0%, #e8f5e9 100%)", // Very light, calming gradient
        textAlign: "center",
        overflow: "hidden",
        fontFamily: "Poppins",
        position: "relative",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "5%", // Adjusted for responsiveness
          width: "min(150px, 15vw)", // Responsive width
          height: "min(150px, 15vw)", // Responsive height
          backgroundColor: "rgba(0, 122, 126, 0.05)",
          borderRadius: "50%",
          filter: "blur(30px)",
          animation: "floatCircle1 10s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0, // Ensure it's behind content
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%", // Adjusted for responsiveness
          width: "min(200px, 20vw)", // Responsive width
          height: "min(200px, 20vw)", // Responsive height
          backgroundColor: "rgba(0, 122, 126, 0.03)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "floatCircle2 12s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0, // Ensure it's behind content
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "min(100px, 10vw)",
          height: "min(100px, 10vw)",
          backgroundColor: "rgba(0, 122, 126, 0.04)",
          borderRadius: "50%",
          filter: "blur(25px)",
          animation: "floatCircle3 8s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          width: "90%", // Responsive width
          maxWidth: "1100px", // Increased max width for content
          margin: "0 auto",
          position: "relative",
          zIndex: 1, // Ensure content is above background elements
        }}
      >
        {/* Main Heading */}
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: "#004d4f",
            textAlign: "center",
            marginBottom: "8px",
            lineHeight: "1.3",
            fontFamily: "Poppins",
          }}
        >
          The Reality of{" "}
          <span style={{ color: "#007a7e" }}>Modern Healthcare </span>
        </h2>

        {/* Subtitle/Intro Paragraph */}
        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 24px)", // Responsive font size
            color: "#4a5568",
            lineHeight: "1.3",
            fontWeight: "600",
            fontFamily: "Poppins", 
            marginBottom: "10px",
            marginLeft: "50px",
            marginRight: "50px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          Accessing quality healthcare today is becoming unaffordable for many.
        </p>

        {/* Combined Key Challenges Section (now the main paragraph) */}
        <div
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(20px)",
            transition:
              "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
            padding: "0 10px", 
            textAlign: "center", // Changed from left to center
            display: "flex", // Added for centering
            justifyContent: "center", // Added for centering
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
    color: "#4a5568",
    maxWidth: "900px",
    margin: "8px auto 50px",
    lineHeight: "1.5",
    fontWeight: "400",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            Thousands of families face financial burden during medical
            emergencies, surgeries, and chronic treatments. Rising hospital
            costs, difficulty finding the right doctors, and limited financial
            support often result in health complications or even preventable
            loss of life.
          </p>
        </div>
      </div>

      {/* Keyframes for the floating background circles */}
      <style>
        {`
          @keyframes floatCircle1 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, 20px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes floatCircle2 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -20px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes floatCircle3 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(15px, -15px); }
            100% { transform: translate(0, 0); }
          }

          /* Responsive adjustments using media queries for finer control */
          @media (max-width: 768px) {
            div[style*="padding: 80px 20px"] { /* Section padding */
              padding: 60px 15px !important;
            }
            div[style*="width: 90%"] { /* Main content wrapper */
              width: 95% !important;
            }
          }

       @media (max-width: 480px) {
  /* Adjust section padding */
  div[style*="padding: 40px 20px"] {
    padding: 40px 10px !important;
  }

  /* Main content wrapper */
  div[style*="width: 90%"] {
    width: 100% !important;
    padding: 0 10px;
    box-sizing: border-box;
  }

  /* Intro paragraph: Set font size to 16px and line height to 1.3 */
  p[style*="clamp(16px, 2.5vw, 22px)"] {
    font-size: 16px !important;
    line-height: 1.3 !important;
  }

  /* FAQ answer text: Ensure consistent readability */
  p[style*="font-size: clamp(15px, 2vw, 17px)"] {
    font-size: 16px !important;
    line-height: 1.3 !important;
  }

  /* Question header padding */
  div[style*="padding: 20px 25px"] {
    padding: 15px !important;
  }

  /* Question font size */
  h4 {
    font-size: clamp(16px, 3.5vw, 18px) !important;
  }

  /* Arrow size */
  span[style*="font-size: 16px"] {
    font-size: 20px !important;
  }
}
        `}
      </style>
    </div>
  );
};

export default HealthcareReality;