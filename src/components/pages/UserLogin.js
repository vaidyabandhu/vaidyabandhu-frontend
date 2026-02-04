import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css";

const LOGIN_API = "https://admin.vaidyabandhu.com/api/users/login/";
const VERIFY_OTP_API = "https://admin.vaidyabandhu.com/api/users/verify_login_otp/";
const PROFILE_API = "https://admin.vaidyabandhu.com/api/user/profile/";

const UserLogin = () => {
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=Mobile , 2=OTP

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check profile to decide where to go
      fetch(PROFILE_API, {
        method: "GET",
        headers: { Authorization: token },
      })
        .then(res => res.json())
        .then(profileData => {
          if (profileData?.is_active === true) {
            navigate("/myprofile");
          } else {
            navigate("/basic-details");
          }
        })
        .catch(() => {
          navigate("/basic-details");
        });
    }
  }, [navigate]);

  useEffect(() => {
    const handleLoginStateChange = (event) => {
      setIsLoggedIn(!!event?.detail?.isLoggedIn);
    };
    window.addEventListener("login-state-changed", handleLoginStateChange);
    return () =>
      window.removeEventListener("login-state-changed", handleLoginStateChange);
  }, []);

  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
  const validateOtp = (v) => v?.length === 4 && /^[0-9]{4}$/.test(v);

  const handleMobChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  const handleMobileSubmit = async () => {
    if (!validateMobile(mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid 10-digit mobile number.",
      }));
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("mobile", mobileNumber);

      const response = await fetch(LOGIN_API, {
        method: "POST",
        body: fd,
      });

      const raw = await response.text();
      console.log("SEND OTP STATUS:", response.status);
      console.log("SEND OTP RAW RESPONSE:", raw);

      if (response.ok) {
        setStep(2);
      } else {
        let msg = "Failed to send OTP. Please try again.";
        try {
          const parsed = JSON.parse(raw);
          msg = parsed?.message || parsed?.error || msg;
        } catch (e) {}
        setErrors((prev) => ({ ...prev, mobile: msg }));
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      setErrors((prev) => ({
        ...prev,
        mobile: "Network/CORS error. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!validateOtp(otp)) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP should be exactly 4 digits.",
      }));
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("mobile", mobileNumber);
      fd.append("otp", otp);

      const response = await fetch(VERIFY_OTP_API, {
        method: "POST",
        body: fd,
      });

      const raw = await response.text();
      console.log("VERIFY OTP STATUS:", response.status);
      console.log("VERIFY OTP RAW RESPONSE:", raw);

      let data = null;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        data = null;
      }

      const token = data?.data?.token || data?.token || "";

      if (response.ok && token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);

        window.dispatchEvent(
          new CustomEvent("login-state-changed", {
            detail: { isLoggedIn: true },
          })
        );

        // Now fetch profile to decide where to go
        try {
          const profileRes = await fetch(PROFILE_API, {
            method: "GET",
            headers: {
              Authorization: token,
            },
          });

          const profileRaw = await profileRes.text();
          let profileData = null;
          try {
            profileData = JSON.parse(profileRaw);
          } catch (e) {
            profileData = null;
          }

          if (profileRes.ok && profileData?.is_active === true) {
            navigate("/myprofile");
          } else {
            navigate("/basic-details");
          }
        } catch (profileError) {
          navigate("/basic-details");
        }
      } else {
        const msg =
          data?.message || data?.error || "Invalid OTP. Please try again.";
        setErrors((prev) => ({ ...prev, otp: msg }));
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Network/CORS error. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!validateMobile(mobileNumber)) {
      alert("Please enter a valid mobile number first.");
      return;
    }

    setIsLoading(true);
    setOtp("");
    setErrors({});

    try {
      const fd = new FormData();
      fd.append("mobile", mobileNumber);

      const response = await fetch(LOGIN_API, {
        method: "POST",
        body: fd,
      });

      const raw = await response.text();
      console.log("RESEND OTP STATUS:", response.status);
      console.log("RESEND OTP RAW RESPONSE:", raw);

      if (response.ok) {
        alert("OTP sent successfully!");
      } else {
        let msg = "Failed to resend OTP. Please try again.";
        try {
          const parsed = JSON.parse(raw);
          msg = parsed?.message || parsed?.error || msg;
        } catch (e) {}
        alert(msg);
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      alert("Network/CORS error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #232946 0%, #16161a 100%)', // dark blue to near-black
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div className="userlogin-premium-card animate-fadein" style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 24,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        maxWidth: 400,
        width: '100%',
        padding: '40px 32px 32px 32px',
        position: 'relative',
        margin: '32px 0',
      }}>
       <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  <img
    src={"/assets/img/vb-logo.png"}
    alt="Logo"
    style={{
      width: 64,
      height: 64,
      marginBottom: 8,
      borderRadius: 12,
      boxShadow: "0 2px 8px #e0e7ff",
    }}
  />

  <h2
    style={{
      fontWeight: 600,
      fontSize: "clamp(16px, 5vw, 24px)", // 🔥 auto scales per screen
      color: "#1e293b",
      marginBottom: 0,
      letterSpacing: "0.3px",
      whiteSpace: "nowrap", // 🔑 always single line
      lineHeight: 1.2,
    }}
  >
    Welcome to Vaidya Bandhu
  </h2>
</div>


        {/* STEP 1 */}
        {step === 1 && (
          <Form style={{ minHeight: 180 }}>
            <Form.Group controlId="formMobileNumber" className="mb-4">
              <Form.Label style={{ fontWeight: 500, color: '#334155', fontSize: 15 }}></Form.Label>
          <Form.Control
  type="text"
  placeholder="Enter your mobile number"
  value={mobileNumber}
  onChange={handleMobChange}
  isInvalid={!!errors.mobile}
  maxLength={10}
  inputMode="numeric"
  style={{
    width: "100%",              // 🔑 always full width
    minWidth: 0,                // 🔑 fixes flex shrink issue
    boxSizing: "border-box",    // 🔑 padding included in width
    borderRadius: 12,
    border: "1.5px solid #cbd5e1",
    fontSize: "clamp(15px, 4vw, 17px)", // responsive text
    padding: "12px 16px",
    background: "#f1f5f9",
    boxShadow: "none",
    transition: "border 0.2s",
    whiteSpace: "nowrap",       // never wrap
  }}
/>

              <Form.Control.Feedback type="invalid" style={{ fontSize: 13, marginTop: 4 }}>
                {errors.mobile}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              className="sigma_btn btn-sm"
              style={{ width: '100%', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '12px 0', marginTop: 8, marginBottom: 8, letterSpacing: 0.2, transition: 'background 0.2s' }}
              onClick={handleMobileSubmit}
              disabled={isLoading || !mobileNumber}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  SENDING OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </Form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Form style={{ minHeight: 180 }}>
            <Form.Group controlId="formOtp" className="mb-4 text-center">
              <Form.Label style={{ fontWeight: 500, color: '#334155', fontSize: 15 }}>Enter OTP sent to <span style={{ color: '#6366f1', fontWeight: 600 }}>{mobileNumber}</span></Form.Label>
              <div className="d-flex justify-content-center mb-3">
                <OTPInput
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                  numInputs={4}
                  separator={<span style={{ margin: "0 5px" }}>-</span>}
                  inputStyle={{
                    width: "48px",
                    height: "48px",
                    margin: "0 7px",
                    padding: "0px",
                    textAlign: "center",
                    fontSize: "22px",
                    fontFamily: "poppins",
                    border: "2px solid #cbd5e1",
                    borderRadius: "10px",
                    background: '#f1f5f9',
                    outline: "none",
                    boxShadow: '0 1px 4px #e0e7ff',
                    transition: 'border 0.2s',
                  }}
                  focusStyle={{
                    border: "2px solid #6366f1",
                    outline: "none",
                  }}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              {errors.otp && (
                <div className="invalid-feedback d-block text-center" style={{ color: '#ef4444', fontWeight: 500, fontSize: 14 }}>
                  {errors.otp}
                </div>
              )}
            </Form.Group>

            <Button
              className="sigma_btn btn-sm"
              style={{ width: '100%', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '12px 0', marginTop: 8, marginBottom: 8, letterSpacing: 0.2, transition: 'background 0.2s' }}
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.length !== 4}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  VERIFYING...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <div className="d-flex justify-content-end mt-2">
              <div
                onClick={handleResendOtp}
                className="resend-otp-btn"
                style={{
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  color: '#0ea5e9',
                  fontWeight: 500,
                  fontSize: 15,
                  textDecoration: 'underline',
                  transition: 'color 0.2s',
                }}
              >
                Resend OTP
              </div>
            </div>
          </Form>
        )}

        {/* Optional: Footer or help */}
        <div style={{ textAlign: 'center', marginTop: 32, color: '#94a3b8', fontSize: 13 }}>
          Having trouble? <a href="tel:+918535853589" style={{ color: '#6366f1', textDecoration: 'underline', fontWeight: 500 }}>Call +91 8535 8535 89</a>
        </div>
      </div>
      {/* Animation styles */}
      <style>{`
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .premium-btn:active {
          filter: brightness(0.95);
        }
        .premium-btn:hover {
          background: linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%) !important;
        }
      `}</style>
    </div>
  );
};

export default UserLogin;
