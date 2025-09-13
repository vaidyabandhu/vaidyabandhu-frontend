import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

import { Modal, Button, Form, Spinner } from "react-bootstrap";
import OTPInput from "react-otp-input";
import "../../assets/css/MembershipModal.css"; // Custom CSS for styling

const MembershipModal = () => {
  const [show, setShow] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Mobile Number, 2: OTP, 3: Basic Details
  const navigate = useNavigate ();
  const [errors, setErrors] = useState({});

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
      const response = await fetch("http://52.66.199.115:8000/api/users/login/", {
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
    setErrors({}); // Clear errors
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://52.66.199.115:8000/api/users/verify_login_otp/",
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

        // You might want to store user data or token here
        // For example: localStorage.setItem('userToken', data.token);
        // Or store user data in context/state management
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
      const response = await fetch("http://52.66.199.115:8000/api/users/login/", {
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
        className="membership-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 1 && "Buy Membership - Mobile Verification"}
            {step === 2 && "Buy Membership - OTP Verification"}
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
            <Form style={{ minHeight: "200px"  }}>
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

export default MembershipModal;