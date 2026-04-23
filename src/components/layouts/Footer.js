import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FloatingCallButton from "./helpline";
import services from "../../data/service/service.json";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const serviceLinks = useMemo(
    () =>
      services.slice(0, 6).map((item) => ({
        id: item.id,
        title: item.title,
        path: "/services",
      })),
    []
  );

  const handleSubscribe = async (event) => {
    event.preventDefault();

    if (!email || !email.includes("@")) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }

    if (!token) {
      setSubscriptionStatus("error");
      setSubscriptionMessage("Login is required before subscribing.");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage("");
    setSubscriptionStatus(null);

    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/subscribe/",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus("success");
        setSubscriptionMessage(
          data.message || "Subscribed successfully. We will keep you updated."
        );
        setEmail("");
      } else {
        setSubscriptionStatus("error");
        setSubscriptionMessage(data.message || "Unable to subscribe right now.");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Subscription error:", error);
      setSubscriptionStatus("error");
      setSubscriptionMessage("An error occurred. Please try again shortly.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="vb-footer" aria-label="Site footer">
      <FloatingCallButton />

      <div className="vb-container">
        <div className="vb-footer-top">
          <article className="vb-footer-stat">
            <p>Address</p>
            <h4>Bengaluru - 560078</h4>
          </article>
          <article className="vb-footer-stat">
            <p>Helpline</p>
            <h4>+91 8535 8535 89</h4>
          </article>
          <article className="vb-footer-stat">
            <p>Email</p>
            <h4>support@vaidyabandhu.com</h4>
          </article>
        </div>

        <div className="vb-footer-grid">
          <section>
            <h5>About Vaidya Bandhu</h5>
            <p className="vb-footer-note" style={{ marginTop: "0.75rem" }}>
              Trusted healthcare support platform helping families find verified
              doctors, hospitals, diagnostics, and affordable treatment paths.
            </p>

            <div className="vb-social-row" aria-label="Social links">
              <a
                href="https://www.facebook.com/profile.php?id=61578623333168"
                target="_blank"
                rel="noreferrer"
                className="vb-social-fb"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                href="https://www.youtube.com/@VaidyaBandhu"
                target="_blank"
                rel="noreferrer"
                className="vb-social-yt"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube" />
              </a>
              <a
                href="https://x.com/vaidya_bandhu"
                target="_blank"
                rel="noreferrer"
                className="vb-social-x"
                aria-label="X"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="vb-social-ig"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="vb-social-li"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </section>

          <section>
            <h5>Services</h5>
            <ul className="vb-footer-list">
              {serviceLinks.map((item) => (
                <li key={item.id}>
                  <Link to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h5>Quick Links</h5>
            <ul className="vb-footer-list">
              <li>
                <Link to="/doctor-list">Doctors</Link>
              </li>
              <li>
                <Link to="/doctor-grid">Specialities</Link>
              </li>
              <li>
                <Link to="/hospital-list">Hospitals</Link>
              </li>
              <li>
                <Link to="/clinic-list">Diagnostics</Link>
              </li>
              <li>
                <Link to="/faqs">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>

            <form className="vb-footer-subscribe" onSubmit={handleSubscribe}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                className="vb-btn vb-btn-primary"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {subscriptionMessage && (
              <p
                className="vb-footer-note"
                style={{
                  marginTop: "0.55rem",
                  color: subscriptionStatus === "success" ? "#91ffc4" : "#ffb8b8",
                }}
              >
                {subscriptionMessage}
              </p>
            )}
          </section>
        </div>

        <div className="vb-footer-bottom">
          <p className="vb-footer-note">
            © 2026 Vaidya Bandhu. Intellectual property of MyCompanyon Healthcare
            Pvt Ltd.
          </p>

          <div className="vb-footer-policy">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/refund-policy">Refund &amp; Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
