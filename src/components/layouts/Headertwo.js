import React, { Fragment, useState, useEffect, useCallback } from "react";
import Mobilemenu from "./Mobilemenu";
import { Link } from "react-router-dom";
import navigation from "../../data/navigation.json";
import MembershipModal from "./MembershipModal";
import "../../assets/css/Header.css";
import LoginModal from "./LoginModal";


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
const Header = () => {
  const { navMethod, toggleNav } = useNavHelper();
  const [userPhone, setUserPhone] = useState(null);
  useEffect(() => {
    const storedUserPhone = localStorage.getItem("userPhone");
    if (storedUserPhone) {
      setUserPhone(storedUserPhone);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    window.location.reload();
  };
  return (
    <Fragment>
      {/* Mobile Menu */}
      <aside className={navMethod ? "sigma_aside aside-open" : "sigma_aside"}>
        <Mobilemenu />
        {/* Added membership button in mobile menu */}
        {!userPhone && (
          <div className="p-3 text-center">
            <MembershipModal />
          </div>
        )}
      </aside>
      {navMethod && (
        <div
          className="sigma_aside-overlay aside-trigger"
          onClick={toggleNav}
        />
      )}
      {/* Header */}
      <header
        className={`sigma_header header-absolute style-5 other can-sticky ${
          navMethod ? "mobile-menu-open" : ""
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: navMethod ? 1001 : 1000,
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Header Top - Hidden on mobile */}
        <div className="sigma_header-top dark-bg d-none d-md-block">
          <div className="container-fluid">
            <div
              className="sigma_header-top-inner"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              {/* Left: Social Icons */}
              <div
                className="sigma_header-top-contacts mobile-margin"
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <Link
                  to="https://www.facebook.com/profile.php?id=61578623333168"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#3b5998",
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <i
                    className="fab fa-facebook-f"
                    style={{ fontSize: "16px", color: "#fff" }}
                  />
                </Link>
                <Link
                  to="https://www.youtube.com/@VaidyaBandhu"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#cd201f", // Red background color
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <i
                    className="fab fa-youtube"
                    style={{ fontSize: "16px", color: "#fff" }}
                  />
                </Link>
                <Link
                  to="https://x.com/vaidya_bandhu"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#000", // Black background color
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="/assets/img/t-i.png" // Local image path
                    alt="Twitter X"
                    style={{
                      width: "20px", // Adjust image size as needed
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                </Link>
                <Link
                  to="https://www.instagram.com/vaidyabandhu/"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#E1306C", // Instagram color
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <img
                    src="/assets/img/i-i.png" // Local image path
                    alt="Instagram"
                    style={{
                      width: "20px", // Adjust image size as needed
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                </Link>
                <Link
                  to="#"
                  style={{
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#0a66c2", // LinkedIn background color
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  <i
                    className="fab fa-linkedin-in"
                    style={{ fontSize: "16px", color: "#fff" }}
                  />{" "}
                  {/* LinkedIn icon */}
                </Link>
              </div>
              {/* Right: Contact Info */}
              <div
                className="sigma_header-top-links"
                style={{
                  display: "flex",
                  gap: "15px",
                  fontSize: "14px",
                  color: "#fff",
                }}
              >
                <a
                  href="mailto:support@vaidyabandhu.com"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i
                    className="fal fa-envelope"
                    style={{ marginRight: "5px" }}
                  />{" "}
                  support@vaidyabandhu.com
                </a>
                <Link to="#" style={{ color: "#fff", textDecoration: "none" }}>
                  <i
                    className="fal fa-map-marker-alt"
                    style={{ marginRight: "5px" }}
                  />{" "}
                  Bangalore
                </Link>
                <a
                  href="tel:+918535853589"
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <i
                    className="fal fa-mobile"
                    style={{ marginRight: "5px" }}
                  />{" "}
                  +91 8535 8535 89
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Header Middle (Logo + Nav + Controls) */}
        <div className="sigma_header-middle">
          <div className="container-fluid">
            <div className="navbar">
              <div className="sigma_logo-wrapper">
                <Link to="/" className="sigma_logo">
                  <img
                    src={process.env.PUBLIC_URL + "/assets/img/logoo.png"}
                    alt="logo"
                    style={{ borderRadius: "20px" }}
                  />
                </Link>
              </div>
              <ul className="navbar-nav">
                {navigation.map((item, i) => (
                  <li
                    key={i}
                    className={
                      item.child
                        ? "menu-item menu-item-has-children"
                        : "menu-item"
                    }
                  >
                    {item.child ? (
                      <Link to="#">{item.linkText}</Link>
                    ) : (
                      <Link to={item.link}>{item.linkText}</Link>
                    )}
                    {item.child && (
                      <ul className="sub-menu">
                        {item.submenu.map((sub, j) => (
                          <li
                            key={j}
                            className={
                              sub.child
                                ? "menu-item menu-item-has-children"
                                : "menu-item"
                            }
                          >
                            {sub.child ? (
                              <Link to="#">{sub.linkText}</Link>
                            ) : (
                              <Link to={sub.link}>{sub.linkText}</Link>
                            )}
                            {sub.child && (
                              <ul className="sub-menu">
                                {sub.submenu.map((deep, k) => (
                                  <li className="menu-item" key={k}>
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
              </ul>
              <div className="sigma_header-controls style-2">
                <ul className="sigma_header-controls-inner">
                  {userPhone ? (
                    <>
                      <li className="d-none d-sm-block">
                        <Link to="/profile" className="sigma_btn btn-sm">
                          My Profile
                        </Link>
                      </li>
                      <li className="d-none d-sm-block">
                        <button
                          onClick={handleLogout}
                          className="btn btn-sm btn-outline-light ms-2"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                     
                      {/* Existing Membership Button */}
                      <li className="d-none d-sm-block">
                        <MembershipModal />
                      </li>
                      {/* Login Button UI */}
                      <li className="d-none d-sm-block">
                        {/* <button
                          className="sigma_btn btn-sm"
                          style={{
                            backgroundColor: "#00908d",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            transition: "all 0.3s ease",
                            whiteSpace: "nowrap", // Prevents text from wrapping
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#007a7e")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#00908d")
                          }
                        >
                          Login
                        </button> */}
                        <LoginModal/>
                      </li>
                    </>
                  )}
                  {/* Hamburger menu: only visible below md (mobile/tablet) */}
                  <li className="d-block d-md-none mobile-hamburger">
                    <CustomHamburgerMenu
                      isOpen={navMethod}
                      onClick={toggleNav}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Responsive styles and hamburger/cross controls */}
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
            background-color: #007a7e !important;
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
        `}
      </style>
    </Fragment>
  );
};
export default Header;
