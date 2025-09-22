import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css"; // Custom CSS for styling

const LoginModal = () => {
  // Listen for custom event to open modal from anywhere
  useEffect(() => {
    const handleOpenModal = () => setShow(true);
    window.addEventListener("open-login-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-login-modal", handleOpenModal);
    };
  }, []);
  
  // Listen for login state changes from other components
  useEffect(() => {
    const handleLoginStateChange = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
    };
    window.addEventListener("login-state-changed", handleLoginStateChange);
    return () => {
      window.removeEventListener("login-state-changed", handleLoginStateChange);
    };
  }, []);
  
  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Mobile Number, 2: OTP, 3: Basic Details
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    // Reset form when closing
    setStep(1);
    setMobileNumber("");
    setOtp("");
    setErrors({});
  };

  // Validate Mobile Number (10 digits, only numeric)
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const handleMobileSubmit = async () => {
    if (!validateMobile(mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid 10-digit mobile number.",
      }));
      return;
    }
    setErrors({}); // Clear errors
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/users/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobileNumber,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Success - move to OTP step
        setStep(2);
        console.log("OTP sent successfully:", data);
      } else {
        // Handle API error
        setErrors((prev) => ({
          ...prev,
          mobile:
            data.message ||
            data.error ||
            "Failed to send OTP. Please try again.",
        }));
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrors((prev) => ({
        ...prev,
        mobile: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Validate OTP (4 digits)
  const validateOtp = (otp) => otp.length === 4 && /^[0-9]{4}$/.test(otp);

 const handleOtpSubmit = async () => {
  if (!validateOtp(otp)) {
    setErrors((prev) => ({
      ...prev,
      otp: "OTP should be exactly 4 digits.",
    }));
    return;
  }
  setErrors({}); // Clear errors
  setIsLoading(true);
  try {
    const response = await fetch(
      "https://admin.vaidyabandhu.com/api/users/verify_login_otp/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileNumber,
          otp: otp,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      // Success - check if user is already a member (token exists)
      console.log("OTP verified successfully:", data);
      const token = data?.data?.token || "";
      console.log("Received token:", token);
      localStorage.setItem("token", token);
      setIsLoggedIn(true); // Update login state
      
      // Dispatch custom event to notify other components about login
      window.dispatchEvent(new CustomEvent("login-state-changed", { detail: { isLoggedIn: true } }));
      
      handleClose(); // Close the modal
      
      // Fetch user profile to check is_active status
      try {
        const profileResponse = await fetch(
          "https://admin.vaidyabandhu.com/api/user/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const profileData = await profileResponse.json();
        console.log("Profile data after login:", profileData);
        
        if (profileResponse.ok && profileData?.is_active === true) {
          console.log("User is active, navigating to /myprofile");
          navigate("/myprofile");
        } else {
          console.log("User is not active, navigating to /basic-details");
          navigate("/basic-details");
        }
      } catch (profileError) {
        console.error("Error fetching profile after OTP:", profileError);
        navigate("/basic-details");
      }
    } else {
      // Handle API error
      setErrors((prev) => ({
        ...prev,
        otp: data.message || data.error || "Invalid OTP. Please try again.",
      }));
    }
  } catch (error) {
    console.error("API Error:", error);
    setErrors((prev) => ({
      ...prev,
      otp: "Network error. Please check your connection and try again.",
    }));
  } finally {
    setIsLoading(false);
  }
};

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtp(""); // Clear current OTP
    setErrors({}); // Clear errors
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/users/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: mobileNumber,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent successfully!");
      } else {
        alert(
          data.message ||
            data.error ||
            "Failed to resend OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes for number fields (allow integers only)
  const handleMobChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 10) {
      // Validate numeric input
      setMobileNumber(value);
      // Clear mobile error when user starts typing
      if (errors.mobile) {
        setErrors((prev) => ({ ...prev, mobile: "" }));
      }
    }
  };

  // Helper: Call profile API and redirect based on is_active
  const handleIconClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/basic-details");
      return;
    }
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/profile/", // Added trailing slash
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Removed "Bearer " prefix
          },
        }
      );
      const data = await response.json();
      console.log("Profile API response:", data); // Add logging to debug

      if (response.ok) {
        // Check if the user is active - note the path to is_active
        if (data?.is_active === true) {
          console.log("User is active, navigating to /myprofile");
          navigate("/myprofile");
        } else {
          console.log("User is not active, navigating to /basic-details");
          navigate("/basic-details");
        }
      } else {
        // fallback if API fails
        console.error("Profile API failed with status:", response.status);
        navigate("/basic-details");
      }
    } catch (error) {
      console.error("Error in handleIconClick:", error);
      navigate("/basic-details");
    }
  };

  return (
    <>
      {/* Conditionally render button based on login state */}
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
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="membership-modal"
      >
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
                  maxLength={10} // Restrict input to 10 characters
                  inputMode="numeric" // For mobile and numeric input
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
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Send OTP"
                  )}
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
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
              <div className="d-flex justify-content-end">
                <div
                  variant="link"
                  onClick={handleResendOtp}
                  className="resend-otp-btn"
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