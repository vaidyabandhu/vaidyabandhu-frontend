import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css";

const LOGIN_API = "https://admin.vaidyabandhu.com/api/users/login/";
const VERIFY_OTP_API = "https://admin.vaidyabandhu.com/api/users/verify_login_otp/";
const PROFILE_API = "https://admin.vaidyabandhu.com/api/user/profile/";

const LoginModal = () => {
  const navigate = useNavigate();

  /* ---------------------------------------------
     ✅ STATES
  --------------------------------------------- */
  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // step 1 = mobile, step 2 = otp
  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---------------------------------------------
     ✅ OPEN MODAL FROM ANYWHERE
  --------------------------------------------- */
  useEffect(() => {
    const handleOpenModal = () => setShow(true);
    window.addEventListener("open-login-modal", handleOpenModal);
    return () => window.removeEventListener("open-login-modal", handleOpenModal);
  }, []);

  /* ---------------------------------------------
     ✅ LISTEN LOGIN STATUS UPDATES
  --------------------------------------------- */
  useEffect(() => {
    const handleLoginStateChange = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };
    window.addEventListener("login-state-changed", handleLoginStateChange);
    return () => window.removeEventListener("login-state-changed", handleLoginStateChange);
  }, []);

  /* ---------------------------------------------
     ✅ CHECK TOKEN ON MOUNT
  --------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  /* ---------------------------------------------
     ✅ MODAL HELPERS
  --------------------------------------------- */
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setStep(1);
    setMobileNumber("");
    setOtp("");
    setErrors({});
    setIsLoading(false);
  };

  /* ---------------------------------------------
     ✅ UTILS
  --------------------------------------------- */
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
  const validateOtp = (value) => value.length === 4 && /^[0-9]{4}$/.test(value);

  // ✅ Safe JSON parse (prevents crash if backend sends empty/non-json)
  const safeJson = async (response) => {
    try {
      return await response.json();
    } catch {
      return null;
    }
  };

  /* ---------------------------------------------
     ✅ SEND OTP
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
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await safeJson(response);

      console.log("✅ LOGIN API STATUS:", response.status);
      console.log("✅ LOGIN API RESPONSE:", data);

      // ✅ If backend sends OTP successfully, response.ok should be true
      if (response.ok) {
        setStep(2); // ✅ move to OTP step
        return;
      }

      // ❌ if failed
      setErrors((prev) => ({
        ...prev,
        mobile:
          data?.message ||
          data?.detail ||
          data?.error ||
          "Failed to send OTP. Please try again.",
      }));
    } catch (error) {
      console.error("❌ OTP API Error:", error);
      setErrors((prev) => ({
        ...prev,
        mobile: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setIsLoading(false); // ✅ ALWAYS STOP SPINNER
    }
  };

  /* ---------------------------------------------
     ✅ VERIFY OTP
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
      const response = await fetch(VERIFY_OTP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });

      const data = await safeJson(response);

      console.log("✅ VERIFY OTP STATUS:", response.status);
      console.log("✅ VERIFY OTP RESPONSE:", data);

      // ✅ Support all possible success formats:
      const isSuccess =
        response.ok &&
        (data?.success === true ||
          data?.status === true ||
          data?.message?.toLowerCase?.().includes("success") ||
          data?.data?.token);

      if (!isSuccess) {
        setErrors((prev) => ({
          ...prev,
          otp: data?.message || data?.detail || data?.error || "Invalid OTP. Please try again.",
        }));
        return;
      }

      // ✅ Get token (support multiple response structures)
      const token =
        data?.data?.token ||
        data?.token ||
        data?.access ||
        data?.access_token ||
        "";

      if (!token) {
        setErrors((prev) => ({
          ...prev,
          otp: "Login verified but token missing. Please contact support.",
        }));
        return;
      }

      localStorage.setItem("token", token);
      setIsLoggedIn(true);

      // ✅ notify other components
      window.dispatchEvent(
        new CustomEvent("login-state-changed", { detail: { isLoggedIn: true } })
      );

      // ✅ Close modal immediately
      handleClose();

      // ✅ After OTP success, check profile is_active
      try {
        const profileResponse = await fetch(PROFILE_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const profileData = await safeJson(profileResponse);

        console.log("✅ PROFILE STATUS:", profileResponse.status);
        console.log("✅ PROFILE DATA:", profileData);

        if (profileResponse.ok && profileData?.is_active === true) {
          navigate("/myprofile", { replace: true });
        } else {
          navigate("/basic-details", { replace: true });
        }
      } catch (profileError) {
        console.error("❌ Profile fetch error:", profileError);
        navigate("/basic-details", { replace: true });
      }
    } catch (error) {
      console.error("❌ OTP Verify Error:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setIsLoading(false); // ✅ ALWAYS STOP SPINNER
    }
  };

  /* ---------------------------------------------
     ✅ RESEND OTP
  --------------------------------------------- */
  const handleResendOtp = async () => {
    if (!validateMobile(mobileNumber)) {
      alert("Enter valid mobile number first.");
      return;
    }

    setIsLoading(true);
    setOtp("");
    setErrors({});

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await safeJson(response);

      console.log("✅ RESEND OTP STATUS:", response.status);
      console.log("✅ RESEND OTP RESPONSE:", data);

      if (response.ok) {
        alert("OTP sent successfully!");
      } else {
        alert(data?.message || data?.detail || data?.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("❌ Resend OTP error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------
     ✅ MOBILE CHANGE HANDLER
  --------------------------------------------- */
  const handleMobChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  /* ---------------------------------------------
     ✅ ICON CLICK (GO TO PROFILE OR BASIC DETAILS)
  --------------------------------------------- */
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
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await safeJson(response);

      console.log("✅ ICON PROFILE STATUS:", response.status);
      console.log("✅ ICON PROFILE DATA:", data);

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

  /* ---------------------------------------------
     ✅ UI
  --------------------------------------------- */
  return (
    <>
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

      <Modal show={show} onHide={handleClose} centered className="membership-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1 && "Log in - Mobile Verification"}
            {step === 2 && "Log in - OTP Verification"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
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
                  disabled={isLoading || mobileNumber.length !== 10}
                  className="submit-btn"
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : "Send OTP"}
                </Button>
              </div>
            </Form>
          )}

          {step === 2 && (
            <Form style={{ minHeight: "200px" }}>
              <Form.Group controlId="formOtp" className="mb-3 text-center">
                <Form.Label>Enter OTP sent to {mobileNumber}</Form.Label>

                <div className="d-flex justify-content-center mb-3">
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
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
                  {isLoading ? <Spinner animation="border" size="sm" /> : "Verify OTP"}
                </Button>
              </div>

              <div className="d-flex justify-content-end mt-2">
                <div onClick={handleResendOtp} className="resend-otp-btn">
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
