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

// === POLICY TEXTS (as provided) ===
const TERMS_TEXT = `Welcome to Vaidya Bandhu. These Terms and Conditions govern your access to and use of our website,
www.vaidyabandhu.com, our mobile applications (if any), and the services provided through them, including membership
subscriptions, healthcare discounts, consultations, and related features. By accessing or using our Services, you agree to be
bound by these Terms, our Privacy Policy, Refund Policy, and any other policies referenced herein. If you do not agree,
please do not use our Services. We may update these terms from time to time. Continued use of the Services after changes
constitutes your acceptance of the revised Terms.

1. Eligibility: To use our Services, you must:
● Be at least 18 years old or have parental/guardian consent if under 18.
● Reside in India, as our services are currently available only within India.
● Provide accurate and complete information during registration. We reserve the right to
Refuse or terminate access if you do not meet these criteria

2. Membership and Services
Vaidya Bandhu offers a paid membership program for ₹49 per year, providing benefits such
as:
● Discounts on healthcare services at partnered hospitals and diagnostic centres.
● Access to medical consultations.
● Issuance of a membership card.
• Health tips, updates, and promotional offers. Membership is valid for one year from activation and is
non-transferable. Benefits are subject to availability and terms set by our partners. We do not guarantee specific discounts
or service availability. Services are for informational and facilitative purposes only and do not constitute medical advice.
Always consult a qualified healthcare professional for medical needs.

3. User Accounts and Obligations
To access certain Services, you may need to create an account. You agree to:
● Provide truthful information and update it as necessary.
● Maintain the confidentiality of your account credentials.
● Do not share your account with others.
● Notify us immediately of any unauthorised access. You are responsible for all activities
under your account. Prohibited actions include:
● Using services for illegal purposes.
● Impersonating others or providing false information.
● Interfering with the Website or Services.
● Uploading harmful content or viruses. We may suspend or terminate your account for
violations.

4. Payments and Fees: Membership fees are payable via secure payment gateways.
All payments are non-refundable except as outlined in our Refund Policy. You authorize us to charge the applicable fee to
your chosen payment method. Taxes are included where applicable.

5. Intellectual Property
All content on the Website and Services, including text, graphics, logos, and software, is owned by us or our licensors and
protected by intellectual property laws.
You are granted a limited, non-exclusive license to use the Services for personal, non-commercial purposes. You may not
copy, modify, distribute, or create derivative works without our written consent.

6. Disclaimers and Limitation of Liability
Services are provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including
fitness for a particular purpose.
We are not liable for:
● Inaccuracies in content or services provided by partners.
● Any medical outcomes or advice from consultations.
● Interruptions, errors, or data loss.
● Indirect, consequential, or punitive damages.
Our total liability shall not exceed the membership fee paid by you in the preceding 12 months.

7. Indemnification
You agree to indemnify and hold us harmless from any claims, losses, or damages arising from your use of the Services,
violation of these Terms, or infringement of third-party rights.

8. Termination
We may terminate your access to Services at any time for any reason, including violations of these Terms. Upon termination,
your right to use Services ceases, but provisions like liability and indemnification survive.

9. Governing Law and Dispute Resolution
These Terms are governed by the laws of India. Any disputes shall be resolved through arbitration in India, under the
Arbitration and Conciliation Act, 1996, before a single arbitrator appointed by us. If arbitration is not feasible, disputes shall
be subject to the exclusive jurisdiction of courts in India.

10. Miscellaneous
These Terms constitute the entire agreement between you and us. If any provision is invalid, the remainder remains
enforceable.
We are not liable for failures due to force majeure events.

11. Contact Us
For questions about these terms, contact us at
● WhatsApp/Helpline: +91 8535853589
● Email: support@vaidyabandhu.com
● Website: www.vaidyabandhu.com`;

