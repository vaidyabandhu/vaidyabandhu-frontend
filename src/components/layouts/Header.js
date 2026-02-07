import React, { Fragment, useState, useEffect, useCallback } from "react";
import Mobilemenu from "./Mobilemenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navigation from "../../data/navigation.json";
import "../../assets/css/Header.css";
import FloatingVaidyabandhuCardButton from "./FloatingVaidyabandhuCardButton";

// Custom Hamburger Menu Component
const CustomHamburgerMenu = ({ isOpen, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="aside-toggle aside-trigger d-inline-block d-md-none"
      style={{
        width: "40px",
        height: "40px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        transition: "background-color 0.3s ease",
        backgroundColor: "transparent",
        padding: "0",
        margin: "0",
        border: "none",
        zIndex: 1001,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "transparent")
      }
      aria-label="Open navigation menu"
    >
      <div
        style={{
          width: "18px",
          height: "2px",
          backgroundColor: "#333",
          borderRadius: "1px",
          transition: "all 0.3s ease",
          transform: isOpen
            ? "rotate(45deg) translate(0px, 7px)"
            : "rotate(0deg)",
          marginBottom: isOpen ? "0px" : "3px",
        }}
      />
      <div
        style={{
          width: "18px",
          height: "2px",
          backgroundColor: "#333",
          borderRadius: "1px",
          transition: "all 0.3s ease",
          opacity: isOpen ? "0" : "1",
          marginBottom: isOpen ? "0px" : "3px",
        }}
      />
      <div
        style={{
          width: "18px",
          height: "2px",
          backgroundColor: "#333",
          borderRadius: "1px",
          transition: "all 0.3s ease",
          transform: isOpen
            ? "rotate(-45deg) translate(0px, -7px)"
            : "rotate(0deg)",
          marginBottom: "0px",
        }}
      />
    </div>
  );
};

// NewsTicker component for sticky news bar
const NewsTicker = () => {
  // The message to repeat
  const message = `| Get the Vaidyabandhu Health Card for just ₹49 \u00A0|\u00A0 ಕೇವಲ ₹49ಕ್ಕೆ ವೈದ್ಯಬಂಧು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ \u00A0|\u00A0 కేవలం ₹49కే వైద్యబంధు హెల్త్ కార్డ్ పొందండి \u00A0|\u00A0 வெறும் ₹49க்கு வைத்தியபந்து ஹெல்த் கார்டைப் பெறுங்கள் \u00A0|\u00A0 വെറും ₹49ക്ക് വൈദ്യബന്ധു ഹെൽത്ത് കാർഡ് നേടൂ \u00A0|\u00A0 सिर्फ ₹49 में वैद्यबंधु हेल्थ कार्ड प्राप्त करें`;
  // Repeat the message enough times to fill the ticker
  const repeatCount = 8;
  const repeated = Array(repeatCount).fill(message).join(' ');
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1202,
        background: "linear-gradient(90deg, #0f172a, #1e293b)",
        color: "#fff",
        fontWeight: 400,
        fontSize: "16px",
        letterSpacing: "0.5px",
        overflow: "hidden",
        height: "44px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 12px rgba(0,122,126,0.10)",
        borderBottom: "2px solid #00ffe7cc",
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "ticker-scroll 120s linear infinite",
          paddingLeft: 0,
        }}
      >
        {repeated}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const HEADER_OFFSET = 44; // px, height of the news ticker

