import React, { useEffect, useMemo, useState } from "react";

const playStoreUrl = process.env.REACT_APP_PLAYSTORE_URL || "";
const appStoreUrl = process.env.REACT_APP_APPSTORE_URL || "";

const AppRedirect = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ua = window.navigator.userAgent;

    if (/android/i.test(ua) && playStoreUrl) {
      window.location.replace(playStoreUrl);
      return;
    }

    if (/iphone|ipad|ipod/i.test(ua) && appStoreUrl) {
      window.location.replace(appStoreUrl);
      return;
    }

    setStatus("manual");
  }, []);

  const manualCopy = useMemo(() => {
    if (status !== "manual") {
      return "Redirecting you to the right app store...";
    }

    return "Choose your app store below.";
  }, [status]);

  return (
    <main className="vb-app-redirect-page">
      <section className="vb-app-redirect-card">
        <span className="vb-pill">VaidyaBandhu App</span>
        <h1>Download the app</h1>
        <p>{manualCopy}</p>

        {status === "manual" && (
          <div className="vb-app-redirect-actions">
            <a
              className="vb-app-store-btn"
              href={appStoreUrl || "#"}
              onClick={(event) => {
                if (!appStoreUrl) {
                  event.preventDefault();
                }
              }}
            >
              <i className="fab fa-apple" aria-hidden="true" />
              <span>Download on App Store</span>
            </a>
            <a
              className="vb-app-store-btn"
              href={playStoreUrl || "#"}
              onClick={(event) => {
                if (!playStoreUrl) {
                  event.preventDefault();
                }
              }}
            >
              <i className="fab fa-google-play" aria-hidden="true" />
              <span>Get it on Google Play</span>
            </a>
          </div>
        )}

        {status === "manual" && (!appStoreUrl || !playStoreUrl) && (
          <p className="vb-app-redirect-note">
            Store links can be added through `REACT_APP_APPSTORE_URL` and
            `REACT_APP_PLAYSTORE_URL`.
          </p>
        )}
      </section>
    </main>
  );
};

export default AppRedirect;
