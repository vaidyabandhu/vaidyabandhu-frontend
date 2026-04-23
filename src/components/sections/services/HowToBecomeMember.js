import React, { useEffect, useState } from "react";

const HowToBecomeMember = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const sectionStyle = {
    padding: "40px 20px",
    background: "linear-gradient(135deg, #f5fdfd 0%, #e0f7fa 100%)",
    fontFamily: "Poppins",
    color: "#4a5568",
    lineHeight: "1.4",
    overflow: "hidden",
    position: "relative",
    textAlign: "center",
    minHeight: "600px",
  };

  const headingStyle = {
    fontSize: "clamp(22px, 4.5vw, 36px)",
    fontWeight: 800,
    color: "#002a2c",
    marginBottom: "15px",
    lineHeight: "1.3",
    fontFamily: "Poppins",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(-20px)",
    transition: "opacity 1s ease-out, transform 1s ease-out",
  };

  const subHeadingStyle = {
    fontSize: "clamp(18px, 2.5vw, 19px)",
    color: "#4a5568",
    maxWidth: "900px",
    fontFamily: "Poppins",
    margin: "0 auto 20px",
    lineHeight: "1.4",
    fontWeight: "400",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
  };

  const stepsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Poppins",
    padding: "0 10px",
    position: "relative",
    zIndex: 1,
    textAlign: "left",
  };

  const connectorLineStyle = {
    position: "absolute",
    left: "40px",
    top: "30px",
    bottom: "30px",
    width: "2px",
    background: "linear-gradient(to bottom, #007a7e, #004d4f)",
    zIndex: 0,
    opacity: animated ? 0.7 : 0,
    transition: "opacity 1s ease-out 0.8s",
  };

  const stepItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    position: "relative",
    padding: "15px 0",
    opacity: 0,
    transform: "translateY(50px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
    zIndex: 1,
  };

  const stepNumberStyle = {
    width: "60px",
    height: "60px",
    minWidth: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #007a7e, #004d4f)",
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "semibold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "30px",
    boxShadow: "0 6px 20px rgba(0, 122, 126, 0.3)",
    flexShrink: 0,
    transition: "all 0.3s ease",
    fontFamily: "Poppins",
  };

  const stepContentStyle = {
    flexGrow: 1,
    paddingLeft: "10px",
    borderLeft: "2px solid rgba(0, 122, 126, 0.2)",
    paddingBottom: "10px",
    paddingTop: "5px",
    fontFamily: "Poppins",
  };

  const stepTitleStyle = {
    fontSize: "clamp(22px, 2.8vw, 26px)",
    fontWeight: 700,
    color: "#002a2c",
    marginBottom: "8px",
    lineHeight: "1.3",
    fontFamily: "Poppins",
  };

  const stepDescriptionStyle = {
    fontSize: "clamp(16px, 2.2vw, 18px)",
    color: "#5a6778",
    lineHeight: "1.6",
    fontFamily: "Poppins",
  };

  const buttonContainerStyle = {
    marginTop: "60px",
    opacity: animated ? 1 : 0,
    transform: animated ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s ease-out 1.5s, transform 0.8s ease-out 1.5s",
    fontFamily: "Poppins",
  };

  return (
    <section style={sectionStyle}>
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: "min(120px, 12vw)",
          height: "min(120px, 12vw)",
          backgroundColor: "rgba(0, 122, 126, 0.06)",
          borderRadius: "50%",
          filter: "blur(30px)",
          animation: "driftRotate1 15s infinite ease-in-out alternate",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "min(150px, 15vw)",
          height: "min(150px, 15vw)",
          backgroundColor: "rgba(0, 122, 126, 0.04)",
          borderRadius: "50%",
          filter: "blur(35px)",
          animation: "driftRotate2 18s infinite ease-in-out alternate-reverse",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: "min(80px, 8vw)",
          height: "min(80px, 8vw)",
          backgroundColor: "rgba(0, 122, 126, 0.07)",
          borderRadius: "50%",
          filter: "blur(25px)",
          animation: "driftRotate3 12s infinite ease-in-out alternate",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: "min(100px, 10vw)",
          height: "min(100px, 10vw)",
          backgroundColor: "rgba(0, 122, 126, 0.03)",
          transform: "rotate(45deg)",
          filter: "blur(20px)",
          animation: "diagonalMove 14s infinite ease-in-out alternate",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "5%",
          width: "min(250px, 25vw)",
          height: "min(250px, 25vw)",
          backgroundColor: "rgba(0, 122, 126, 0.02)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          filter: "blur(40px)",
          animation: "pulseScale 20s infinite ease-in-out alternate",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>

      <div
        className="container"
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "0 10px",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          fontFamily: "Poppins",
        }}
      >
        <h2 style={headingStyle}>
          How to Become a{" "}
          <span style={{ color: "#007a7e", fontFamily: "Poppins" }}>
            Member
          </span>
        </h2>
        <p style={subHeadingStyle}>
          Joining Vaidya Bandhu is simple and straightforward. Follow these easy
          steps to unlock a year of exclusive healthcare benefits.
        </p>

        <div style={stepsContainerStyle}>
          <div style={connectorLineStyle}></div>

          {/* Step 1 */}
          <div
            style={{
              ...stepItemStyle,
              transitionDelay: "0.6s",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(50px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1.1) rotate(5deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1) rotate(0deg)";
            }}
          >
            <div style={stepNumberStyle}>1</div>
            <div style={stepContentStyle}>
              <h3 style={stepTitleStyle}>Step 1:  Activate Your ₹49 Membership</h3>
              <p style={stepDescriptionStyle}>
               Access our healthcare network and add your family in minutes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              ...stepItemStyle,
              transitionDelay: "0.9s",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(50px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1.1) rotate(5deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1) rotate(0deg)";
            }}
          >
            <div style={stepNumberStyle}>2</div>
            <div style={stepContentStyle}>
              <h3 style={stepTitleStyle}>Step 2: Get Support for Consultations & Hospital Care</h3>
              <p style={stepDescriptionStyle}>
              We guide you to the right doctors, hospitals, and diagnostics based on your need.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            style={{
              ...stepItemStyle,
              transitionDelay: "1.2s",
              opacity: animated ? 1 : 0,
              transform: animated ? "translateY(0)" : "translateY(50px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1.1) rotate(5deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("div").style.transform =
                "scale(1) rotate(0deg)";
            }}
          >
            <div style={stepNumberStyle}>3</div>
            <div style={stepContentStyle}>
              <h3 style={stepTitleStyle}>
                Step 3: Save on Surgeries & admissions + Receive cost savings
              </h3>
              <p style={stepDescriptionStyle}>
            Reduce your treatment costs and get money back on eligible treatments.
              </p>
            </div>
          </div>
        </div>

        {/* Button Container */}
        <div style={buttonContainerStyle}>
          {/* Placeholder for MembershipModal button */}
          {/* <MembershipModal /> */}
        </div>
      </div>
    </section>
  );
};

export default HowToBecomeMember;