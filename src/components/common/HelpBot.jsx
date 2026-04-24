import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const AiAssistIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="2.35" />
    <path d="M12 5.5v3" />
    <path d="M12 15.5v3" />
    <path d="M5.5 12h3" />
    <path d="M15.5 12h3" />
    <path d="M7.35 7.35l2.15 2.15" />
    <path d="M14.5 14.5l2.15 2.15" />
    <path d="M16.65 7.35l-2.15 2.15" />
    <path d="M9.5 14.5l-2.15 2.15" />
    <circle cx="12" cy="4.25" r="1.15" />
    <circle cx="12" cy="19.75" r="1.15" />
    <circle cx="4.25" cy="12" r="1.15" />
    <circle cx="19.75" cy="12" r="1.15" />
  </svg>
);

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
        <AiAssistIcon size={26} />
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
                <AiAssistIcon size={18} />
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
              <span className="vb-helpbot-close-icon" aria-hidden="true">
                &times;
              </span>
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
