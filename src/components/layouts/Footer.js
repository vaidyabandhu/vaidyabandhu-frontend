import React, { useEffect, useState } from "react";
import FloatingCallButton from "./helpline";
import FloatingVaidyabandhuCardButton from "./FloatingVaidyabandhuCardButton";
import { Link } from "react-router-dom";

// Dummy serviceblock data as we cannot access local JSON files
const dummyServiceblock = [
  { title: "Consult a Doctor", path: "/services/consult-doctor" },
  { title: "Surgeries & Treatments", path: "/services/surgeries-treatments" },
  { title: "Free Surgeries", path: "/services/free-surgeries" },
  { title: "Diagnostic Tests", path: "/services/diagnostic-tests" },
  { title: "One-Stop Solution", path: "/services/one-stop-solution" },
];

const Footer = () => {
  const [animated, setAnimated] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    return () => clearTimeout(timer);
  }, []);

  const baseTransition = "all 0.3s ease-in-out";

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setSubscriptionMessage("Please enter a valid email address");
      setSubscriptionStatus("error");
      return;
    }

    if (!token) {
      setSubscriptionMessage("Authentication required. Please log in to subscribe.");
      setSubscriptionStatus("error");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage("");
    setSubscriptionStatus(null);

    try {
      const response = await fetch("https://admin.vaidyabandhu.com/api/user/subscribe/", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionMessage(
          data.message || "Thank you for subscribing! You'll receive our latest updates via email."
        );
        setSubscriptionStatus("success");
        setEmail("");
      } else {
        setSubscriptionMessage(data.message || "Subscription failed. Please try again later.");
        setSubscriptionStatus("error");
      }
    } catch (error) {
      setSubscriptionMessage("An error occurred. Please check your connection and try again.");
      setSubscriptionStatus("error");
      console.error("Subscription error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const iconCircleStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#007a7e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)",
    flexShrink: 0,
  };

  const socialIconStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    textAlign: "center",
    textDecoration: "none",
    transition: baseTransition,
    flexShrink: 0,
  };

  return (
    <footer
      className="vb-footer-root"
      style={{
        background: "linear-gradient(135deg, #003d3f 0%, #001a1b 100%)",
        paddingTop: "56px",
        paddingBottom: "0",
        fontFamily: "Poppins, sans-serif",
        color: "#a0aec0",
        overflow: "hidden",
        position: "relative",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
      }}
    >
      <FloatingCallButton />
      {/* <FloatingVaidyabandhuCardButton className="vb-fancy-float" /> */}

      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "0%",
          width: "min(100px, 10vw)",
          height: "min(100px, 10vw)",
          backgroundColor: "rgba(0, 122, 126, 0.1)",
          borderRadius: "50%",
          filter: "blur(20px)",
          animation: "floatShape3 8s infinite ease-in-out",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "0%",
          width: "min(120px, 12vw)",
          height: "min(120px, 12vw)",
          backgroundColor: "rgba(0, 122, 126, 0.08)",
          borderRadius: "50%",
          filter: "blur(25px)",
          animation: "floatShape4 10s infinite ease-in-out",
          zIndex: 0,
        }}
      />

      <div
        className="vb-footer-container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          position: "relative",
          zIndex: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="vb-footer-top-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "22px",
            marginBottom: "42px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(26px)",
            transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          <div
            className="vb-contact-card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              textAlign: "left",
              minWidth: 0,
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={iconCircleStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                <circle cx="12" cy="9" r="3"></circle>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#a0aec0",
                  lineHeight: "1.4",
                }}
              >
                Our Address
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                Bengaluru - 560078
              </p>
            </div>
          </div>

          <div
            className="vb-contact-card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              textAlign: "left",
              minWidth: 0,
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={iconCircleStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.18 2.19l-.7.35a18.33 18.33 0 0 0 6 6l.35-.7a2 2 0 0 1 2.19-1.18 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#a0aec0",
                  lineHeight: "1.4",
                }}
              >
                Call Us - Helpline
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                +91 8535 8535 89
              </p>
            </div>
          </div>

          <div
            className="vb-contact-card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              textAlign: "left",
              minWidth: 0,
              padding: "18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={iconCircleStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#a0aec0",
                  lineHeight: "1.4",
                }}
              >
                Our Mail
              </p>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                support@vaidyabandhu.com
              </p>
            </div>
          </div>
        </div>

        <div
          className="vb-footer-middle"
          style={{
            padding: "40px 0 38px 0",
            borderTop: "1px solid rgba(0, 122, 126, 0.2)",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(26px)",
            transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
          }}
        >
          <div
            className="vb-footer-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "30px",
              textAlign: "left",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h5
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  marginBottom: "18px",
                }}
              >
                Our Services
              </h5>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {dummyServiceblock.map((item, i) => (
                  <li key={i} style={{ marginBottom: "10px" }}>
                    <Link
                      to="/services"
                      style={{
                        fontSize: "15px",
                        color: "#cbd5e0",
                        textDecoration: "none",
                        transition: baseTransition,
                        lineHeight: "1.65",
                        display: "inline-block",
                        wordBreak: "break-word",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#007a7e")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e0")}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ minWidth: 0 }}>
              <h5
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  marginBottom: "18px",
                }}
              >
                Useful Links
              </h5>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {[
                  { title: "Doctors", path: "/doctor-list" },
                  { title: "Specialities", path: "/doctor-grid" },
                  { title: "Hospitals", path: "/hospital-list" },
                  { title: "Diagnostics", path: "/clinic-list" },
                  { title: "Our Services", path: "/services" },
                  { title: "Contact Us", path: "/contact" },
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: "10px" }}>
                    <Link
                      to={item.path}
                      style={{
                        fontSize: "15px",
                        color: "#cbd5e0",
                        textDecoration: "none",
                        transition: baseTransition,
                        lineHeight: "1.65",
                        display: "inline-block",
                        wordBreak: "break-word",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#007a7e")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e0")}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ minWidth: 0 }}>
              <h5
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  marginBottom: "16px",
                }}
              >
                Subscribe
              </h5>

              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1px solid rgba(0, 122, 126, 0.5)",
                    marginBottom: "10px",
                    fontSize: "15px",
                    color: "#e2e8f0",
                    background: "rgba(0, 122, 126, 0.1)",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubscribing}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    color: "#ffffff",
                    border: "none",
                    background: "linear-gradient(to right, #007a7e, #004d4f)",
                    borderRadius: "10px",
                    cursor: isSubscribing ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: baseTransition,
                    boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)",
                    opacity: isSubscribing ? 0.7 : 1,
                  }}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>

                {subscriptionMessage && (
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.5",
                      marginTop: "14px",
                      marginBottom: "0",
                      color: subscriptionStatus === "success" ? "#4ade80" : "#f87171",
                      wordBreak: "break-word",
                    }}
                  >
                    {subscriptionMessage}
                  </p>
                )}

                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#cbd5e0",
                    marginTop: "14px",
                    marginBottom: "0",
                  }}
                >
                  Get The Latest Updates via email. Any time you may unsubscribe.
                </p>
              </form>

              <div
                className="vb-social-icons"
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: "18px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="https://www.facebook.com/profile.php?id=61578623333168"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...socialIconStyle,
                    backgroundColor: "#3b5998",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-facebook-f" style={{ fontSize: "18px", color: "#fff" }} />
                </a>

                <a
                  href="https://www.youtube.com/@VaidyaBandhu"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...socialIconStyle,
                    backgroundColor: "#cd201f",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-youtube" style={{ fontSize: "18px", color: "#fff" }} />
                </a>

                <a
                  href="https://x.com/vaidya_bandhu"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...socialIconStyle,
                    backgroundColor: "#000",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src="/assets/img/t-i.png"
                    alt="Twitter X"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...socialIconStyle,
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src="/assets/img/instagram.png"
                    alt="Instagram"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "contain",
                    }}
                  />
                </a>

                <a
                  href="#"
                  style={{
                    ...socialIconStyle,
                    backgroundColor: "#0a66c2",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-linkedin-in" style={{ fontSize: "18px", color: "#fff" }} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="vb-footer-bottom"
          style={{
            padding: "22px 0",
            borderTop: "1px solid rgba(0, 122, 126, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(26px)",
            transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
          }}
        >
          <div
            className="vb-footer-copy"
            style={{
              fontSize: "14px",
              color: "#cbd5e0",
              textAlign: "left",
            
              minWidth: 0,
            }}
          >
            <p style={{ margin: 0, lineHeight: "1.7", wordBreak: "break-word" }}>
              © <span style={{ color: "#ffffff" }}>2025</span> Vaidya Bandhu – All Rights Reserved.
              <br />
              This website and its content are the intellectual property of{" "}
              <strong>MyCompanyon Healthcare Pvt Ltd</strong>.
              <br />
              Unauthorized use is strictly prohibited under{" "}
              <strong>Copyright Act, 1957</strong>.
            </p>
          </div>

          <ul
            className="vb-footer-policy-links"
            style={{
              display: "flex",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 0,
              margin: 0,
              justifyContent: "flex-end",
              gap: "10px",
             
            }}
          >
            {[
              { title: "Privacy Policy", path: "/privacy-policy" },
              { title: "Terms & Conditions", path: "/terms-and-conditions" },
              { title: "Refund & Cancellation Policy", path: "/refund-policy" },
            ].map((item, i, arr) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  minWidth: 0,
                }}
              >
                <Link
                  to={item.path}
                  style={{
                    fontSize: "14px",
                    color: "#cbd5e0",
                    textDecoration: "none",
                    transition: "0.3s all",
                    lineHeight: "1.6",
                    wordBreak: "break-word",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#007a7e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e0")}
                >
                  {item.title}
                </Link>

                {i < arr.length - 1 && (
                  <span className="vb-policy-divider" style={{ marginLeft: "10px", color: "#a0aec0" }}>
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>
        {`
          @keyframes floatShape3 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(15px, 15px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes floatShape4 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-15px, -15px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes floatY {
            0% { transform: translateY(0); }
            50% { transform: translateY(-18px) scale(1.06); }
            100% { transform: translateY(0); }
          }

          .vb-fancy-float {
            animation: floatY 2.8s ease-in-out infinite, pulse 2s infinite;
            box-shadow: 0 8px 32px 0 rgba(0,122,126,0.25), 0 1.5px 8px 0 rgba(30,41,59,0.10);
            filter: drop-shadow(0 0 16px #00ffe7cc);
            background: linear-gradient(90deg, #1e293b 0%, #007a7e 100%);
            border: 2.5px solid #00ffe7cc;
            transition: box-shadow 0.3s, filter 0.3s, border 0.3s;
          }

          .vb-fancy-float:hover {
            box-shadow: 0 12px 40px 0 #00ffe7cc, 0 2px 12px 0 #007a7e99;
            filter: drop-shadow(0 0 32px #00ffe7cc);
            border: 2.5px solid #00ffe7cc;
            background: linear-gradient(90deg, #007a7e 0%, #1e293b 100%);
          }

          .vb-footer-container * {
            box-sizing: border-box;
          }

          @media (max-width: 1024px) {
            .vb-footer-top-cards {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .vb-footer-main-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .vb-footer-bottom {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .vb-footer-policy-links {
              justify-content: flex-start !important;
            }
          }

          @media (max-width: 767px) {
            .vb-footer-root {
              padding-top: 42px !important;
              border-top-left-radius: 24px !important;
              border-top-right-radius: 24px !important;
            }

            .vb-footer-container {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }

            .vb-footer-top-cards {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
              margin-bottom: 28px !important;
            }

            .vb-contact-card {
              padding: 14px !important;
              gap: 12px !important;
              border-radius: 14px !important;
            }

            .vb-footer-middle {
              padding: 28px 0 26px 0 !important;
            }

            .vb-footer-main-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }

            .vb-social-icons {
              gap: 10px !important;
              margin-top: 16px !important;
            }

            .vb-footer-bottom {
              padding: 18px 0 !important;
              gap: 12px !important;
            }

            .vb-footer-copy p {
              line-height: 1.65 !important;
            }

            .vb-footer-policy-links {
              width: 100% !important;
              gap: 6px !important;
            }
          }

          @media (max-width: 480px) {
            .vb-footer-container {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }

            .vb-contact-card {
              padding: 12px !important;
            }

            .vb-contact-card p:first-child {
              font-size: 13px !important;
            }

            .vb-contact-card p:last-child {
              font-size: 15px !important;
            }

            .vb-footer-main-grid h5 {
              font-size: 18px !important;
              margin-bottom: 14px !important;
            }

            .vb-footer-main-grid a,
            .vb-footer-main-grid p,
            .vb-footer-copy,
            .vb-footer-policy-links a {
              font-size: 14px !important;
            }

            .vb-social-icons a {
              width: 36px !important;
              height: 36px !important;
            }

            .vb-footer-policy-links li {
              width: 100%;
            }

            .vb-policy-divider {
              display: none !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
