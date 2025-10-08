import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle state — "doctor" or "frontdesk"
  const [loginType, setLoginType] = useState("doctor");

  // Doctor credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Front Desk credentials
  const [mobile, setMobile] = useState("");
  const [fdPassword, setFdPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    
    if (token) {
      if (userType === "frontdesk") {
        navigate("/patient-list");
      } else {
        navigate("/doc-slots");
      }
    }
  }, [navigate]);

  const handleForgotPassword = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (loginType === "doctor") {
        endpoint = "https://admin.vaidyabandhu.com/api/doctor/login/";
        payload = {
          username: username.trim(),
          password: password.trim(),
        };
        
      } else {
        endpoint = "https://admin.vaidyabandhu.com/api/doctor/login/"; 
        payload = {
          mobile: mobile.trim(), 
          password: fdPassword.trim(),
        };
      }

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.data?.token) {
        console.log("Login successful:", response.data);
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("refreshToken", response.data.data.refresh_token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.data));
        localStorage.setItem("userType", loginType); // Store user type
        
        // Navigate based on user type
        if (loginType === "doctor") {
          navigate("/doc-slots");
        } else {
          navigate("/patient-list");
        }
      } else {
        console.log("Login failed:", response.data);
        alert(response.data?.message || "Login failed. Please check credentials.");
      }
    } 
    catch (error) {
      if (error.response?.status === 500) {
        console.error("Server error:", error);
        alert("Server error. Please ensure you selected the correct login type.");
      } else {
        console.error("Login error:", error);
        alert(error?.response?.data?.message || "Login failed. Please try again.");
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f4f6f9" }}
    >
      <Row className="justify-content-center w-100">
        <Col md={6} lg={4}>
          <Card className="shadow-lg rounded p-4">
            <Card.Body>
              <h3 className="text-center mb-4">
                {loginType === "doctor" ? "Doctor Login" : "Front Desk Login"}
              </h3>

              {/* Login Form */}
              <Form onSubmit={handleLogin}>
                {loginType === "doctor" ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        style={{ height: "43px" }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{ height: "43px" }}
                        required
                      />
                    </Form.Group>
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter mobile number"
                        style={{ height: "43px" }}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={fdPassword}
                        onChange={(e) => setFdPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{ height: "43px" }}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <div className="d-flex justify-content-center align-items-center mt-4">
                  <Button
                    className="w-100"
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <span
                    onClick={handleForgotPassword}
                    className="text-decoration-none"
                    style={{ cursor: "pointer" }}
                  >
                    Forgot your password?
                  </span>
                </div>

                {/* Custom Toggle UI */}
                <div className="d-flex justify-content-center mt-4">
                  <div className="custom-toggle-container">
                    <div 
                      className={`toggle-option ${loginType === 'doctor' ? 'active' : ''}`}
                      onClick={() => setLoginType('doctor')}
                    >
                      Doctor
                    </div>
                    <div 
                      className={`toggle-option ${loginType === 'frontdesk' ? 'active' : ''}`}
                      onClick={() => setLoginType('frontdesk')}
                    >
                      Front Desk
                    </div>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Forgot Password Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please contact Admin to reset your password.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Styling */}
      <style>{`
        .btn-primary {
          background-color: #4c74a6;
          border-color: #4c74a6;
        }
        .btn-primary:hover {
          background-color: #2c4a72;
          border-color: #2c4a72;
        }
        
        /* Custom Toggle Styles */
        .custom-toggle-container {
          display: flex;
          background-color: #e9ecef;
          border-radius: 25px;
          padding: 4px;
          width: 220px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .toggle-option {
          flex: 1;
          text-align: center;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          color: #6c757d;
        }
        
        .toggle-option.active {
          background-color: #005963;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .toggle-option:not(.active):hover {
          background-color: #dee2e6;
        }
      `}</style>
    </Container>
  );
};

export default DoctorLogin;