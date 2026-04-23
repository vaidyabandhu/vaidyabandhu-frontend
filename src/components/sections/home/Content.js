import React, { Fragment, useEffect, useState } from "react";
import Banner from "./Banner";
import Services from "./Services";
import Testimonials from "./Testimonials";
import Workprocess from "./Workprocess";
import HealthcareReality from "./HealthcareReality";
import MembershipCardBenefits from "./MembershipCardBenefits";
import ClientLogosCarousel from "./ClientLogosCarousel";
import Counter from "../about/Counter";
import AppDownloadSection from "./AppDownloadSection";

const popupHighlights = [
  "Save 10% to 40% on surgeries, treatments, and diagnostics Services.",
  "Get 10% Cashback: Send your medical bill to Vaidya Bandhu via WhatsApp or Email. Cashback will be credited to your account within 7 working days.",
  "Free surgeries available for those in need through our social programs.",
  "Call our helpline from 9 AM to 6 PM for free medical advice.",
  "We help you choose the right doctor, hospital, or diagnostic center.",
];

const Content = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (window.localStorage.getItem("vb_popup_shown") === "true") {
      return undefined;
    }

    const openTimer = window.setTimeout(() => {
      window.localStorage.setItem("vb_popup_shown", "true");
      setShowWelcomePopup(true);
    }, 500);

    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    if (!showWelcomePopup || typeof window === "undefined") {
      return undefined;
    }

    const closeTimer = window.setTimeout(() => {
      setShowWelcomePopup(false);
    }, 3000);

    return () => window.clearTimeout(closeTimer);
  }, [showWelcomePopup]);

  const handleClosePopup = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vb_popup_shown", "true");
    }
    setShowWelcomePopup(false);
  };

  return (
    <Fragment>
      <Banner />
      <Services />
      <ClientLogosCarousel />
      <Testimonials />
      <section className="vb-section">
        <div className="vb-container">
          <div className="vb-home-counter-panel">
            <div className="vb-home-counter-copy">
              <span className="vb-pill">Our Reach</span>
              <h2 className="vb-section-heading">Trusted by growing families across care journeys</h2>
              <p className="vb-section-subheading">
                A quick look at the network patients use for guided doctors, hospitals,
                diagnostics, and membership support.
              </p>
            </div>
            <Counter />
          </div>
        </div>
      </section>
      <Workprocess />
      <HealthcareReality />
      <MembershipCardBenefits />
      <AppDownloadSection />

      {showWelcomePopup && (
        <div
          className="vb-popup-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Vaidya Bandhu welcome benefits"
          onClick={handleClosePopup}
        >
          <div
            className="vb-popup-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="vb-popup-close"
              onClick={handleClosePopup}
              aria-label="Close welcome popup"
            >
              ×
            </button>

            <span className="vb-pill">Welcome to Vaidya Bandhu</span>
            <h3 className="vb-popup-title">Here’s what your care support can unlock</h3>

            <ul className="vb-popup-list">
              {popupHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Content;