// Custom hook for nav actions
const useNavHelper = () => {
  const [navMethod, setNavMethod] = useState(false);
  const [searchMethod, setSearchMethod] = useState(false);
  const [windowSize] = useState("");
  const [stickyHeader, setStickyHeader] = useState(0);
  const toggleNav = useCallback(() => {
    setNavMethod((prev) => !prev);
  }, []);
  const toggleSearch = useCallback(() => {
    setSearchMethod((prev) => !prev);
  }, []);
  const StickyHeader = useCallback(() => {
    const windowY = window.scrollY;
    const stickyHeader = windowY > 100;
    setStickyHeader(stickyHeader);
  }, []);
  const getNextSibling = useCallback((elem, selector) => {
    var sibling = elem.nextElementSibling;
    if (!selector) return sibling;
    while (sibling) {
      if (sibling.matches(selector)) return sibling;
      sibling = sibling.nextElementSibling;
    }
  }, []);
  const triggerChild = useCallback(
    (e) => {
      let subMenuClass = "sub-menu";
      let subMenu =
        getNextSibling(e.target, "." + subMenuClass) !== undefined
          ? getNextSibling(e.target, "." + subMenuClass)
          : null;
      if (subMenu !== null && subMenu !== undefined && subMenu !== "") {
        subMenu.classList = subMenu.classList.contains("d-block")
          ? subMenuClass
          : subMenuClass + " d-block";
      }
    },
    [getNextSibling]
  );
  useEffect(() => {
    window.addEventListener("scroll", StickyHeader);
    return () => {
      window.removeEventListener("scroll", StickyHeader);
    };
  }, [StickyHeader]);
  return {
    navMethod,
    searchMethod,
    windowSize,
    stickyHeader,
    toggleNav,
    toggleSearch,
    triggerChild,
  };
};

const normalizePath = (path) => {
  return path.replace(/\/$/, "");
};

const isActiveItem = (item, currentPath) => {
  const normalizedItemLink = normalizePath(item.link);
  const normalizedPath = normalizePath(currentPath);

  if (normalizedItemLink === normalizedPath) {
    return true;
  }

  if (item.child && item.submenu) {
    return item.submenu.some(subItem => isActiveItem(subItem, currentPath));
  }

  return false;
};

