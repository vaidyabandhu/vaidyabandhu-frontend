import React, { useEffect, useState } from "react";

const Workprocess = () => {
  const [animated, setAnimated] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const videoId = "MxAB93ylwKM";
  const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
  const videoThumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 200); // Small delay to ensure CSS transitions apply
    return () => clearTimeout(timer);
  }, []);

  const openVideoPopup = () => {
    setActiveVideo(`${videoEmbedUrl}?autoplay=1`);
  };

  const closeVideoPopup = () => {
    setActiveVideo(null);
  };

  const steps = [
    {
      icon: "fas fa-id-card",
      title: "Step 1: Get Your Vaidya Bandhu Card for ₹49",
      points: [
        "Fill out a simple form with your name, address, and phone number.",
        "Activate your membership for just ₹49 per year.",
        "Receive your digital card instantly on the website or app.",
      ],
    },
    {
      icon: "flaticon-hospital",
      title: "Step 2: Access Quality Healthcare",
      points: [
        "Contact us via call, WhatsApp, or email with your health concerns.",
        "Consult trusted doctors, hospitals, and diagnostic centers in our network.",
        "Save 10%–40% on surgeries, treatments, and diagnostics.",
      ],
    },
    {
      icon: "flaticon-doctor",
      title: "Step 3: Full Healthcare Support",
      points: [
        "Get free medical guidance from experienced professionals.",
        "We support you even after treatment with follow-ups and recovery guidance.",
        "Priority assistance for critical cases.",
      ],
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)", // Softer, more inviting gradient
        padding: "40px 20px", // Increased padding
        position: "relative",
        overflow: "hidden",
        marginBottom: "10px !important",
        fontFamily: "poppins", // Modern font (assuming it's imported or fallback)
      }}
      id="how-it-works"
    >
      {/* Decorative background shapes (Optional, can be done with SVGs or more complex CSS) */}
      <div
        style={{
          position: "absolute",
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          background: "#b2ebf2", // Light teal
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          opacity: 0.3,
          filter: "blur(40px)",
          animation: "float1 8s infinite ease-in-out",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 250,
          height: 250,
          background: "#80deea", // Medium teal
          borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
          opacity: 0.3,
          filter: "blur(50px)",
          animation: "float2 10s infinite ease-in-out",
        }}
      ></div>

      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* <h2 style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 800,
          color: "#004d4f",
          textAlign: "center",
          marginBottom: "8px",
          lineHeight: "1.3"
        }}>
          How Vaidya Bandhu <span style={{ color: "#007a7e" }}>Works</span>
        </h2> */}
        <h2
          style={{
            fontSize: 34, // Larger, more impactful heading
            fontWeight: "800",
            fontFamily: "Poppins",
            color: "#004d4f",
            // margin: "20px 0 25px", // Adjusted margins
            lineHeight: 1.3,
            marginTop: 50,
          }}
        >
          How Vaidya Bandhu Works:
          <br />{" "}
          <span style={{ color: "#007a7e" }}>
            Simple Steps to Affordable and Trusted Healthcare in India
          </span>
        </h2>
        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "#4a5568",
            lineHeight: "1.3",
            fontWeight: "400",
            fontFamily: "Poppins",
            maxWidth: "1100px",
            margin: "0 auto 40px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          Vaidya Bandhu simplifies your healthcare journey by helping you find
          the right doctors, hospitals, and diagnostic centers near you. Just
          call or WhatsApp us, and we’ll guide you to quality and affordable
          care quickly.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center", // Centered items
          flexWrap: "wrap",
          gap: "30px", // Increased gap between steps
          alignItems: "stretch", // Ensures cards have same height if content varies
          position: "relative",
          zIndex: 1,
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              flex: "1 1 300px", // Flex item that grows/shrinks, with base 300px
              maxWidth: 360, // Increased max-width for each card
              background: "#ffffff",
              borderRadius: 15,
              padding: "20px 25px", // Adjusted padding
              boxShadow: "0 15px 30px rgba(0,0,0,0.08)", // More pronounced shadow
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start", // Align content to the top
              borderBottom: `5px solid ${
                ["#007a7e", "#4CAF50", "#FFC107"][idx % 3]
              }`, // Dynamic border color
              opacity: animated ? 1 : 0,
              transform: animated
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.95)",
              transition: `all 0.8s ease-out ${idx * 0.15}s`, // Staggered animation
              position: "relative",
              overflow: "hidden", // For the pseudo-element overlay
            }}
          >
            {/* Step number as a subtle overlay */}
            <div
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                fontSize: 60, // Larger font size for the number
                fontWeight: "900", // Extra bold
                color: "rgba(0, 122, 126, 0.08)", // Very faint color
                zIndex: 0, // Behind content
              }}
            >
              0{idx + 1}
            </div>

            <div
              style={{
                width: 90, // Slightly smaller icon container
                height: 90,
                margin: "0 auto 20px",
                borderRadius: "50%",
                background: "#e6fffa", // Still light background for icon
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                color: "#007a7e",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)", // Softer icon shadow
                position: "relative",
                zIndex: 1, // Above step number
              }}
            >
              <i className={step.icon}></i>
            </div>
            <h4
              style={{
                fontSize: 24, // Larger title
                fontWeight: "700", // Bolder title
                marginBottom: 15,
                color: "#1a202c",
                position: "relative",
                zIndex: 1,
              }}
            >
              {step.title}
            </h4>
            <ul
              style={{
                padding: "0 10px",
                listStyleType: "none",
                fontSize: 18, // Changed from 16 to 18px
                color: "#4a5568",
                lineHeight: 1.3, // Slightly increased for better spacing with larger font
                textAlign: "left",
                flexGrow: 1,
                position: "relative",
                zIndex: 1,
                fontFamily: "Poppins", // Optional: ensure Poppins font consistency
              }}
            >
              {step.points.map((point, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: 8, // Improved spacing between points
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      marginRight: 10,
                      color: "#007a7e",
                      fontWeight: "bold",
                    }}
                  >
                    •
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: 680,
          margin: "30px auto 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: "700",
            color: "#004d4f",
            marginBottom: 14,
            fontFamily: "Poppins",
          }}
        >
          Step-by-Step Membership Card Process
        </h3>

        <div
          onClick={openVideoPopup}
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 15px 30px rgba(0,0,0,0.14)",
            cursor: "pointer",
          }}
        >
          <img
            src={videoThumbUrl}
            alt="Watch how Vaidya Bandhu works"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.28)",
            }}
          >
            <span
              className="fas fa-play"
              style={{
                color: "#fff",
                fontSize: 34,
                background: "rgba(0, 122, 126, 0.9)",
                width: 74,
                height: 74,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </div>
          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              color: "#004d4f",
              fontFamily: "Poppins",
            }}
          >
            Watch the Complete Flow
          </p>
        </div>
      </div>

      {activeVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={closeVideoPopup}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              background: "#000",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeVideoPopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                zIndex: 2,
                background: "rgba(0,0,0,0.6)",
                border: "none",
                color: "#fff",
                fontSize: "28px",
                lineHeight: "1",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              aria-label="Close video popup"
            >
              ×
            </button>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
              <iframe
                src={activeVideo}
                title="How Vaidya Bandhu works video"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for the floating background shapes */}
      <style>
        {`
          @keyframes float1 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, 20px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes float2 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -20px); }
            100% { transform: translate(0, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default Workprocess;
