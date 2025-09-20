import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css"; // Custom CSS for styling

const MembershipModal = () => {
  const [show, setShow] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  
  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, user is already authenticated
      // We don't need to show the modal
    }
  }, []);

  const handleShow = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token exists, show already member modal
      setAlreadyMember(true);
      setShow(true);
    } else {
      // If not a member, redirect to basic-details page
      navigate("/basic-details");
    }
  };

  const handleClose = () => {
    setShow(false);
    setAlreadyMember(false);
    // Reset form when closing
    setStep(1);
    setMobileNumber("");
    setOtp("");
    setErrors({});
  };

  // Logout handler
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Remove all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    setAlreadyMember(false);
    setShow(false);
    // Redirect to home page
    window.location.href = "/";
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
    setErrors({}); 
    setIsLoading(true);
    try {
      const response = await fetch("https://admin.vaidyabandhu.com/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileNumber,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Success - move to OTP step
        setStep(2);
        // You can also show a success message if needed
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
    setErrors({}); 
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
        // Success - redirect to register page
        console.log("OTP verified successfully:", data);
        // Store user data or token
        const token = data?.data?.token || "";
        localStorage.setItem("token", token);
        handleClose(); // Close the modal
        navigate("/basic-details");
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
      const response = await fetch("https://admin.vaidyabandhu.com/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileNumber,
        }),
      });
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

  return (
    <>
      <button onClick={handleShow} className="buy-membership-btn">
        Become a member @49rs
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName={alreadyMember ? "already-member-modal-wide" : "membership-modal"}
        contentClassName={alreadyMember ? "already-member-modal-content" : undefined}
        style={alreadyMember ? { minWidth: 0 } : {}}
      >
        <Modal.Header closeButton style={alreadyMember ? { borderBottom: 'none', background: 'linear-gradient(90deg, #e0f7fa 0%, #f7fafd 100%)',  padding: '32px 32px 0 32px' } : {}}>
          <Modal.Title style={alreadyMember ? { fontWeight: 800, color: '#046877', fontSize: 28, letterSpacing: 0.5 } : {}}>
            {alreadyMember
              ? "You're already a member!"
              : step === 1
              ? "Buy Membership - Mobile Verification"
              : step === 2
              ? "Buy Membership - OTP Verification"
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={alreadyMember ? { background: '#f7fafd', padding: '20px' } : {}}>
          {alreadyMember ? (
            <div style={{
              textAlign: "center",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f7fafd',
             
            }}>
              <div style={{
                width: '100%',
                padding: '0 0 20px 0',
                background: 'linear-gradient(90deg, #e0f7fa 0%, #f7fafd 100%)',
           
                marginBottom: 0,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                  <p style={{ fontSize: 17, marginBottom: 20, color: '#444', fontWeight: 500 }}>
                    Press the button below to log out.
                  </p>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "500",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                    }}
                    onClick={handleLogout}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#c82333";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "#dc3545";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    }}
                  >
                    <svg style={{ marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
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
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </div>
            </Form>
          ) : step === 2 ? (
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
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MembershipModal;