const PRIVACY_TEXT = `At Vaidya Bandhu, we are dedicated to safeguarding your privacy and handling your personal data responsibly. This Privacy
Policy explains our practices regarding the collection, use, processing, storage, disclosure, and protection of your personal
information. We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act), and other applicable Indian laws,
ensuring transparency, fairness, and accountability in data handling.

As a healthcare platform offering membership services, doctor appointment booking, consultations, and discounts at
partnered facilities, we process personal data as a data fiduciary under the DPDP Act. Personal data includes any
information that relates to an identified or identifiable individual, and we treat health-related data as sensitive personal data,
applying enhanced protections.

1. Information We Collect
We collect personal information only when it is necessary and with your explicit consent or as permitted by law. Categories
include:
● Personal Identification Information: Full name, address, phone number, email address (optional), PAN (Permanent
Account Number), and Aadhaar details (optional, collected only for identity verification where required).
● Sensitive Personal Data: Health-related details, medical history, or consultation records (collected solely for
providing medical services, with your explicit consent).
● Usage and Technical Data: IP address, device information, browser type, and interaction logs when you visit our
website or use our services (collected automatically for security and improvement purposes).
● Other Data: Payment details (processed through secure gateways) and any other information you voluntarily
provide during inquiries or support interactions. We adhere to data minimization principles, collecting only what is
essential for the specified purposes.

2. How We Use Your Information
We process your personal data based on lawful grounds, primarily your consent or for legitimate uses as defined under the
DPDP Act. Purposes include:
● Processing membership registrations, issuing membership cards, and managing your
account.
● Facilitating healthcare services, such as booking appointments, providing discounts at
partner hospitals/diagnostic centers, and enabling medical consultations.
● Communicating service updates, health tips, and relevant promotional materials (you can
opt out at any time).
● Responding to inquiries, providing customer support, and improving our services through
analytics.
• Complying with legal obligations, such as record-keeping for regulatory purposes. We do not use your
data for secondary purposes without obtaining fresh consent. Health data is used strictly for the purpose consented to, with
no profiling or automated decision-making unless disclosed.

3. Data Sharing and Disclosure
We do not sell, rent, or trade your personal data. Sharing occurs only under the following controlled circumstances:
● With Data Processors and Partners: Shared with authorised hospitals, doctors, or service providers (e.g.,
diagnostic centers) solely for delivering membership benefits. These entities act as data processors and
are contractually bound to DPDP Act compliance, including data security and confidentiality.
● Legal Requirements: Disclosed to government authorities, regulators, or law enforcement if
required by law, such as under court orders or for public health emergencies.
● Other: In the event of business transfers (e.g., mergers), but only with anonymised data where possible.
We do not transfer data outside India unless adequate protections are in place, as per the DPDP Act
requirements.

4. Data Security
In accordance with the DPDP Act, we have implemented privacy by design and default, vulnerability assessments, and
breach notification protocols.
While we take all reasonable steps to secure your data, no system is infallible, especially over internet-based transmission.
Please use strong passwords and secure networks.

5. Data Retention
We retain personal data only for as long as necessary to fulfil the purposes outlined or as required by law (e.g., 5-10 years for
health records under medical regulations). After this period, the data is securely disposed of or anonymised

6. Your Rights
As a Data Principal under the DPDP Act, you have the following rights:
● Access: Request a summary or copy of your personal data.
● Correction and Update: Rectify inaccurate or incomplete information.
● Erasure: Request deletion of data when no longer needed (subject to legal exceptions, such as ongoing
services or regulatory retention).
● Consent Withdrawal: Withdraw consent at any time, which may limit service access.
● Grievance Redressal: Lodge complaints about data handling.
● Nomination: Nominate a person to exercise rights on your behalf in case of incapacity.
● Restriction of Processing: Object to certain uses of your data.
To exercise these rights, email us at support@vaidyabandhu.com. We will respond within 30 days, free of charge for most
requests. For grievances, contact us at the same address. If you are a parent/guardian, we require verifiable parental
Consent for processing children's data (under 18), and such processing is limited.

7. Cookies and Tracking Technologies
Our website uses cookies, pixels, and analytics tools to enhance user experience, track usage, and improve functionality.
These do not collect sensitive data without consent.

8. Children's Privacy
Our services are not directed at children under 18. We do not knowingly collect data from minors without parental consent.
If we discover such data, we will delete it promptly.

9. Updates to This Policy
We may update this policy to reflect legal changes or service updates. Changes will be posted on the website with a new
effective date, and we may notify you via email for significant updates. Continued use constitutes acceptance.

10. Contact Us
For questions, concerns, or to exercise rights, reach out:
● WhatsApp/Helpline: +91 8535853589
● Email: support@vaidyabandhu.com
● Website: www.vaidyabandhu.com`;

