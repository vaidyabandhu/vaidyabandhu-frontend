import React, { useState, useEffect } from "react";

const FloatingCallButton = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const phoneNumber = "+91 8535853589";
  const phoneNumberClean = "+91 8535853589"; // For tel: links

  useEffect(() => {
    // Detect if device can make calls (mobile or Mac)
    const checkCanCall = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isMac = /Mac/i.test(userAgent);
      setIsMobile(isMobileDevice || isMac);
    };
    checkCanCall();
    window.addEventListener("resize", checkCanCall);
    return () => window.removeEventListener("resize", checkCanCall);
  }, []);

  const handleCallClick = async () => {
    if (isMobile) {
      // On mobile and Mac, initiate call
      window.location.href = `tel:${phoneNumberClean}`;
    } else {
      // On Windows, copy number to clipboard
      try {
        await navigator.clipboard.writeText(phoneNumber);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = phoneNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    }
  };

  return (
    <>
      {/* Floating Call Button */}
      <div
        onClick={handleCallClick}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          backgroundColor: "#007a7e",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0, 122, 126, 0.4)",
          zIndex: 1000,
          transition: "all 0.3s ease",
          animation: "pulse 2s infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = "#004d4f";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "#007a7e";
        }}
      >
        {/* Phone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.18 2.19l-.7.35a18.33 18.33 0 0 0 6 6l.35-.7a2 2 0 0 1 2.19-1.18 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </div>

      {/* Helpline Text Tooltip */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "90px",
          backgroundColor: "#1a202c",
          color: "#ffffff",
          padding: "8px 12px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          opacity: 0,
          transform: "translateX(10px)",
          transition: "all 0.3s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
        className="helpline-tooltip"
      >
        {isMobile
          ? "Tap to Call Helpline Number"
          : "Click to Copy Number the Helpline Number"}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-6px",
            transform: "translateY(-50%)",
            width: "0",
            height: "0",
            borderLeft: "6px solid #1a202c",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
          }}
        />
      </div>

      {/* Success Message */}
      {showMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#48bb78",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 15px rgba(72, 187, 120, 0.3)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "slideIn 0.3s ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          Helpline Number copied to clipboard!
        </div>
      )}

      {/* Styles */}
      <style>
        {`
                    @keyframes pulse {
                        0% {
                            box-shadow: 0 4px 20px rgba(0, 122, 126, 0.4);
                        }
                        50% {
                            box-shadow: 0 4px 20px rgba(0, 122, 126, 0.4), 0 0 0 10px rgba(0, 122, 126, 0.2);
                        }
                        100% {
                            box-shadow: 0 4px 20px rgba(0, 122, 126, 0.4), 0 0 0 20px rgba(0, 122, 126, 0);
                        }
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    /* Show tooltip on hover */
                    div:hover + .helpline-tooltip,
                    .helpline-tooltip:hover {
                        opacity: 1 !important;
                        transform: translateX(0) !important;
                        pointer-events: auto !important;
                    }

                    /* Mobile responsiveness */
                    @media (max-width: 768px) {
                        div[style*="bottom: 20px"][style*="right: 20px"] {
                            bottom: 15px !important;
                            right: 15px !important;
                            width: 55px !important;
                            height: 55px !important;
                        }
                        
                        div[style*="bottom: 30px"][style*="right: 90px"] {
                            bottom: 25px !important;
                            right: 80px !important;
                            font-size: 12px !important;
                            padding: 6px 10px !important;
                        }
                    }
                `}
      </style>
    </>
  );
};

export default FloatingCallButton;
