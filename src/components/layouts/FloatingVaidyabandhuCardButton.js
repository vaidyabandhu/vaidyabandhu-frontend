import React from "react";
import { useNavigate } from "react-router-dom";

const FloatingVaidyabandhuCardButton = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => navigate("/userlogin")}
        className="vb-float-btn"
      >
        {/* Icon */}
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
          className="vb-icon"
        >
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>

        {/* Flip Text */}
        <div className="vb-flip">
          <div className="vb-flip-inner">
            <div className="vb-flip-item">Vaidya Bandhu Card @ ₹49</div>
            <div className="vb-flip-item">₹49కే వైద్యబంధు హెల్త్ కార్డ్</div>
            <div className="vb-flip-item">₹49 में वैद्य बंधु हेल्थ कार्ड</div>
            <div className="vb-flip-item">₹49க்கு வைத்யா பந்து ஹெல்த் கார்ட்</div>
            <div className="vb-flip-item">₹49ക്ക് വൈദ്യ ബന്ധു ഹെൽത്ത് കാർഡ്</div>
          </div>
        </div>
      </div>

      <style>
        {`
          .vb-float-btn {
            position: fixed;
            bottom: 90px;
            right: 20px;
            height: 64px;
            padding: 0 22px;
            display: inline-flex;
            align-items: center;
            gap: 14px;
            background: linear-gradient(90deg, #1e293b 0%, #007a7e 100%);
            border-radius: 36px;
            cursor: pointer;
            box-shadow: 0 8px 26px rgba(30, 41, 59, 0.3);
            z-index: 1000;
            overflow: hidden;
            width: fit-content;          /* ✅ auto width */
            max-width: calc(100vw - 40px); /* ✅ safe on small screens */
          }

          .vb-icon {
            flex-shrink: 0;
          }

          /* Flip container */
          .vb-flip {
            height: 22px;
            overflow: hidden;
            white-space: nowrap;
          }

          .vb-flip-inner {
            display: flex;
            flex-direction: column;
            animation: vb-flip 12s infinite;
          }

          .vb-flip-item {
            height: 22px;
            display: flex;
            align-items: center;
            white-space: nowrap;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.4px;
          }

          @keyframes vb-flip {
            0%,16% { transform: translateY(0); }
            20%,36% { transform: translateY(-22px); }
            40%,56% { transform: translateY(-44px); }
            60%,76% { transform: translateY(-66px); }
            80%,100% { transform: translateY(-88px); }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .vb-float-btn {
              bottom: 70px;
              right: 14px;
              height: 50px;
              padding: 0 16px;
              border-radius: 28px;
            }

            .vb-flip {
              height: 18px;
            }

            .vb-flip-item {
              height: 18px;
              font-size: 12px;
            }

            @keyframes vb-flip {
              0%,16% { transform: translateY(0); }
              20%,36% { transform: translateY(-18px); }
              40%,56% { transform: translateY(-36px); }
              60%,76% { transform: translateY(-54px); }
              80%,100% { transform: translateY(-72px); }
            }
          }
        `}
      </style>
    </>
  );
};

export default FloatingVaidyabandhuCardButton;
