import React, { useEffect, useState } from "react";

const MembershipCardBenefits = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredBenefitIndex, setHoveredBenefitIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    "10% – 40% Discounts on Services: Reduce costs for surgeries, treatments, and diagnostic tests at healthcare partners.",
    "Get 10% Cashback: Send your bill to Vaidya Bandhu via WhatsApp or Email. Cashback will be credited to your account within 7 working days.",
    "Statewide Karnataka Coverage: Valid at affiliated doctors, hospitals, and labs for easy access.",
    "Vaidya Bandhu Card – Just ₹49/- Unlimited Savings & Care for 365 Days.",
    "Immediate Activation: Get your digital card instantly via website or app.",
    "Effortless Auto-Renewal: Unused memberships renew automatically after one year.",
    "Complimentary Medical Advice from 9 AM to 6 PM via Our Helpline.",
    "Connect with trusted doctors and find the right hospitals with seamless location support.",
    "We help you choose the right doctors — connect with us via call, WhatsApp, email, or visit us.",
  ];

  const membershipCardImage = "assets/img/membership-card.jpg";

  return (
    <div
      className="membership-benefits"
      style={{
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
        fontFamily: "poppins",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "min(180px, 15vw)",
          height: "min(180px, 15vw)",
          backgroundColor: "rgba(0, 122, 126, 0.08)",
          borderRadius: "50%",
          filter: "blur(30px)",
          animation: "floatShape1 10s infinite ease-in-out",
          opacity: animated ? 1 : 0,
          transition: "opacity 1s ease-out",
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 34px)",
            fontWeight: 800,
            fontFamily: "poppins",
            color: "#004d4f",
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: "1.3",
          }}
        >
          Big Savings. Full Support. Just ₹49/Year <br />
          <span
            style={{ color: "#007a7e", fontFamily: "poppins" }}
          >
            Vaidya Bandhu Card: Key to Affordable Healthcare in India.
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
            margin: "0 auto 0px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          Join Vaidya Bandhu for just ₹49/year and unlock trusted medical care
          and perks—now in Karnataka, coming soon to pan India.
        </p>

        {/* Content Container */}
        <div
          className="content-wrapper"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginTop: "0",
            width: "100%",
          }}
        >
          {/* Image - Centered and properly sized */}
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={membershipCardImage}
              alt="Membership Card"
              style={{
                width: "100%",
                maxWidth: "450px",
                height: "auto",
                borderRadius: "16px",
                boxShadow: "0 20px 40px rgba(0, 122, 126, 0.2)",
              
                display: "block",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x250?text=Card+Image";
              }}
            />
          </div>

          {/* Benefits List - Tightly spaced */}
          <div
            style={{
              flex: "1 1 500px",
              minWidth: "320px",
              maxWidth: "600px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background:
                      hoveredBenefitIndex === index
                        ? "rgba(0, 122, 126, 0.08)"
                        : "transparent",
                    transition: "all 0.3s ease",
                    borderBottom: "1px solid rgba(0, 122, 126, 0.15)",
                    transform:
                      hoveredBenefitIndex === index
                        ? "translateX(10px)"
                        : "translateX(0)",
                  }}
                  onMouseEnter={() => setHoveredBenefitIndex(index)}
                  onMouseLeave={() => setHoveredBenefitIndex(null)}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#007a7e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "14px",
                      flexShrink: 0,
                      boxShadow: "0 4px 8px rgba(0, 122, 126, 0.2)",
                    }}
                  >
                    <span style={{ color: "#fff", fontSize: "14px" }}>✔</span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(16px, 2.5vw, 18px)",
                      color: "#4a5568",
                      lineHeight: "1.3",
                    }}
                  >
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes floatShape1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(20px, 20px) rotate(8deg); }
          }

          .membership-benefits {
            --content-max-width: 1200px;
          }
         
          @media (min-width: 769px) {
            .membership-benefits > div > div:last-child {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 30px !important;
            }
            div[style*="maxWidth: 500px"],
            div[style*="maxWidth: 600px"] {
              max-width: calc(var(--content-max-width) / 2) !important;
            }
          }
         
          @media (max-width: 768px) {
            .content-wrapper {
              flex-direction: column !important;
              gap: 0 !important;
            }
            .membership-benefits {
              padding: 25px 15px !important;
            }
            .membership-benefits > div {
              padding: 0 10px !important;
            }
            .membership-benefits h2 {
              margin-bottom: 15px !important;
            }
            .membership-benefits p {
              margin-bottom: 15px !important;
            }
            div[style*="minWidth: 320px"] {
              min-width: 100% !important;
              padding: 10px !important;
            }
          }
         
          @media (max-width: 480px) {
            .membership-benefits {
              padding: 15px 10px !important;
            }
            .membership-benefits > div {
              padding: 0 5px !important;
            }
            .content-wrapper {
              gap: 0 !important;
              margin: 0 !important;
            }
            div[style*="minWidth: 320px"] {
              min-width: 100% !important;
              padding: 5px !important;
            }
            div[style*="gap: 8px"] {
              gap: 4px !important;
            }
            div[style*="padding: 12px 16px"] {
              padding: 8px 10px !important;
            }
            .membership-benefits img {
              max-width: 100% !important;
              margin: 0 !important;
            }
            .membership-benefits p {
              font-size: 16px !important;
              line-height: 1.3 !important;
              margin-bottom: 10px !important;
            }
            div[style*="marginRight: 14px"] {
              margin-right: 8px !important;
              width: 24px !important;
              height: 24px !important;
            }
            div[style*="flex: 0 1 500px"],
            div[style*="flex: 1 1 500px"] {
              flex: 0 1 100% !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MembershipCardBenefits;
