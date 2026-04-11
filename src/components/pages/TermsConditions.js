import React from "react";

const TERMS_TEXT = `Welcome to Vaidya Bandhu. These Terms and Conditions govern your access to and use of our website,
www.vaidyabandhu.com, our mobile applications (if any), and the services provided through them.

1. Eligibility
To use our Services, you must:
● Be at least 18 years old or have parental/guardian consent if under 18.
● Reside in India.
● Provide accurate and complete information during registration.

2. Membership and Services
Vaidya Bandhu offers a paid membership program for ₹49 per year, providing benefits such as:
● Discounts on healthcare services at partnered hospitals and diagnostic centres.
● Access to medical consultations.
● Issuance of a membership card.
● Health tips, updates, and promotional offers.

3. User Accounts and Obligations
You agree to:
● Provide truthful information and update it as necessary.
● Maintain the confidentiality of your account credentials.
● Not share your account with others.

4. Payments and Fees
Membership fees are payable via secure payment gateways.
All payments are non-refundable except as outlined in our Refund Policy.

5. Intellectual Property
All content on the Website and Services is owned by us or our licensors.

6. Disclaimers and Limitation of Liability
Services are provided "as is" without warranties of any kind.

7. Indemnification
You agree to indemnify and hold us harmless from claims arising from your use of the Services.

8. Termination
We may terminate your access to Services at any time for any reason.

9. Governing Law and Dispute Resolution
These Terms are governed by the laws of India.

10. Miscellaneous
These Terms constitute the entire agreement between you and us.

11. Contact Us
WhatsApp/Helpline: +91 8535853589
Email: support@vaidyabandhu.com
Website: www.vaidyabandhu.com`;

const TermsConditions = () => {
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
        <h1 style={{ marginBottom: "20px", color: "#003d3f" }}>Terms & Conditions</h1>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#334155", fontSize: "15px" }}>
          {TERMS_TEXT}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
