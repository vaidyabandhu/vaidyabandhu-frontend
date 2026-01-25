import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap"; // ← FIXED: all components imported
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css";

const LoginModal = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Listen for custom event to open modal
  useEffect(() => {
    const handleOpen = () => setShow(true);
    window.addEventListener("open-login-modal", handleOpen);
    return () => window.removeEventListener("open-login-modal", handleOpen);
  }, []);

  // Listen for login state changes from other components
  useEffect(() => {
    const handleLoginChange = (e) => setIsLoggedIn(e.detail.isLoggedIn);
    window.addEventListener("login-state-changed", handleLoginChange);
    return () => window.removeEventListener("login-state-changed", handleLoginChange);
  }, []);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setStep(1);
    setMobileNumber("");
    setOtp("");
    setErrors({});
    setIsLoading(false);
  };

  // Validate 10-digit mobile number
  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const handleMobileSubmit = async () => {
    if (!validateMobile(mobileNumber)) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number starting with 6-9" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("https://admin.vaidyabandhu.com/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
      } else {
        setErrors({
          mobile: data.message || data.error || "Failed to send OTP. Try again.",
        });
      }
    } catch (err) {
      setErrors({ mobile: "Network error. Please check your connection." });
    } finally {
      setIsLoading(false);
    }
  };

  const validateOtp = (value) => value.length === 4 && /^\d{4}$/.test(value);

  const handleOtpSubmit = async () => {
    if (!validateOtp(otp)) {
      setErrors({ otp: "OTP must be exactly 4 digits" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("https://admin.vaidyabandhu.com/api/users/verify_login_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: mobileNumber,
          otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const token = data?.data?.token || "";
        localStorage.setItem("token", token);
        setIsLoggedIn(true);

        // Notify other components
        window.dispatchEvent(new CustomEvent("login-state-changed", { detail: { isLoggedIn: true } }));

        handleClose();

        // Check profile to decide redirect
        try {
          const profileRes = await fetch("https://admin.vaidyabandhu.com/api/user/profile/", {
            headers: { Authorization: token },
          });

          if (profileRes.ok) {
            const profile = await profileRes.json();
            if (profile?.is_active === true) {
              navigate("/myprofile");
            } else {
              navigate("/basic-details");
            }
          } else {
            navigate("/basic-details");
          }
        } catch {
          navigate("/basic-details");
        }
      } else {
        setErrors({ otp: data.message || data.error || "Invalid OTP" });
      }
    } catch (err) {
      setErrors({ otp: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtp("");
    setErrors({});

    try {
      const res = await fetch("https://admin.vaidyabandhu.com/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP resent successfully!");
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // Only allow digits in mobile field
  const handleMobChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,10}$/.test(val)) {
      setMobileNumber(val);
      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  // Handle click on user icon (already logged in)
  const handleIconClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/basic-details");
      return;
    }

    try {
      const res = await fetch("https://admin.vaidyabandhu.com/api/user/profile/", {
        headers: { Authorization: token },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.is_active === true) {
          navigate("/myprofile");
        } else {
          navigate("/basic-details");
        }
      } else {
        navigate("/basic-details");
      }
    } catch {
      navigate("/basic-details");
    }
  };

  return (
    <>
      {/* Show user icon if logged in, else show login button */}
      {isLoggedIn ? (
        <button className="user-icon-btn" onClick={handleIconClick} title="My Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
      ) : (
        <button onClick={handleShow} className="buy-membership-btn">
          Log in
        </button>
      )}

      <Modal show={show} onHide={handleClose} centered className="membership-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1 ? "Login - Mobile Verification" : "Login - OTP Verification"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {step === 1 && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  value={mobileNumber}
                  onChange={handleMobChange}
                  isInvalid={!!errors.mobile}
                  maxLength={10}
                  inputMode="numeric"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  onClick={handleMobileSubmit}
                  disabled={isLoading || mobileNumber.length !== 10}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </Form>
          )}

          {step === 2 && (
            <Form>
              <Form.Group className="mb-4 text-center">
                <Form.Label>Enter OTP sent to <strong>{mobileNumber}</strong></Form.Label>
                <div className="d-flex justify-content-center mb-3">
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    separator={<span className="mx-2">-</span>}
                    inputStyle={{
                      width: "50px",
                      height: "50px",
                      margin: "0 8px",
                      fontSize: "20px",
                      borderRadius: "8px",
                      border: "2px solid #ced4da",
                      textAlign: "center",
                    }}
                    focusStyle={{ borderColor: "#0d6efd", boxShadow: "0 0 0 0.25rem rgba(13,110,253,0.25)" }}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
                {errors.otp && <div className="text-danger text-center">{errors.otp}</div>}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={handleOtpSubmit}
                  disabled={isLoading || otp.length !== 4}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <Button variant="link" onClick={handleResendOtp} disabled={isLoading}>
                  Resend OTP
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;
