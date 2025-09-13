import React, { useState } from "react";
import {
  Modal,
  Form,
  Button,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { CheckCircle, Mail, Phone, User, MapPin } from "lucide-react";
import { toast } from "sonner";

const ShowEnquireModal = ({ show, onClose, setShowSuccessMessage, token }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.full_name.trim()) {
      validationErrors.full_name = "Name is required";
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.trim())) {
      validationErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      validationErrors.email = "Please enter a valid email address";
    }

    return validationErrors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("https://52.66.199.115:8000/api/users/enquiry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Enquiry submitted successfully:", data);

        // Reset form and show success
        setFormData({ full_name: "", phone: "", email: "", address: "" });
        setErrors({});
        onClose();
        toast.success(data.message, {position: 'top-center'})
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setErrors({ submit: "Failed to submit enquiry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ full_name: "", phone: "", email: "", address: "" });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isSubmitting ? "static" : true}
      keyboard={!isSubmitting}
    >
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title className="secondary-color">Send Enquiry</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "15px 10px" }}>
        {errors.submit && (
          <Alert variant="danger" className="mb-3">
            {errors.submit}
          </Alert>
        )}

        <Form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Full Name *</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="border-0 bg-light">
                    <User size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    isInvalid={!!errors.full_name}
                    disabled={isSubmitting}
                    className="border-0 bg-light"
                    style={{ borderRadius: "0 12px 12px 0" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Phone Number *</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="border-0 bg-light">
                    <Phone size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    isInvalid={!!errors.phone}
                    disabled={isSubmitting}
                    className="border-0 bg-light"
                    style={{ borderRadius: "0 12px 12px 0" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email Address *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="border-0 bg-light">
                <Mail size={16} />
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                isInvalid={!!errors.email}
                disabled={isSubmitting}
                className="border-0 bg-light"
                style={{ borderRadius: "0 12px 12px 0" }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Address (Optional)</Form.Label>
            <InputGroup>
              <InputGroup.Text className="border-0 bg-light align-items-start pt-2">
                <MapPin size={16} />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your address (optional)"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={isSubmitting}
                className="border-0 bg-light"
                style={{ borderRadius: "0 12px 12px 0" }}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="light"
          onClick={handleClose}
          disabled={isSubmitting}
          className="me-2 text-black"
          style={{
            borderRadius: "12px",
            fontSize: "14px",
            padding: "8px 18px",
            textTransform: "capitalize",
            background: "#fff",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          style={{
            borderRadius: "12px",
            fontSize: "14px",
            padding: "8px 18px",
            textTransform: "capitalize",
          }}
        >
          {isSubmitting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Sending...
            </>
          ) : (
            <>
              <CheckCircle size={16} className="me-2 mr-2" />
              Send Enquiry
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowEnquireModal;
