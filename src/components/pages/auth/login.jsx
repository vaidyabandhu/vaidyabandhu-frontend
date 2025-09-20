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
import { FormInputPassword, FormTextInput } from "../../form";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/doc-slots");
    }
  }, [navigate]);

  const handleForgotPassword = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.vaidyabandhu.com/api/doctor/login/",
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        navigate("/doc-slots");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message || "An error occurred during login."
      );
    } finally {
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
              <h3 className="text-center mb-4">Doctor Login</h3>
              <Form onSubmit={handleLogin}>
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
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <Button
                    className="w-100"
                    variant="primary"
                    type="submit"
                    block
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
        <Modal.Body>Please contact Admin to change your password</Modal.Body>
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
      `}</style>
    </Container>
  );
};

export default DoctorLogin;
