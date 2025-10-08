import React, { Fragment, useState, useEffect, useCallback } from "react";
import Mobilemenu from "./Mobilemenu";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
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
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Update login state
    setIsLoggedIn(false);
    
    // Dispatch custom event to notify other components about logout
    window.dispatchEvent(new CustomEvent("login-state-changed", { detail: { isLoggedIn: false } }));
    
    // Navigate to home page
    navigate("/");
  };

  return (
    <Fragment>
      {/* Mobile Menu */}
      <aside className={navMethod ? "sigma_aside aside-open" : "sigma_aside"}>
        <Mobilemenu />
        {/* Added membership button in mobile menu */}
        {!isLoggedIn ? (
          <div className="p-3 text-center">
            <MembershipModal />
            {/* Added login button in mobile menu */}
            <div className="mt-2">
              <LoginModal />
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
                  // background: 'none',
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
            
            {/* Membership button */}
            <div className="mb-2">
              <MembershipModal />
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
  style={{
    color: "#fff",
    textDecoration: "none",
    fontSize: "18px", // 🔹 increased font size
    fontWeight: "500",
  }}
>
  <i
    className="fal fa-mobile"
    style={{ marginRight: "5px", fontSize: "20px" }} 
  />
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
                      `menu-item ${item.child ? "menu-item-has-children" : ""} ${isActiveItem(item, currentPath) ? "active" : ""}`
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
                              `menu-item ${sub.child ? "menu-item-has-children" : ""} ${isActiveItem(sub, currentPath) ? "active" : ""}`
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
                      {/* Login Button UI - Only for desktop */}
                      <li className="d-none d-sm-block">
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
        `}
      </style>
    </Fragment>
  );
};

export default Header;