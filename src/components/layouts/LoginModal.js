import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css";

const LOGIN_API = "https://admin.vaidyabandhu.com/api/users/login/";
const VERIFY_OTP_API = "https://admin.vaidyabandhu.com/api/users/verify_login_otp/";
const PROFILE_API = "https://admin.vaidyabandhu.com/api/user/profile/";

const LoginModal = () => {
  /* ✅ open modal from anywhere */
  useEffect(() => {
    const handleOpenModal = () => setShow(true);
    window.addEventListener("open-login-modal", handleOpenModal);
    return () => window.removeEventListener("open-login-modal", handleOpenModal);
  }, []);

  /* ✅ listen login state changes from other components */
  useEffect(() => {
    const handleLoginStateChange = (event) => {
      setIsLoggedIn(!!event?.detail?.isLoggedIn);
    };
    window.addEventListener("login-state-changed", handleLoginStateChange);
    return () =>
      window.removeEventListener("login-state-changed", handleLoginStateChange);
  }, []);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=Mobile , 2=OTP

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ✅ Check token on mount */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
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

  /* ✅ validation */
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
  const validateOtp = (v) => v?.length === 4 && /^[0-9]{4}$/.test(v);

  /* ✅ Mobile input change */
  const handleMobChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  /* ---------------------------------------------
     ✅ IMPORTANT FIX
     Send OTP using FormData (avoid CORS preflight)
  --------------------------------------------- */
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
        body: fd, // ✅ NO JSON headers
      });

      const raw = await response.text();
      console.log("✅ SEND OTP STATUS:", response.status);
      console.log("✅ SEND OTP RAW RESPONSE:", raw);

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
      console.error("❌ Send OTP Error:", error);
      setErrors((prev) => ({
        ...prev,
        mobile: "Network/CORS error. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------
     ✅ Verify OTP using FormData (avoid preflight)
  --------------------------------------------- */
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
        body: fd, // ✅ NO JSON headers
      });

      const raw = await response.text();
      console.log("✅ VERIFY OTP STATUS:", response.status);
      console.log("✅ VERIFY OTP RAW RESPONSE:", raw);

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

        handleClose();

        /* ✅ Now fetch profile to decide where to go */
        try {
          const profileRes = await fetch(PROFILE_API, {
            method: "GET",
            headers: {
              Authorization: token, // ✅ your API uses direct token
            },
          });

          const profileRaw = await profileRes.text();
          console.log("✅ PROFILE STATUS:", profileRes.status);
          console.log("✅ PROFILE RAW RESPONSE:", profileRaw);

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
          console.error("❌ Profile fetch error:", profileError);
          navigate("/basic-details");
        }
      } else {
        const msg =
          data?.message ||
          data?.error ||
          "Invalid OTP. Please try again.";
        setErrors((prev) => ({ ...prev, otp: msg }));
      }
    } catch (error) {
      console.error("❌ Verify OTP Error:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Network/CORS error. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  /* ✅ Resend OTP (FormData) */
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
      console.log("✅ RESEND OTP STATUS:", response.status);
      console.log("✅ RESEND OTP RAW RESPONSE:", raw);

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
      console.error("❌ Resend OTP Error:", error);
      alert("Network/CORS error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ✅ MyProfile icon click */
  const handleIconClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/basic-details");
      return;
    }

    try {
      const response = await fetch(PROFILE_API, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const raw = await response.text();
      console.log("✅ PROFILE ICON CLICK STATUS:", response.status);
      console.log("✅ PROFILE ICON CLICK RAW:", raw);

      let data = null;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        data = null;
      }

      if (response.ok && data?.is_active === true) {
        navigate("/myprofile");
      } else {
        navigate("/basic-details");
      }
    } catch (error) {
      console.error("❌ handleIconClick error:", error);
      navigate("/basic-details");
    }
  };

  return (
    <>
      {/* ✅ Button based on login state */}
      {isLoggedIn ? (
        <button className="user-icon-btn" onClick={handleIconClick}>
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

      {/* ✅ Modal */}
      <Modal show={show} onHide={handleClose} centered className="membership-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1 && "Log in - Mobile Verification"}
            {step === 2 && "Log in - OTP Verification"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* STEP 1 */}
          {step === 1 && (
            <Form style={{ minHeight: "200px" }}>
              <Form.Group controlId="formMobileNumber" className="mb-3">
                <Form.Label>Enter Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={handleMobChange}
                  isInvalid={!!errors.mobile}
                  maxLength={10}
                  inputMode="numeric"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  onClick={handleMobileSubmit}
                  disabled={isLoading || !mobileNumber}
                  className="submit-btn"
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
              </div>
            </Form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <Form style={{ minHeight: "200px" }}>
              <Form.Group controlId="formOtp" className="mb-3 text-center">
                <Form.Label>Enter OTP sent to {mobileNumber}</Form.Label>

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
                      width: "45px",
                      height: "45px",
                      margin: "0 5px",
                      padding: "0px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontFamily: "poppins",
                      border: "2px solid #ced4da",
                      borderRadius: "5px",
                      outline: "none",
                    }}
                    focusStyle={{
                      border: "2px solid #007bff",
                      outline: "none",
                    }}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>

                {errors.otp && (
                  <div className="invalid-feedback d-block text-center">
                    {errors.otp}
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleOtpSubmit}
                  disabled={isLoading || otp.length !== 4}
                  className="submit-btn"
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
              </div>

              <div className="d-flex justify-content-end mt-2">
                <div
                  onClick={handleResendOtp}
                  className="resend-otp-btn"
                  style={{
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  Resend OTP
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;