const REFUND_TEXT = `At Vaidya Bandhu Healthcare Foundation, we are committed to providing quality and affordable healthcare services to our
members. This Refund Policy outlines the conditions under which refunds may or may not be issued for payments related to
our membership and services.

We aim to ensure transparency and fairness in all transactions.

1. The Membership Fee of ₹49 is non-refundable.
● Once the payment is successfully processed and the membership is activated, no refund will be issued
under any circumstances.
● This fee covers administrative and operational costs, including the issuance of and access to benefits
such as discounts on healthcare services and consultations.

2. Service Eligibility Membership benefits, including discounts and consultations, are available throughout the
1-year validity period of the membership.
● If a member is unable to utilise the services due to personal reasons, no partial or full refund will be
provided.
● Non-utilization of services does not entitle members to a refund, as the membership fee is for access
to the benefits provided during the validity period.

3. Duplicate Payments: In the event of a duplicate payment for the same membership due to a technical error or
banking issue:
● Please contact us with proof of the transaction, such as a transaction reference ID or screenshot of the
payment.
● Upon verification, a refund for the duplicate payment will be processed within 7–10 business days to
the original mode of payment.
Please note: Any applicable transaction or processing fees will be deducted from the refund amount.

4. Failed Transactions: If a payment fails but the amount is deducted from your account:
● The deducted amount is typically reversed automatically by your bank or payment provider within
5–7 business days.
● If the amount is not refunded within this period, please share the transaction reference ID with us. We
will coordinate with the payment gateway to resolve the issue promptly.

5. How to Request a Refund. Refunds, applicable only in cases of duplicate payments or failed transactions, can
be requested by emailing us at payments@vaidyabandhu.com with the following details:
● Full Name
● Mobile Number
● Transaction Reference ID
● Screenshot of payment (if available)
● Reason for refund request: We will review and process eligible refund requests within 7–10 business days.

6. Contact Us For any questions related to your membership, billing, or refund requests, please reach out to us at:
● WhatsApp/Helpline: +91 8535853589
● Email: payments@vaidyabandhu.com
● Website: www.vaidyabandhu.com`;

