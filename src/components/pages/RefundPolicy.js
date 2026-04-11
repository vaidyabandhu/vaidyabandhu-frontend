import React from "react";

const REFUND_TEXT = `At Vaidya Bandhu Healthcare Foundation, we are committed to providing quality and affordable healthcare services to our
members. This Refund Policy outlines the conditions under which refunds may or may not be issued.

1. The Membership Fee of ₹49 is non-refundable.
● Once the payment is successfully processed and the membership is activated, no refund will be issued under any circumstances.

2. Service Eligibility
Membership benefits are available throughout the 1-year validity period of the membership.

3. Duplicate Payments
In the event of a duplicate payment for the same membership due to a technical error or banking issue:
● Contact us with proof of the transaction.
● Upon verification, a refund for the duplicate payment will be processed within 7–10 business days.

4. Failed Transactions
If a payment fails but the amount is deducted from your account:
● The deducted amount is typically reversed automatically by your bank or payment provider within 5–7 business days.

5. How to Request a Refund
Refunds can be requested by emailing us at payments@vaidyabandhu.com with:
● Full Name
● Mobile Number
● Transaction Reference ID
● Screenshot of payment
● Reason for refund request

6. Contact Us
WhatsApp/Helpline: +91 8535853589
Email: payments@vaidyabandhu.com
Website: www.vaidyabandhu.com`;

const RefundPolicy = () => {
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
        <h1 style={{ marginBottom: "20px", color: "#003d3f" }}>Refund & Cancellation Policy</h1>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", color: "#334155", fontSize: "15px" }}>
          {REFUND_TEXT}
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
