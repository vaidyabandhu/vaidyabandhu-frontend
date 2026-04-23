import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navigation from "../../data/navigation.json";

const ANNOUNCEMENT_MESSAGES = [
  "Get the Vaidya Bandhu Health Card for just ₹49 and unlock trusted care support.",
  "सिर्फ ₹49 में वैद्य बंधु हेल्थ कार्ड पाएं और भरोसेमंद स्वास्थ्य सहायता का लाभ उठाएं।",
  "ಕೇವಲ ₹49ಕ್ಕೆ ವೈದ್ಯ ಬಂಧು ಹೆಲ್ತ್ ಕಾರ್ಡ್ ಪಡೆದು ವಿಶ್ವಾಸಾರ್ಹ ಆರೋಗ್ಯ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ.",
  "வெறும் ₹49க்கு வைத்திய பந்து ஹெல்த் கார்டைப் பெற்று நம்பகமான சுகாதார உதவியைப் பெறுங்கள்.",
  "కేవలం ₹49కు వైద్య బంధు హెల్త్ కార్డ్ పొందండి మరియు విశ్వసనీయ ఆరోగ్య సహాయాన్ని పొందండి.",
  "फक्त ₹49 मध्ये वैद्य बंधु हेल्थ कार्ड घ्या आणि विश्वासार्ह आरोग्य सहाय्य मिळवा.",
  "വെറും ₹49യ്ക്ക് വൈദ്യ ബന്ധു ഹെൽത്ത് കാർഡ് നേടി വിശ്വസനീയമായ ആരോഗ്യ സഹായം നേടൂ.",
];
const CARD_BUTTON_LABELS = ["₹49 Card", "₹49 ಕಾರ್ಡ್", "₹49 कार्ड", "₹49 కార్డ్"];

const isProfileActive = (profile = {}) => {
  const payload =
    profile?.data && typeof profile.data === "object" ? profile.data : profile;
  const primary =
    payload?.primary_member && typeof payload.primary_member === "object"
      ? payload.primary_member
      : payload?.primaryMember && typeof payload.primaryMember === "object"
        ? payload.primaryMember
        : {};

  const rawStatus =
    primary.is_active ??
    primary.active ??
    primary.isActive ??
    primary.membership_active ??
    payload.is_active ??
    payload.active ??
    payload.isActive ??
    payload.membership_active ??
    primary.status ??
    payload.status;

  if (typeof rawStatus === "boolean") return rawStatus;
  if (typeof rawStatus === "number") return rawStatus === 1;
  if (typeof rawStatus === "string") {
    const normalized = rawStatus.trim().toLowerCase();
    if (
      [
        "true",
        "1",
        "active",
        "paid",
        "captured",
        "verified",
        "success",
        "completed",
        "enabled",
        "activated",
      ].includes(normalized)
    ) {
      return true;
    }
    if (
      [
        "false",
        "0",
        "inactive",
        "pending",
        "failed",
        "cancelled",
        "disabled",
      ].includes(normalized)
    ) {
      return false;
    }
  }

  return false;
};

const normalizePath = (path = "") => path.replace(/\/$/, "") || "/";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );
  const [cardLabelIndex, setCardLabelIndex] = useState(0);

  useEffect(() => {
    const handleAuthChanged = (event) => {
      if (event?.detail?.isLoggedIn !== undefined) {
        setIsLoggedIn(Boolean(event.detail.isLoggedIn));
      } else {
        setIsLoggedIn(Boolean(localStorage.getItem("token")));
      }
    };

    const handleStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("login-state-changed", handleAuthChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("login-state-changed", handleAuthChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCardLabelIndex((previous) => (previous + 1) % CARD_BUTTON_LABELS.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, []);

  const isActive = useMemo(
    () => (link) => normalizePath(link) === normalizePath(location.pathname),
    [location.pathname]
  );

  const handleLoginPage = () => {
    navigate("/userlogin");
  };

  const handleIconClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/basic-details");
      return;
    }

    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/profile/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (isProfileActive(data)) {
          navigate("/myprofile");
        } else {
          navigate("/basic-details");
        }
      } else {
        navigate("/basic-details");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error in handleIconClick:", error);
      navigate("/basic-details");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    setIsLoggedIn(false);
    window.dispatchEvent(
      new CustomEvent("login-state-changed", {
        detail: { isLoggedIn: false },
      })
    );
    navigate("/");
  };

  const announcementLine = ANNOUNCEMENT_MESSAGES.join(" ● ");
  const announcementItems = Array.from({ length: 1 }, () => announcementLine);
  const currentCardLabel = CARD_BUTTON_LABELS[cardLabelIndex];

  return (
    <Fragment>
      <div className="vb-announcement" role="status" aria-live="polite">
        <div className="vb-announcement-track">
          {announcementItems.map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </div>
      </div>

      <aside
        className={`vb-mobile-drawer ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="vb-mobile-top">
          <Link className="vb-brand" to="/" aria-label="Go to homepage">
            <img
              src={process.env.PUBLIC_URL + "/assets/img/logoo.png"}
              alt="Vaidya Bandhu"
            />
          </Link>
          <button
            type="button"
            className="vb-mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close mobile menu"
          >
            ×
          </button>
        </div>

        <ul className="vb-mobile-nav">
          {navigation.map((item) => (
            <li key={`${item.id}-${item.link}`}>
              <Link to={item.link}>{item.linkText}</Link>
            </li>
          ))}
        </ul>

        <div className="vb-mobile-footer-actions">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="vb-btn vb-btn-primary"
                onClick={handleIconClick}
              >
                My Profile
              </button>
              <button
                type="button"
                className="vb-btn vb-btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="vb-btn vb-btn-alert vb-card-cta-rotator"
                onClick={handleLoginPage}
              >
                {currentCardLabel}
              </button>
              <button
                type="button"
                className="vb-btn vb-btn-primary"
                onClick={handleLoginPage}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="vb-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              setMobileOpen(false);
            }
          }}
          aria-label="Close mobile menu overlay"
        />
      )}

      <header className="vb-header" aria-label="Main site header">
        <div className="vb-header-inner">
          <Link className="vb-brand" to="/" aria-label="Go to homepage">
            <img
              src={process.env.PUBLIC_URL + "/assets/img/logoo.png"}
              alt="Vaidya Bandhu"
            />
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="vb-nav">
              {navigation.map((item) => (
                <li className="vb-nav-item" key={`${item.id}-${item.link}`}>
                  <Link
                    to={item.link}
                    className={`vb-nav-link ${
                      isActive(item.link) ? "is-active" : ""
                    }`}
                    aria-current={isActive(item.link) ? "page" : undefined}
                  >
                    {item.linkText}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="vb-header-actions">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="vb-btn vb-btn-primary"
                  onClick={handleIconClick}
                >
                  My Profile
                </button>
                <button
                  type="button"
                  className="vb-btn vb-btn-secondary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="vb-btn vb-btn-alert vb-card-cta-rotator"
                  onClick={handleLoginPage}
                >
                  {currentCardLabel}
                </button>
                <button
                  type="button"
                  className="vb-btn vb-btn-primary"
                  onClick={handleLoginPage}
                >
                  Log in
                </button>
              </>
            )}

            <button
              type="button"
              className="vb-mobile-toggle"
              onClick={() => setMobileOpen((previous) => !previous)}
              aria-label="Toggle mobile navigation"
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="vb-global-header-spacer" aria-hidden="true" />
    </Fragment>
  );
};

export default Header;