const Header = () => {
  const { navMethod, toggleNav } = useNavHelper();
  const [userPhone, setUserPhone] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const storedUserPhone = localStorage.getItem("userPhone");
    if (storedUserPhone) {
      setUserPhone(storedUserPhone);
    }

    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Listen for login state changes
    const handleLoginStateChange = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      if (event.detail.isLoggedIn) {
        const storedUserPhone = localStorage.getItem("userPhone");
        setUserPhone(storedUserPhone);
      } else {
        setUserPhone(null);
      }
    };

    window.addEventListener("login-state-changed", handleLoginStateChange);

    return () => {
      window.removeEventListener("login-state-changed", handleLoginStateChange);
    };
  }, []);

  // Handle profile icon click
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
        if (data?.is_active === true) {
          navigate("/myprofile");
        } else {
          navigate("/basic-details");
        }
      } else {
        navigate("/basic-details");
      }
    } catch (error) {
      console.error("Error in handleIconClick:", error);
      navigate("/basic-details");
    }
  };

  const handleLogout = () => {
    // Remove userPhone from localStorage
    localStorage.removeItem("userPhone");

    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Update login state
    setIsLoggedIn(false);

    // Dispatch custom event to notify other components about logout
    window.dispatchEvent(new CustomEvent("login-state-changed", { detail: { isLoggedIn: false } }));

    // Navigate to home page
    navigate("/");
  };

  // Add handler for login button
  const handleLoginPage = () => {
    navigate("/userlogin");
  };

  return (
    <Fragment>
      <NewsTicker />
      {/* Mobile Menu: only visible when hamburger is clicked */}
      <aside
        className={navMethod ? "sigma_aside aside-open" : "sigma_aside"}
        aria-hidden={!navMethod}
        aria-label="Mobile Navigation"
        style={{ display: navMethod ? 'block' : 'none' }}
      >
        <Mobilemenu />
        {!isLoggedIn ? (
          <div className="p-3 text-center">

            <div className="mt-2">
              <button
                onClick={handleLoginPage}
                className="sigma_btn btn-sm premium-btn vb-flip-highlight"
                style={{
                  width: "100%",
                  borderRadius: 12,
                  background: "linear-gradient(90deg, #C62828 0%, #8E0000 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  padding: "12px 0",
                  fontSize: 18,
                  boxShadow:
                    "0 4px 16px rgba(198,40,40,0.45), 0 2px 8px rgba(0,0,0,0.25)",
                  border: "none",
                  letterSpacing: 0.3,
                  overflow: "hidden",
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  outline: "2px solid #fff176",
                  outlineOffset: "2px",
                  animation: "vb-flip-highlight-glow 1.5s infinite alternate",
                }}
                aria-label="Vaidyabandhu Health Card Offer"
              >
                <div
                  className="vb-flip-inner"
                  style={{
                    lineHeight: 1,
                    minWidth: 200,
                    minHeight: 24,
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: 0.3,
                    textShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    textAlign: "center",
                  }}
                >
                  <div className="vb-flip-inner vb-flip-mobile">
                    <span className="vb-flip-item">₹49 Card</span>
                    <span className="vb-flip-item">₹49 ಕಾರ್ಡ್</span>
                    <span className="vb-flip-item">₹49 कार्ड</span>
                    <span className="vb-flip-item">₹49 కార్డ్</span>
                  </div>

                </div>
              </button>

              <button
                className="buy-membership-btn"
                style={{ width: '100%', padding: '10px 0', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', marginTop: 8, marginBottom: 8, letterSpacing: 0.2, transition: 'background 0.2s' }}
                onClick={handleLoginPage}
              >
                Log in
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 text-center">
            {/* User icon */}
            <div className="mb-3">
              <button
                className="user-icon-btn"
                onClick={handleIconClick}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>

            {/* My Profile button for mobile */}
            <div className="mb-2">
              <button onClick={handleIconClick} className="sigma_btn btn-sm" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
                My Profile
              </button>
            </div>
            {/* Logout button */}
            <div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onClick={handleLogout}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "#c82333";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "#dc3545";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <svg style={{ marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
      {navMethod && (
        <div
          className="sigma_aside-overlay aside-trigger"
          onClick={toggleNav}
          aria-label="Close mobile menu"
          tabIndex={0}
          role="button"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleNav(); }}
          style={{ cursor: 'pointer' }}
        />
      )}
      {/* Header */}
      <header
        className={`sigma_header header-absolute style-5 other can-sticky${navMethod ? " mobile-menu-open" : ""}`}
        style={{
          position: "fixed",
          top: HEADER_OFFSET,
          left: 0,
          right: 0,
          zIndex: navMethod ? 1001 : 1000,
          background: "linear-gradient(90deg, #e0f7fa 0%, #f8fafc 100%)",
          boxShadow: "0 4px 24px 0 rgba(0, 122, 126, 0.10)",
          borderBottom: "1.5px solid #e0e7ef",
          transition: "all 0.3s ease",
          backdropFilter: "blur(8px)",
        }}
        aria-label="Site Header"
      >
        {/* Header Middle (Logo + Nav + Controls) */}
        <div className="sigma_header-middle">
          <div className="container-fluid">
            <div className="navbar" style={{ minHeight: 90, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                className="sigma_logo-wrapper premium-logo-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* LOGO */}
                <Link
                  to="/"
                  className="sigma_logo premium-logo-link"
                  aria-label="Vaidyabandhu Home"
                >
                  <img
                    src={process.env.PUBLIC_URL + "/assets/img/logoo.png"}
                    alt="Vaidyabandhu Logo"
                    className="responsive-header-logo"
                    style={{
                      width: "170px",
                      height: "auto",
                      padding: "8px",
                      display: "block",
                    }}
                  />
                </Link>

                {/* 🔴 MOBILE ₹49 FLIP BUTTON (ONLY MOBILE, BEFORE HAMBURGER) */}
                <div className="mobile-header-flip d-block d-md-none">
                  <button
                    onClick={handleLoginPage}
                    className="sigma_btn btn-sm premium-btn vb-flip-highlight"
                    style={{
                      borderRadius: 16,
                      background: "linear-gradient(90deg, #C62828 0%, #8E0000 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      padding: "6px 12px",
                      fontSize: 12,
                      height: 34,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      border: "none",
                      outline: "2px solid #fff176",
                      outlineOffset: "2px",
                      boxShadow: "0 4px 14px rgba(198,40,40,0.45)",
                    }}
                    aria-label="Health Card ₹49"
                  >
                    <div
                      className="vb-flip-inner"
                      style={{
                        height: 20,
                        minWidth: 90,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      <div className="vb-flip-inner vb-flip-mobile">
                        <span className="vb-flip-item">₹49 Card</span>
                        <span className="vb-flip-item">₹49 ಕಾರ್ಡ್</span>
                        <span className="vb-flip-item">₹49 कार्ड</span>
                        <span className="vb-flip-item">₹49 కార్డ్</span>
                      </div>

                    </div>
                  </button>
                </div>
              </div>

              {/* Desktop Navigation: only show on desktop (>=768px) */}
              <nav className="navbar-nav responsive-navbar-nav d-none d-md-flex" style={{ display: 'flex', alignItems: 'center', gap: 8 }} aria-label="Main Navigation">
                {navigation.map((item, i) => (

                  <li
                    key={i}
                    className={`menu-item ${item.child ? "menu-item-has-children" : ""} ${isActiveItem(item, currentPath) ? "active" : ""}`}
                    style={{ margin: '0 2px' }}
                  >
                    {item.child ? (
                      <Link to="#" className="nav-link-premium" style={{ borderRadius: 22, padding: '8px 14px', fontWeight: 500, color: '#007a7e', background: 'transparent', fontSize: 15, transition: 'background 0.2s, color 0.2s' }} aria-haspopup="true" aria-expanded="false">{item.linkText}</Link>
                    ) : (
                      <Link to={item.link} className="nav-link-premium" style={{ borderRadius: 22, padding: '8px 14px', fontWeight: 600, color: isActiveItem(item, currentPath) ? '#fff' : '#007a7e', background: isActiveItem(item, currentPath) ? 'linear-gradient(90deg, #00908d 0%, #1e293b 100%)' : 'transparent', boxShadow: isActiveItem(item, currentPath) ? '0 2px 8px #b2f5ea33' : 'none', fontSize: 15, transition: 'background 0.2s, color 0.2s' }} aria-current={isActiveItem(item, currentPath) ? 'page' : undefined}>{item.linkText}</Link>
                    )}
                    {/* Submenus remain unchanged */}
                    {item.child && (
                      <ul className="sub-menu">
                        {item.submenu.map((sub, j) => (
                          <li
                            key={j}
                            className={`menu-item ${sub.child ? "menu-item-has-children" : ""} ${isActiveItem(sub, currentPath) ? "active" : ""}`}
                          >
                            {sub.child ? (
                              <Link to="#">{sub.linkText}</Link>
                            ) : (
                              <Link to={sub.link}>{sub.linkText}</Link>
                            )}
                            {sub.child && (
                              <ul className="sub-menu">
                                {sub.submenu.map((deep, k) => (
                                  <li
                                    key={k}
                                    className={`menu-item ${isActiveItem(deep, currentPath) ? "active" : ""}`}
                                  >
                                    <Link to={deep.link}>{deep.linkText}</Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </nav>
              {/* Header Controls */}
              <div className="sigma_header-controls style-2" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ul className="sigma_header-controls-inner" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {isLoggedIn ? (
                    <>

                      <li className="d-none d-sm-block">
                        <button onClick={handleIconClick} className="sigma_btn btn-sm premium-btn" style={{ borderRadius: 22, background: 'linear-gradient(90deg, #00908d 0%, #1e293b 100%)', color: '#fff', fontWeight: 700, padding: '10px 28px', fontSize: 18, boxShadow: '0 2px 8px #b2f5ea33', border: 'none', letterSpacing: 0.2, cursor: 'pointer' }}>
                          My Profile
                        </button>
                      </li>
                      <li className="d-none d-sm-block">
                        <button
                          onClick={handleLogout}
                          className="btn btn-sm btn-outline-light ms-2 premium-btn"
                          style={{ borderRadius: 22, background: '#fff', color: '#007a7e', fontWeight: 700, padding: '10px 28px', fontSize: 18, border: '1.5px solid #00908d', boxShadow: '0 2px 8px #b2f5ea22', transition: 'background 0.2s, color 0.2s', letterSpacing: 0.2 }}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      {/* Flip Login Button (ONLY FIRST SLOT) */}
                      <li className="d-none d-sm-block">
                        <button
                          onClick={handleLoginPage}
                          className="sigma_btn btn-sm premium-btn vb-flip-highlight"
                          style={{
                            borderRadius: 22,
                            background: "linear-gradient(90deg, #C62828 0%, #8E0000 100%)",
                            color: "#fff",
                            fontWeight: 800,
                            padding: "10px 28px",
                            fontSize: 16,
                            boxShadow: "0 4px 16px #ffb30055, 0 2px 8px #b2f5ea33",
                            border: "none",
                            letterSpacing: 0.2,
                            overflow: "hidden",
                            height: 42,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 2,
                            outline: "3px solid #fff176",
                            outlineOffset: "2px",
                            transition: "box-shadow 0.3s, outline 0.3s",
                            animation: "vb-flip-highlight-glow 1.5s infinite alternate"
                          }}
                          aria-label="Vaidyabandhu Card Offer"
                        >
                          <div className="vb-flip-inner" style={{ lineHeight: 1, minWidth: 180, minHeight: 24, fontSize: 18, fontWeight: 800, letterSpacing: 0.2, textShadow: '0 2px 8px #ffb30055' }}>
                            <div className="vb-flip-inner vb-flip-mobile">
                              <span className="vb-flip-item">₹49 Card</span>
                              <span className="vb-flip-item">₹49 ಕಾರ್ಡ್</span>
                              <span className="vb-flip-item">₹49 कार्ड</span>
                              <span className="vb-flip-item">₹49 కార్డ్</span>
                            </div>

                          </div>
                        </button>
                      </li>

                      {/* Normal Login Button (SECOND ONE – unchanged) */}
                      <li className="d-none d-sm-block">
                        <button
                          className="sigma_btn btn-sm premium-btn"
                          style={{
                            borderRadius: 22,
                            background: "linear-gradient(90deg, #00908d 0%, #1e293b 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            padding: "10px 28px",
                            fontSize: 18,
                            boxShadow: "0 2px 8px #b2f5ea33",
                            border: "none",
                            letterSpacing: 0.2,
                          }}
                          onClick={handleLoginPage}
                        >
                          Log in
                        </button>
                      </li>
                    </>


                  )}
                  {/* Hamburger menu: only visible below md (mobile/tablet) */}
                  <li className="d-block d-md-none mobile-hamburger">
                    <CustomHamburgerMenu
                      isOpen={navMethod}
                      onClick={toggleNav}
                      aria-label="Open navigation menu"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Subtle divider under header */}
        <div style={{ width: '100%', height: 3, background: 'linear-gradient(90deg, #b2f5ea 0%, #e0e7ef 100%)', opacity: 0.7, boxShadow: '0 1px 4px #b2f5ea22' }} />
      </header>
      <style>{`
        .premium-logo-wrapper:hover .premium-brand-text {
          color: #00908d !important;
        }
        .premium-logo-link:hover {
          box-shadow: 0 8px 32px #00908d33 !important;
        }
        .nav-link-premium:hover {
          color: #fff !important;
          background: linear-gradient(90deg, #00908d 0%, #1e293b 100%) !important;
        }
        @media (max-width: 768px) {
          .responsive-header-logo {
            width: 110px !important;
            padding: 4px !important;
          }
          .responsive-navbar-nav {
            gap: 2px !important;
          }
          .nav-link-premium {
            font-size: 13px !important;
            padding: 6px 10px !important;
          }
          .premium-btn {
            font-size: 15px !important;
            padding: 8px 16px !important;
          }
        }
        /* Selected desktop nav link should be white */
        @media (min-width: 768px) {
          .navbar-nav .menu-item.active > .nav-link-premium {
            color: #fff !important;
            background: linear-gradient(90deg, #00908d 0%, #1e293b 100%) !important;
            box-shadow: 0 2px 8px #b2f5ea33 !important;
            padding: 8px 14px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            border-radius: 22px !important;
          }
          /* Match login/myprofile/logout button styles to active nav */
          .premium-btn {
            padding: 8px 14px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            border-radius: 22px !important;
          }
        }
        .vb-flip-inner {
          display: inline-block;
          position: relative;
          height: 24px;
          min-width: 180px;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          overflow: hidden;
          vertical-align: middle;
        }
      
        
        @keyframes vb-flip-vertical {
          0% { opacity: 0; transform: translateY(100%); }
          5% { opacity: 1; transform: translateY(0); }
          15% { opacity: 1; transform: translateY(0); }
          20% { opacity: 0; transform: translateY(-100%); }
          100% { opacity: 0; transform: translateY(-100%); }
        }
        .vb-flip-inner .vb-flip-item {
          position: absolute;
          left: 0; right: 0;
          top: 0;
          width: 100%;
          opacity: 0;
          pointer-events: none;
        }
        .vb-flip-inner .vb-flip-item:nth-child(1) { animation-delay: 0s; }
        .vb-flip-inner .vb-flip-item:nth-child(2) { animation-delay: 1.2s; }
        .vb-flip-inner .vb-flip-item:nth-child(3) { animation-delay: 2.4s; }
        .vb-flip-inner .vb-flip-item:nth-child(4) { animation-delay: 3.6s; }
        .vb-flip-inner .vb-flip-item:nth-child(5) { animation-delay: 4.8s; }
        .vb-flip-inner .vb-flip-item:nth-child(6) { animation-delay: 6.0s; }
     /* 🔁 CONTINUOUS FLIP LOOP (MOBILE HEADER SAFE) */
.vb-flip-item {
  display: block;
  height: 20px;
  line-height: 20px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  opacity: 0;
  animation-name: vb-flip-vertical;
  animation-duration: 4.8s; /* 4 items × 1.2s */
  animation-timing-function: cubic-bezier(0.77,0,0.175,1);
  animation-iteration-count: infinite;
}
.vb-flip-item {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, "Helvetica Neue", Arial, sans-serif !important;
  font-variant-numeric: lining-nums;
}

/* EXACT DELAYS FOR 4 ITEMS */
.vb-flip-item:nth-child(1) { animation-delay: 0s; }
.vb-flip-item:nth-child(2) { animation-delay: 1.2s; }
.vb-flip-item:nth-child(3) { animation-delay: 2.4s; }
.vb-flip-item:nth-child(4) { animation-delay: 3.6s; }

        @keyframes vb-flip-highlight-glow {
          0% { box-shadow: 0 0 0 0 #fff17655, 0 4px 16px #ffb30055; }
          100% { box-shadow: 0 0 16px 8px #fff17655, 0 4px 32px #ffb30099; }
        }
      `}</style>
      <style>
        {`
          @media (max-width: 768px) {
            .sigma_header-top-inner {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
              padding: 6px 10px;
            }
            .sigma_header-top-contacts {
              display: flex !important;
              flex-shrink: 0;
            }
            .sigma_header-top-contacts a i {
              font-size: 14px;
            }
            @media (max-width: 460px) {
              .sigma_header-top-inner {
                flex-direction: column;
                align-items: stretch;
                gap: 4px;
                text-align: right;
              }
              .sigma_header-top-links {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
                gap: 2px !important;
                font-size: 12px !important;
              }
              .sigma_header-top-links a,
              .sigma_header-top-links > div {
                font-size: 11px !important;
                color: #fff;
              }
              .sigma_header-top-links i {
                font-size: 12px;
                margin-right: 4px;
              }
            }
            @media (min-width: 461px) and (max-width: 768px) {
              .sigma_header-top-links {
                gap: 10px !important;
                font-size: 13px;
              }
              .sigma_header-top-links i {
                margin-right: 4px;
              }
            }
           
            /* New styles for mobile layout */
            .navbar {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
           
            .sigma_header-controls-inner {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
              gap: 10px;
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
            }
           
            .mobile-hamburger {
              order: 1;
            }
            
            /* Style for user icon button in mobile menu */
            .user-icon-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: #f8f9fa;
              border: 2px solid #dee2e6;
              margin: 0 auto;
              transition: all 0.3s ease;
            }
            
            .user-icon-btn:hover {
              background-color: #e9ecef;
              border-color: #adb5bd;
            }
            
       
          }
          /* Hide hamburger on desktop */
          .sigma_header-controls-inner .aside-toggle {
            display: none !important;
          }
          @media (max-width: 991px) {
            .sigma_header-controls-inner .aside-toggle {
              display: flex !important;
            }
          }
          /* Hamburger close/cross style */
          .sigma_close.aside-trigger {
            position: relative !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            justify-content: center !important;
            alignItems: center !important;
            cursor: pointer !important;
            border-radius: 50% !important;
            transition: background-color 0.3s ease !important;
          }
          .sigma_close.aside-trigger:hover {
            background-color: "#007a7e !important;
          }
          .sigma_close.aside-trigger span {
            position: absolute !important;
            width: 18px !important;
            height: 2px !important;
            background-color: #333 !important;
            border-radius: 1px !important;
            transition: all 0.3s ease !important;
          }
          .sigma_close.aside-trigger:hover span {
            background-color: #fff !important;
          }
          .sigma_close.aside-trigger span:first-child {
            transform: rotate(45deg) !important;
          }
          .sigma_close.aside-trigger span:last-child {
            transform: rotate(-45deg) !important;
          }
          /* Style for membership button in mobile menu */
          .sigma_aside .sigma_btn {
            width: 100%;
            margin-top: 15px;
          }
          /* Ensure header stays above mobile menu */
          .sigma_header.mobile-menu-open {
            z-index: 1001 !important;
          }
          /* Custom styles to align buttons */
          .sigma_header-controls-inner {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .sigma_header-controls-inner .d-none.d-sm-block {
            margin: 0;
            padding: 0;
          }
          .sigma_header-controls-inner .btn {
            white-space: nowrap;
          }
          
          .navbar-nav .menu-item.active > a {
            color: #00908d !important;
            font-weight: bold;
            font-size: 1.1em; /* 增加字体大小 */
            transition: all 0.3s ease; /* 添加平滑过渡效果 */
            position: relative;
          }

          .navbar-nav .menu-item.active > a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 3px;
            border-radius: 2px;
          }
          
          .navbar-nav .menu-item.active > .sub-menu {
            display: block;
          }
          
          .navbar-nav .menu-item > a {
            color: #333;
            font-weight: 500;
            padding: 10px 15px;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .navbar-nav .menu-item > a:hover {
            color: #00908d;
          }
            @media (max-width: 768px) {
  .premium-logo-wrapper {
    max-width: calc(100% - 80px); /* room for hamburger */
  }

  .mobile-header-flip {
    flex-shrink: 0;
  }

  .vb-flip-inner {
    min-width: 90px !important;
  }
}
  /* ================================
   MOBILE FLIP – SMOOTH & STABLE
================================ */

.vb-flip-mobile {
  position: relative;
  height: 20px;
  width: 90px;
  overflow: hidden;
  will-change: transform;
}

.vb-flip-mobile .vb-flip-item {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  opacity: 0;
  transform: translateY(100%);
  animation: vb-mobile-flip 4.8s ease-in-out infinite;
  will-change: transform, opacity;
}

/* EXACT TIMING — 4 ITEMS */
.vb-flip-mobile .vb-flip-item:nth-child(1) { animation-delay: 0s; }
.vb-flip-mobile .vb-flip-item:nth-child(2) { animation-delay: 1.2s; }
.vb-flip-mobile .vb-flip-item:nth-child(3) { animation-delay: 2.4s; }
.vb-flip-mobile .vb-flip-item:nth-child(4) { animation-delay: 3.6s; }

@keyframes vb-mobile-flip {
  0%   { opacity: 0; transform: translateY(100%); }
  8%   { opacity: 1; transform: translateY(0); }
  25%  { opacity: 1; transform: translateY(0); }
  33%  { opacity: 0; transform: translateY(-100%); }
  100% { opacity: 0; transform: translateY(-100%); }
}


        `}
      </style>
    </Fragment>
  );
};

export default Header;