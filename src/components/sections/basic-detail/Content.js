import React, { useState } from "react";
import {
  CreditCard,
  MapPin,
  Star,
  Check,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Form, Col, Row, Card } from "react-bootstrap";
import "../../../assets/css/BasicDetail.css";
import languagesType from "./data.json";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Unknown",
];

const VaidyaBandhuForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    blood_group: "",
    mobile_number: "",
    alternate_mobile: "",
    email: "",
    address: "",
    pin_code: "",
    aadhaar_number: "",
    pan_number: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Handle language change
  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name =
        languagesType[selectedLanguage].validation.fullNameRequired;
    }

    if (!formData.age.trim()) {
      newErrors.age = languagesType[selectedLanguage].validation.ageRequired;
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = languagesType[selectedLanguage].validation.ageValid;
    }

    if (!formData.gender) {
      newErrors.gender =
        languagesType[selectedLanguage].validation.genderRequired;
    }

    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number =
        languagesType[selectedLanguage].validation.mobileRequired;
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      newErrors.mobile_number =
        languagesType[selectedLanguage].validation.mobileValid;
    }

    if (!formData.address.trim()) {
      newErrors.address =
        languagesType[selectedLanguage].validation.addressRequired;
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code =
        languagesType[selectedLanguage].validation.pinCodeRequired;
    } else if (!/^\d{6}$/.test(formData.pin_code)) {
      newErrors.pin_code =
        languagesType[selectedLanguage].validation.pinCodeValid;
    }

    if (
      formData.alternate_mobile &&
      !/^[6-9]\d{9}$/.test(formData.alternate_mobile)
    ) {
      newErrors.alternate_mobile =
        languagesType[selectedLanguage].validation.alternateValid;
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = languagesType[selectedLanguage].validation.emailValid;
    }

    if (formData.aadhaar_number && !/^\d{12}$/.test(formData.aadhaar_number)) {
      newErrors.aadhaar_number =
        languagesType[selectedLanguage].validation.aadhaarValid;
    }

    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
    ) {
      newErrors.pan_number = languagesType[selectedLanguage].validation.panValid;
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNumberChange = (e, fieldName) => {
    const value = e.target.value;
    const maxLength =
      fieldName === "pin_code"
        ? 6
        : fieldName === "mobile_number"
        ? 10
        : fieldName === "aadhaar_number"
        ? 12
        : 3;

    if (/^[0-9]*$/.test(value) && value.length <= maxLength) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      if (errors[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("https://52.66.199.115:8000/api/users/2/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || ''
        },
        body: JSON.stringify({ ...formData, amount: 49, currency: "INR" }),
      });

      const data = await response.json();
      // Do something with the response
    } catch (error) {
      alert("Error occurred while creating order");
    }
    setIsSubmitting(false);
  };

  const benefits = languagesType[selectedLanguage].benefits;
  const termsConditions = languagesType[selectedLanguage].terms;

  return (
    <div className="container-fluid bg-light py-5 container-bg" >
      <div className="container">
        <div className="d-flex justify-content-end">
          <div className="text-right mb-4" style={{ width: "200px" }}>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="ml">Malayalam</option>
              <option value="kn">Kannada</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="display-4 mb-2 " style={{ fontFamily: 'Poppins' }}>
            {languagesType[selectedLanguage].title}
          </h1>
          <p className="lead secondary-color mb-4" style={{ fontFamily: 'Poppins' }}>
            {languagesType[selectedLanguage].subtitle}
          </p>
        </div>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h4 className="h4 mb-4" style={{ fontFamily: 'Poppins' }}>
                  <Star className="h-6 w-6 text-yellow-500 me-1" />{" "}
                  {languagesType[selectedLanguage].membershipBenefits}
                </h4>
                <ul className="list-unstyled">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="d-flex align-items-start mb-2" style={{ fontFamily: 'Poppins' }}>
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="ms-2">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h2 className="h4 mb-4" style={{ fontFamily: 'Poppins' }}>
                  <CreditCard className="h-6 w-6 secondary-color me-2" />{" "}
                  {languagesType[selectedLanguage].membershipCharges}
                </h2>
                <div className="text-center">
                  <div
                    className="text-4xl font-bold mb-2 text-primary"
                    style={{ fontSize: "27px" }}
                  >
                    ₹49
                  </div>
                  <div className="text-lg opacity-90" style={{ fontFamily: 'Poppins' }}>
                    {languagesType[selectedLanguage].validFor}
                  </div>
                  <div className="text-sm mt-2 opacity-80" style={{ fontFamily: 'Poppins' }}>
                    {languagesType[selectedLanguage].instantCard}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <Card.Body>
                <h2 className="h4 mb-6 secondary-color flex items-center" style={{ fontFamily: 'Poppins' }}>
                  <MapPin className="h-6 w-6 text-blue-500 me-2" />{" "}
                  {languagesType[selectedLanguage].personalDetails}
                </h2>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <Row>
                    <Col md={12}>
                      <Form.Group controlId="formFullName" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.full_name} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.full_name}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .full_name
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.full_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formAge" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.age} *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={(e) => handleNumberChange(e, "age")}
                          isInvalid={!!errors.age}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .age
                          }
                          min="1"
                          max="120"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.age}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="formGender" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.gender} *
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          isInvalid={!!errors.gender}
                        >
                          <option value="">
                            {languagesType[selectedLanguage].form.selectGender}
                          </option>
                          <option value="Male">
                            {languagesType[selectedLanguage].form.male}
                          </option>
                          <option value="Female">
                            {languagesType[selectedLanguage].form.female}
                          </option>
                          <option value="Other">
                            {languagesType[selectedLanguage].form.other}
                          </option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Blood Group - select */}
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formBloodGroup" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.blood_group}
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleInputChange}
                          isInvalid={!!errors.blood_group}
                        >
                          <option value="">
                            {languagesType[selectedLanguage].form.selectBloodGroup || "Select Blood Group"}
                          </option>
                          {BLOOD_GROUPS.map((bg, idx) => (
                            <option key={bg + idx} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.blood_group}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Address and Pin code */}
                  <Row>
                    <Col md={8}>
                      <Form.Group controlId="formAddress" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.address} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          isInvalid={!!errors.address}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .address
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="formPinCode" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.pin_code} *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="pin_code"
                          value={formData.pin_code}
                          onChange={(e) => handleNumberChange(e, "pin_code")}
                          isInvalid={!!errors.pin_code}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .pin_code
                          }
                          maxLength="6"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pin_code}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group controlId="formMobileNumber" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.mobile_number} *
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={(e) =>
                            handleNumberChange(e, "mobile_number")
                          }
                          isInvalid={!!errors.mobile_number}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .mobile_number
                          }
                          maxLength="10"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mobile_number}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group
                        controlId="formAlternateNumber"
                        className="mb-3"
                      >
                        <Form.Label>
                          {languagesType[selectedLanguage].form.alternate_mobile}
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="alternate_mobile"
                          value={formData.alternate_mobile}
                          onChange={(e) =>
                            handleNumberChange(e, "alternate_mobile")
                          }
                          isInvalid={!!errors.alternate_mobile}
                          placeholder={
                            languagesType[selectedLanguage].form.placeholders
                              .alternate_mobile
                          }
                          maxLength="10"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.alternate_mobile}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Email ID */}
                  <Form.Group controlId="formEmailId" className="mb-3">
                    <Form.Label>
                      {languagesType[selectedLanguage].form.email}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                      placeholder={
                        languagesType[selectedLanguage].form.placeholders
                          .email
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Aadhaar Number */}
                  <Form.Group controlId="formAadhaarNumber" className="mb-3">
                    <Form.Label>
                      {languagesType[selectedLanguage].form.aadhaar_number}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={(e) => handleNumberChange(e, "aadhaar_number")}
                      isInvalid={!!errors.aadhaar_number}
                      placeholder={
                        languagesType[selectedLanguage].form.placeholders
                          .aadhaar_number
                      }
                      maxLength="12"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aadhaar_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* PAN Number */}
                  <Form.Group controlId="formPanNumber" className="mb-3">
                    <Form.Label>
                      {languagesType[selectedLanguage].form.pan_number}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      isInvalid={!!errors.pan_number}
                      placeholder={
                        languagesType[selectedLanguage].form.placeholders
                          .pan_number
                      }
                      maxLength="10"
                      style={{ textTransform: "uppercase" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pan_number}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100 py-3 mt-4 buy-membership-btn"
                  >
                    {isSubmitting
                      ? languagesType[selectedLanguage].processing
                      : languagesType[selectedLanguage].payNow}
                  </button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h2 className="h4 mb-4" style={{ fontFamily: 'Poppins' }}>
                  <Shield className="h-6 w-6 me-2" />{" "}
                  {languagesType[selectedLanguage].termsConditions}
                </h2>
                <ul className="list-unstyled">
                  {termsConditions.map((term, index) => (
                    <li key={index} className="d-flex align-items-start mb-2" style={{ fontFamily: 'Poppins' }}>
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="ms-4" style={{ fontFamily: 'Poppins' }}>{term}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default VaidyaBandhuForm
