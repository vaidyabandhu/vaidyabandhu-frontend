import React from "react";
import { useNavigate } from "react-router-dom";

const FloatingVaidyabandhuCardButton = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Vaidyabandhu Card Button */}
      <div
        onClick={() => navigate("/userlogin")}
        style={{
          position: "fixed",
          bottom: "90px", // Above the call button
          right: "20px",
          width: "auto",
          minWidth: "210px",
          height: "60px",
          background: "linear-gradient(90deg, #1e293b 0%, #007a7e 100%)",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(30, 41, 59, 0.25)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          animation: "pulse 2s infinite",
          padding: "0 24px",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.background = "linear-gradient(90deg, #007a7e 0%, #1e293b 100%)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "linear-gradient(90deg, #1e293b 0%, #007a7e 100%)";
        }}
      >
        {/* Card Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "12px" }}
        >
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        <span
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textShadow: "0 2px 8px rgba(0,0,0,0.12)",
            fontFamily: 'inherit',
          }}
        >
          ಕೇವಲ 49 ರೂಪಾಯಿಗೆ ವೈದ್ಯಬಂಧು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ ಪಡೆಯಿರಿ.
        </span>
      </div>
      {/* Styles */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 4px 20px rgba(30, 41, 59, 0.25);
            }
            50% {
              box-shadow: 0 4px 20px rgba(30, 41, 59, 0.25), 0 0 0 10px rgba(0, 122, 126, 0.15);
            }
            100% {
              box-shadow: 0 4px 20px rgba(30, 41, 59, 0.25), 0 0 0 20px rgba(0, 122, 126, 0);
            }
          }
          @media (max-width: 768px) {
            div[style*="bottom: 90px"][style*="right: 20px"] {
              bottom: 70px !important;
              right: 15px !important;
              min-width: 160px !important;
              height: 45px !important;
              border-radius: 25px !important;
              padding: 0 12px !important;
            }
            span[style*="fontSize: 16px"] {
              font-size: 13px !important;
            }
            svg[style*="marginRight: 12px"] {
              width: 20px !important;
              height: 20px !important;
              margin-right: 8px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default FloatingVaidyabandhuCardButton;