const Footer = () => {
  const [animated, setAnimated] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'terms', 'privacy', 'refund'
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'success', 'error', null
  const [token, setToken] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    
    return () => clearTimeout(timer);
  }, []);

  const baseTransition = "all 0.3s ease-in-out";
  
  // Handlers for opening modals
  const openTerms = (e) => {
    e.preventDefault();
    setShowModal("terms");
  };
  const openPrivacy = (e) => {
    e.preventDefault();
    setShowModal("privacy");
  };
  const openRefund = (e) => {
    e.preventDefault();
    setShowModal("refund");
  };
  const closeModal = () => {
    setShowModal(null);
  };

 const handleSubscribe = async (e) => {
  e.preventDefault();
  
  // Validate email
  if (!email || !email.includes('@')) {
    setSubscriptionMessage("Please enter a valid email address");
    setSubscriptionStatus("error");
    return;
  }
  
  // Check if token is available
  if (!token) {
    setSubscriptionMessage("Authentication required. Please log in to subscribe.");
    setSubscriptionStatus("error");
    return;
  }
  
  setIsSubscribing(true);
  setSubscriptionMessage("");
  setSubscriptionStatus(null);
  
  try {
    const response = await fetch('https://admin.vaidyabandhu.com/api/user/subscribe/', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Use the message from the API response
      setSubscriptionMessage(data.message || "Thank you for subscribing! You'll receive our latest updates via email.");
      setSubscriptionStatus("success");
      setEmail(""); // Clear the email input
    } else {
      // Use the error message from the API response
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

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #003d3f 0%, #001a1b 100%)", // Dark, inviting gradient
        paddingTop: "60px", // Adjusted padding
        paddingBottom: "0",
        fontFamily: "poppins",
        color: "#a0aec0", // Default light text color for dark background
        overflow: "hidden",
        position: "relative",
        borderTopLeftRadius: "40px", // Added top-left border radius
        borderTopRightRadius: "40px", // Added top-right border radius
      }}
    >
      <FloatingCallButton />
      {/* <FloatingVaidyabandhuCardButton className="vb-fancy-float" /> */}
      {/* Decorative background elements (optional, but consistent with previous components) */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "0%",
          fontFamily: "poppins",
          width: "min(100px, 10vw)",
          height: "min(100px, 10vw)",
          backgroundColor: "rgba(0, 122, 126, 0.1)", // Slightly more visible on dark
          borderRadius: "50%",
          filter: "blur(20px)",
          animation: "floatShape3 8s infinite ease-in-out",
          zIndex: 0,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "0%",
          fontFamily: "poppins",
          width: "min(120px, 12vw)",
          height: "min(120px, 12vw)",
          backgroundColor: "rgba(0, 122, 126, 0.08)", // Slightly more visible on dark
          borderRadius: "50%",
          filter: "blur(25px)",
          animation: "floatShape4 10s infinite ease-in-out",
          zIndex: 0,
        }}
      ></div>
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "poppins",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="responsive-stack"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "30px",
            marginBottom: "60px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
          }}
        >
          {/* Address Info */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              fontFamily: "poppins",
              textAlign: "left",
              flex: "1 1 280px", // Responsive sizing
              maxWidth: "350px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                fontFamily: "poppins",
                background: "#007a7e", // Accent color for icons
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)", // Darker shadow
                flexShrink: 0,
              }}
            >
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
            <div>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "16px",
                  color: "#a0aec0",
                }}
              >
                Our Address
              </p>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#e2e8f0",
                }}
              >
                Bengaluru - 560078
              </p>
            </div>
          </div>
          {/* Phone Info */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              textAlign: "left",
              flex: "1 1 280px",
              maxWidth: "350px",
              fontFamily: "poppins",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                fontFamily: "poppins",
                borderRadius: "50%",
                background: "#007a7e", // Accent color for icons
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)", // Darker shadow
                flexShrink: 0,
              }}
            >
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
            <div>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "16px",
                  color: "#a0aec0",
                }}
              >
                Call Us - Helpline
              </p>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#e2e8f0",
                }}
              >
                +91 8535 8535 89
              </p>
            </div>
          </div>
          {/* Email Info */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              fontFamily: "poppins",
              textAlign: "left",
              flex: "1 1 280px",
              maxWidth: "350px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                fontFamily: "poppins",
                borderRadius: "50%",
                background: "#007a7e", // Accent color for icons
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)", // Darker shadow
                flexShrink: 0,
              }}
            >
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
            <div>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "16px",
                  color: "#a0aec0",
                }}
              >
                Our Mail
              </p>
              <p
                style={{
                  margin: "0",
                  fontFamily: "poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#e2e8f0",
                }}
              >
                support@vaidyabandhu.com
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "60px 0",
            borderTop: "1px solid rgba(0, 122, 126, 0.2)", // Lighter border for contrast
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Responsive grid
              gap: "40px",
              textAlign: "left",
            }}
          >
            {/* Our Services */}
            <div>
              <h5
                style={{
                  fontSize: "20px",
                  fontFamily: "poppins",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  marginBottom: "20px",
                }}
              >
                Our Services
              </h5>
              <ul
                style={{
                  listStyle: "none",
                  fontFamily: "poppins",
                  padding: 0,
                  margin: 0,
                }}
              >
                {dummyServiceblock.map((item, i) => (
                  <li key={i} style={{ marginBottom: "10px" }}>
                    <a
                      href="/services" // Redirect all links to /services
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#cbd5e0", // Lighter link color
                        textDecoration: "none",
                        transition: baseTransition,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#007a7e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#cbd5e0")
                      }
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Useful Links */}
            <div>
              <h5
                style={{
                  fontSize: "20px",
                  fontFamily: "poppins",
                  fontWeight: "700",
                  color: "#e2e8f0",
                  marginBottom: "20px",
                }}
              >
                Useful Links
              </h5>
              <ul
                style={{
                  listStyle: "none",
                  fontFamily: "poppins",
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
                    <a
                      href={item.path} // Placeholder link
                      style={{
                        fontSize: "15px",
                        fontFamily: "poppins",
                        color: "#cbd5e0", // Lighter link color
                        textDecoration: "none",
                        transition: baseTransition,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#007a7e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#cbd5e0")
                      }
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Subscribe Form */}
            <div>
              <h5
                style={{
                  fontSize: "20px",
                  fontFamily: "poppins",
                  fontWeight: "700",
                  padding: "12px 15px",
                  color: "#e2e8f0",
                  marginBottom: "0px",
                  marginTop: "-12px",
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
                    padding: "12px 15px",
                    borderRadius: "8px",
                    fontFamily: "poppins",
                    border: "1px solid rgba(0, 122, 126, 0.5)", // More visible border
                    marginBottom: "10px",
                    fontSize: "15px",
                    color: "#e2e8f0", // Light text for input
                    background: "rgba(0, 122, 126, 0.1)", // Subtle dark background for input
                    boxSizing: "border-box", // Include padding in width
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    background: "#007a7e",
                    color: "#ffffff",
                    border: "none",
                    fontFamily: "poppins",
                    background: "linear-gradient(to right, #007a7e, #004d4f)",
                    borderRadius: "8px",
                    cursor: isSubscribing ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: baseTransition,
                    boxShadow: "0 4px 15px rgba(0, 122, 126, 0.4)", // Darker shadow
                    opacity: isSubscribing ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubscribing) {
                      e.currentTarget.style.background = "#004d4f";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubscribing) {
                      e.currentTarget.style.background = "#007a7e";
                    }
                  }}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
                {subscriptionMessage && (
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: "poppins",
                      lineHeight: "1.5",
                      marginTop: "15px",
                      marginBottom: "0",
                      color: subscriptionStatus === "success" ? "#4ade80" : "#f87171",
                    }}
                  >
                    {subscriptionMessage}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "14px",
                    fontFamily: "poppins",
                    lineHeight: "1.5",
                    color: "#cbd5e0",
                    marginTop: "15px",
                    marginBottom: "0",
                  }}
                >
                  Get The Latest Updates via email. Any time you may unsubscribe.
                </p>
              </form>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: "row !important",
                  justifyContent: "center",
                  alignItems: "center",
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
                    transition: baseTransition,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i
                    className="fab fa-facebook-f"
                    style={{ fontSize: "18px", color: "#fff" }}
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
                    backgroundColor: "#cd201f",
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: baseTransition,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i
                    className="fab fa-youtube"
                    style={{ fontSize: "18px", color: "#fff" }}
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
                    backgroundColor: "#000",
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: baseTransition,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src="/assets/img/t-i.png"
                    alt="Twitter X"
                    style={{
                      width: "22px",
                      height: "22px",
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
                    backgroundColor: "#E1306C",
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: baseTransition,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src="/assets/img/i-i.png"
                    alt="Instagram"
                    style={{
                      width: "22px",
                      height: "22px",
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
                    backgroundColor: "#0a66c2",
                    borderRadius: "50%",
                    padding: "2px",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: baseTransition,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <i
                    className="fab fa-linkedin-in"
                    style={{ fontSize: "18px", color: "#fff" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Social Media Icons and Contact Info Section */}
        <div
          style={{
            padding: "25px 0",
            borderTop: "1px solid rgba(0, 122, 126, 0.2)", // Lighter border for contrast
            marginTop: "0px",
            display: "flex",
            fontFamily: "poppins",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px", // Gap for wrapping items
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition: `opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s`,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "poppins",
              color: "#cbd5e0",
              textAlign: "left",
              flex: "1 1 300px",
            }}
          >
            <p style={{ margin: "0", lineHeight: "1.6" }}>
              Â©{" "}
              <a
                href="#"
                style={{
                  color: "white",
                  fontFamily: "poppins",
                  textDecoration: "none",
                }}
              >
                2025
              </a>{" "}
              Vaidya Bandhu â€“ All Rights Reserved. <br />
              This website and its content are the intellectual property of{" "}
              <strong>MyCompanyon Healthcare Pvt Ltd</strong>. <br />
              Unauthorized use is strictly prohibited under{" "}
              <strong>Copyright Act, 1957</strong>.
            </p>
          </div>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 0,
              margin: 0,
              justifyContent: "center", // center for small screens
              gap: "10px", // controls spacing between items
            }}
          >
            {[
              { title: "Privacy Policy", action: openPrivacy },
              { title: "Terms & Conditions", action: openTerms },
              { title: "Refund & Cancellation Policy", action: openRefund },
            ].map((item, i, arr) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap", // prevents text from breaking into new lines
                }}
              >
                <a
                  href="#"
                  onClick={item.action}
                  style={{
                    fontSize: "14px",
                    fontFamily: "poppins",
                    color: "#cbd5e0",
                    textDecoration: "none",
                    transition: "0.3s all",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#007a7e")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#cbd5e0")
                  }
                >
                  {item.title}
                </a>
                {/* Add | separator only if not last item */}
                {i < arr.length - 1 && (
                  <span style={{ marginLeft: "10px", color: "#a0aec0" }}>
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* === MODAL OVERLAY === */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#001a1b",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #007a7e",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #007a7e",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: "#001a1b",
                zIndex: 10,
                borderRadius: "12px 12px 0 0",
                paddingLeft: "280px",
              }}
            >
              <h3 style={{ margin: "0", color: "#e2e8f0", fontSize: "18px" }}>
                {showModal === "terms"
                  ? "Terms and Conditions"
                  : showModal === "privacy"
                  ? "Privacy Policy"
                  : "Refund and Cancellation Policy"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#a0aec0",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "0 10px",
                }}
              >
                ✕
              </button>
            </div>
            {/* Scrollable Content */}
            <div
              style={{
                padding: "20px",
                color: "#cbd5e0",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                fontFamily: "poppins",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {showModal === "terms"
                ? TERMS_TEXT
                : showModal === "privacy"
                ? PRIVACY_TEXT
                : REFUND_TEXT}
            </div>
          </div>
        </div>
      )}
      {/* === Keyframes for floating shapes and responsive styles === */}
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
          
          /* Responsive styles */
          @media (max-width: 992px) {
            div[style*="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))"] {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            }
          }
          
          @media (max-width: 768px) {
            div[style*="display: flex"][style*="flex-wrap: wrap"][style*="justify-content: space-around"] {
              flex-direction: column !important;
              align-items: center !important;
              gap: 40px !important;
            }
            
            div[style*="flex: 1 1 280px"] {
              max-width: 90% !important;
              text-align: center !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            div[style*="flex: 1 1 300px"], div[style*="flex: 1 1 200px"] {
              flex-basis: 100% !important;
              text-align: center !important;
              justify-content: center !important;
            }
            
            ul[style*="justify-content: flex-end"] {
              justify-content: center !important;
            }
            
            /* Social media and contact info responsive styles */
            div[style*="justify-content: space-between"][style*="align-items: center"] {
              align-items: center !important;
              text-align: center !important;
            }
            
            div[style*="align-items: flex-end"] {
              align-items: center !important;
              text-align: center !important;
            }
          }
          
          @media (max-width: 480px) {
            div[style*="padding-top: 60px"] {
              padding-top: 40px !important;
            }
            
            div[style*="margin-bottom: 60px"] {
              margin-bottom: 40px !important;
            }
            
            div[style*="padding: 60px 0"] {
              padding: 40px 0 !important;
            }
            
            div[style*="padding: 25px 0"] {
              padding: 15px 0 !important;
            }
            
            h2 { font-size: clamp(30px, 6vw, 40px) !important; }
            p { font-size: clamp(15px, 2.5vw, 18px) !important; }
            h5 { font-size: clamp(18px, 3vw, 22px) !important; }
            input[type="email"], button {
              padding: 10px 12px !important;
              font-size: 14px !important;
            }
            
            /* Mobile layout fix for info blocks */
            div[style*="flex: 1 1 280px"] {
              display: table !important;
              width: 100% !important;
              text-align: left !important;
              max-width: 100% !important;
              margin-bottom: 20px !important;
            }
            
            div[style*="flex: 1 1 280px"] > div:first-child {
              display: table-cell !important;
              vertical-align: middle !important;
              width: 60px !important;
            }
            
            div[style*="flex: 1 1 280px"] > div:nth-child(2) {
              display: table-cell !important;
              vertical-align: middle !important;
              padding-left: 15px !important;
            }
            
            @media (max-width: 480px) {
              .responsive-stack {
                display: block !important;
              }
            }
            
            /* Properly align icons inside circular background */
            div[style*="flex: 1 1 280px"] {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: flex-start !important;
              max-width: 100% !important;
              width: 100% !important;
              text-align: left !important;
              margin-bottom: 20px !important;
              gap: 15px !important; /* Keep spacing between icon and text */
            }
            
            div[style*="flex: 1 1 280px"] > div:first-child {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: 50px !important;
              height: 50px !important;
              min-width: 50px !important;
              min-height: 50px !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            div[style*="flex: 1 1 280px"] > div:nth-child(2) {
              display: block !important;
              padding-left: 0 !important;
              vertical-align: middle !important;
              width: auto !important;
            }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;