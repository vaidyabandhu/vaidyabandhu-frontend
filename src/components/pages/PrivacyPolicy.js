import React from "react";

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
● Processing membership registrations, issuing membership cards, and managing your account.
● Facilitating healthcare services, such as booking appointments, providing discounts at partner hospitals/diagnostic centers, and enabling medical consultations.
● Communicating service updates, health tips, and relevant promotional materials (you can opt out at any time).
● Responding to inquiries, providing customer support, and improving our services through analytics.
● Complying with legal obligations, such as record-keeping for regulatory purposes.

3. Data Sharing and Disclosure
We do not sell, rent, or trade your personal data. Sharing occurs only under the following controlled circumstances:
● With Data Processors and Partners: Shared with authorised hospitals, doctors, or service providers solely for delivering membership benefits.
● Legal Requirements: Disclosed to government authorities, regulators, or law enforcement if required by law.
● Other: In the event of business transfers (e.g., mergers), but only with anonymised data where possible.

4. Data Security
We take reasonable technical and organisational measures to protect your information.

5. Data Retention
We retain personal data only for as long as necessary to fulfil the purposes outlined or as required by law.

6. Your Rights
As a Data Principal under the DPDP Act, you have the rights of access, correction, erasure, consent withdrawal, grievance redressal, nomination, and restriction of processing.

7. Cookies and Tracking Technologies
Our website uses cookies, pixels, and analytics tools to enhance user experience, track usage, and improve functionality.

8. Children's Privacy
Our services are not directed at children under 18.

9. Updates to This Policy
We may update this policy from time to time.

10. Contact Us
WhatsApp/Helpline: +91 8535853589
Email: support@vaidyabandhu.com
Website: www.vaidyabandhu.com`;

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: "60px 20px", background: "#f8fafc", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#003d3f" }}>Privacy Policy</h1>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#334155", fontSize: "15px" }}>
          {PRIVACY_TEXT}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
