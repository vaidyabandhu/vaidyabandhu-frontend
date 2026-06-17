import React, { useEffect, useMemo, useRef, useState } from "react";

const AppDownloadSection = () => {
  const qrCodeRef = useRef(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const redirectUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/app-redirect`;
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !qrCodeRef.current ||
      !redirectUrl ||
      typeof window.QRCode !== "function"
    ) {
      return;
    }

    qrCodeRef.current.innerHTML = "";

    // Render a fresh QR whenever the site origin changes.
    new window.QRCode(qrCodeRef.current, {
      text: redirectUrl,
      width: 164,
      height: 164,
      colorDark: "#1b6b45",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H,
    });
  }, [redirectUrl]);

  return (
    <section className="vb-section vb-app-download">
      <div className="vb-container">
        <div className="vb-app-download-card">
          <div className="vb-app-download-copy">
            <span className="vb-pill">Mobile App</span>
            <h2 className="vb-section-heading">Download Our App</h2>
            <p className="vb-section-subheading">
              Scan the QR code to open the right store page on your phone, or use
              the store buttons below.
            </p>
          </div>

          <div className="vb-app-download-content">
            <div className="vb-app-qr-shell">
              <div className="vb-app-qr" ref={qrCodeRef} />
            </div>

            <div className="vb-app-store-actions">
              <button
                type="button"
                className="vb-app-store-btn"
                onClick={() => setShowComingSoon(true)}
              >
                <i className="fab fa-apple" aria-hidden="true" />
                <span>Download on App Store</span>
              </button>

              <a
                href="https://play.google.com/store/apps/details?id=com.vadiyabandhu.app&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
                className="vb-app-store-btn"
              >
                <i className="fab fa-google-play" aria-hidden="true" />
                <span>Get it on Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {showComingSoon && (
        <div
          className="vb-app-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="App launch status"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="vb-app-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="vb-app-modal-close"
              aria-label="Close app availability modal"
              onClick={() => setShowComingSoon(false)}
            >
              ×
            </button>
            <h3>Coming Soon!</h3>
            <p>Our app will be available shortly.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AppDownloadSection;
