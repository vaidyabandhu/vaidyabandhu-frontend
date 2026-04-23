import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const HELP_TOPICS = {
  app: {
    label: "How to Download the App",
    steps: [
      'Click the App Store or Play Store button on our website.',
      'You will be redirected to the store page.',
      'Tap "Install" or "Get" to download the app.',
      "Open the app and register with your mobile number.",
      "Start exploring doctors, hospitals, and diagnostics near you.",
    ],
  },
  member: {
    label: "How to Become a Member",
    steps: [
      "Visit the VaidyaBandhu website or open the app.",
      'Click on "Become a Member" or "Register".',
      "Enter your name, mobile number, and email address.",
      "Choose your membership plan.",
      "Complete the payment to activate your membership.",
      "You will receive a confirmation and your member ID.",
      "Start availing discounts on surgeries, diagnostics & treatments.",
    ],
  },
};

const HelpBot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    setIsOpen(false);
    setActiveTopic(null);
  }, [location.pathname]);

  const currentTopic = activeTopic ? HELP_TOPICS[activeTopic] : null;

  return (
    <>
      <button
        type="button"
        className={`vb-helpbot-trigger${isOpen ? " vb-helpbot-trigger--active" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close VaidyaBandhu help bot" : "Open VaidyaBandhu help bot"}
        aria-expanded={isOpen}
      >
        {/* Inline SVG — immune to global button CSS interference */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block", flexShrink: 0 }}
        >
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h3V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z" />
          <circle cx="9" cy="13" r="1" fill="#ffffff" stroke="none" />
          <circle cx="15" cy="13" r="1" fill="#ffffff" stroke="none" />
          <path d="M9 17h6" />
          <line x1="8" y1="7" x2="8" y2="7" />
          <line x1="16" y1="7" x2="16" y2="7" />
        </svg>
      </button>

      {isOpen && (
        <aside
          className="vb-helpbot-panel"
          role="dialog"
          aria-modal="false"
          aria-label="VaidyaBandhu help bot"
        >
          <div className="vb-helpbot-header">
            <div className="vb-helpbot-header-brand">
              <span className="vb-helpbot-header-icon">
                <MessageCircle size={16} />
              </span>
              <div className="vb-helpbot-header-copy">
                <span className="vb-helpbot-kicker">Quick Help</span>
                <strong>VaidyaBandhu Help</strong>
              </div>
            </div>
            <button
              type="button"
              className="vb-helpbot-close"
              onClick={() => {
                setIsOpen(false);
                setActiveTopic(null);
              }}
              aria-label="Close help bot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="vb-helpbot-body">
            {!currentTopic ? (
              <div className="vb-helpbot-menu">
                <div className="vb-helpbot-intro">
                  <span className="vb-helpbot-mini-pill">Instant Support</span>
                </div>
                <p className="vb-helpbot-copy">
                  Choose one guided topic and we&apos;ll keep it simple.
                </p>

                <button
                  type="button"
                  className="vb-helpbot-option"
                  onClick={() => setActiveTopic("app")}
                >
                  <span className="vb-helpbot-option-copy">
                    <strong>How to Download the App</strong>
                    <small>See the quickest way to get started on mobile.</small>
                  </span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="vb-helpbot-option"
                  onClick={() => setActiveTopic("member")}
                >
                  <span className="vb-helpbot-option-copy">
                    <strong>How to Become a Member</strong>
                    <small>Understand the signup and payment flow.</small>
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : (
              <div className="vb-helpbot-topic">
                <h4>{currentTopic.label}</h4>
                <ol className="vb-helpbot-steps">
                  {currentTopic.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>

                <button
                  type="button"
                  className="vb-helpbot-back"
                  onClick={() => setActiveTopic(null)}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default HelpBot;
