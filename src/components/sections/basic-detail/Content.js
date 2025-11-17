import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  MapPin,
  Star,
  Check,
  AlertCircle,
  Shield,
  Upload,
  X,
  LogOut,
} from "lucide-react";
import { Form, Col, Row, Card, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/BasicDetail.css";
import languagesType from "./data.json";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    blood_group: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    address: "",
    pin_code: "",
    aadhaar_number: "",
    pan_number: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Cropping state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [croppedFile, setCroppedFile] = useState(null);

  // Handle language change
  const handleLanguageChange = (e) => setSelectedLanguage(e.target.value);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setErrors((prev) => ({
          ...prev,
          photo: languagesType[selectedLanguage].validation.photoValid,
        }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: languagesType[selectedLanguage].validation.photoSize,
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://admin.vaidyabandhu.com/api/user/profile/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Convert numeric fields to strings to ensure consistency
          setFormData({
            ...data,
            age: data.age ? String(data.age) : "",
            pin_code: data.pin_code ? String(data.pin_code) : "",
            aadhaar_number: data.aadhaar_number ? String(data.aadhaar_number) : "",
          });
          if (data.photo) {
            setPhotoPreview(data.photo);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle photo removal
  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setPhotoPreview(null);
    setCroppedFile(null);
  };

  // Crop functions
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const onCropComplete = (c) => {
    setCompletedCrop(c);
  };

  const createCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Convert percentage values to pixel values
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedBlob = await createCroppedImage();
      if (!croppedBlob) return;
      
      const croppedFile = new File([croppedBlob], 'cropped_photo.jpg', {
        type: 'image/jpeg',
      });
      
      setCroppedFile(croppedFile);
      setPhotoPreview(URL.createObjectURL(croppedBlob));
      setFormData((prev) => ({
        ...prev,
        photo: croppedFile,
      }));
      
      // Clear any existing photo error
      if (errors.photo) {
        setErrors((prev) => ({
          ...prev,
          photo: "",
        }));
      }
    } catch (e) {
      console.error('Error cropping image', e);
    } finally {
      setCropModalOpen(false);
      setImgSrc(null);
    }
  };

  // Memoized validation function using useCallback
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name =
        languagesType[selectedLanguage].validation.fullNameRequired;
    }

    // Convert age to string before trimming
    const ageStr = String(formData.age || "");
    if (!ageStr.trim()) {
      newErrors.age = languagesType[selectedLanguage].validation.ageRequired;
    } else if (isNaN(ageStr) || Number(ageStr) < 1 || Number(ageStr) > 120) {
      newErrors.age = languagesType[selectedLanguage].validation.ageValid;
    }

    if (!formData.gender) {
      newErrors.gender =
        languagesType[selectedLanguage].validation.genderRequired;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile_number =
        languagesType[selectedLanguage].validation.mobileRequired;
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile_number =
        languagesType[selectedLanguage].validation.mobileValid;
    }

    if (!formData.address.trim()) {
      newErrors.address =
        languagesType[selectedLanguage].validation.addressRequired;
    }

    // Convert pin_code to string before trimming
    const pinCodeStr = String(formData.pin_code || "");
    if (!pinCodeStr.trim()) {
      newErrors.pin_code =
        languagesType[selectedLanguage].validation.pinCodeRequired;
    } else if (!/^\d{6}$/.test(pinCodeStr)) {
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = languagesType[selectedLanguage].validation.emailValid;
    }

    // Convert aadhaar_number to string before testing
    const aadhaarStr = String(formData.aadhaar_number || "");
    if (aadhaarStr && !/^\d{12}$/.test(aadhaarStr)) {
      newErrors.aadhaar_number =
        languagesType[selectedLanguage].validation.aadhaarValid;
    }

    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
    ) {
      newErrors.pan_number =
        languagesType[selectedLanguage].validation.panValid;
    }

    return newErrors;
  }, [formData, selectedLanguage, languagesType]);

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

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("blood_group", formData.blood_group);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("pin_code", formData.pin_code);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("alternate_number", formData.alternate_mobile);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("aadhaar_number", formData.aadhaar_number);
      formDataToSend.append("pan_number", formData.pan_number);
      if (formData.photo) {
        formDataToSend.append("profile_image", formData.photo);
      }

      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/user/profile/",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formDataToSend,
        }
      );

      const createOrder = await fetch(
        "https://admin.vaidyabandhu.com/api/payment/create_order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            subscription: 1,
          }),
        }
      );
      const createOrderData = await createOrder.json();
      if (!createOrder.ok) {
        alert(
          "Failed to create order: " +
            (createOrderData.detail || JSON.stringify(createOrderData))
        );
        setIsSubmitting(false);
        return;
      }

      const order_id = createOrderData.order_id || "order_RI9lDcv6o4vXni";
      const razorpay_key =
        createOrderData.razorpay_key || "rzp_live_RBDq4cloXLAvYR";
      const amount = createOrderData.amount || 49;
      const currency = createOrderData.currency || "INR";

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay script");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: razorpay_key,
        amount: amount,
        currency: currency,
        name: "VaidyaBandhu Membership",
        description: "Membership Payment",
        order_id: order_id,
        handler: async function (response) {
          try {
            console.log("Payment successful:", response);

            const callbackResponse = await fetch(
              "https://admin.vaidyabandhu.com/api/payment/callback/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (callbackResponse.ok) {
              // Show welcome modal instead of navigating immediately
              setShowWelcomeModal(true);
            } else {
              const errorData = await callbackResponse.json();
              console.error("Callback API error:", errorData);
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error in payment callback:", error);
            alert(
              "An error occurred during payment verification. Please contact support."
            );
          } finally {
            setIsSubmitting(false);
          }
        },

        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error occurred while creating order or payment:", error);
      alert("Error occurred while creating order or payment");
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(
        /=.*/,
        "=;expires=" + new Date(0).toUTCString() + ";path=/"
      );
    });
    setShowLogoutModal(false);
    window.location.href = "/";
  };

  const benefits = languagesType[selectedLanguage].benefits;
  const termsConditions = languagesType[selectedLanguage].terms;

  return (
    <div className="container-fluid bg-light py-5 container-bg">
      <style>
        {`
          @media (max-width: 768px) {
            .mobile-heading {
              font-size: 1.1rem !important;
              text-align: center !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .mobile-heading svg {
              margin-right: 8px !important;
            }
          }
        `}
      </style>
      
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
          <h1 className="display-4 mb-2 " style={{ fontFamily: "Poppins" }}>
            {languagesType[selectedLanguage].title}
          </h1>
          <p
            className="lead secondary-color mb-4"
            style={{ fontFamily: "Poppins" }}
          >
            {languagesType[selectedLanguage].subtitle}
          </p>
        </div>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h4 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <Star className="h-6 w-6 text-yellow-500 me-1" />{" "}
                  {languagesType[selectedLanguage].membershipBenefits}
                </h4>
                <ul className="list-unstyled">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-start mb-2"
                      style={{ fontFamily: "Poppins" }}
                    >
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="ms-2">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-lg">
              <Card.Body>
                <h2 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <CreditCard className="h-6 w-6 secondary-color me-2" />{" "}
                  {languagesType[selectedLanguage].membershipCharges}
                </h2>
                <div className="text-center">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ fontSize: "27px", color: "#007a7e" }}
                  >
                    ₹49
                  </div>
                  <div
                    className="text-lg opacity-90"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {languagesType[selectedLanguage].validFor}
                  </div>
                  <div
                    className="text-sm mt-2 opacity-80"
                    style={{ fontFamily: "Poppins" }}
                  >
                    {languagesType[selectedLanguage].instantCard}
                  </div>
                </div>
              </Card.Body>
            </Card>
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
                marginTop: "15px",
                margin: "15px auto 20px",
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <LogOut className="h-5 w-5" style={{ marginRight: "8px" }} />
              Logout
            </button>
          </Col>

          <Col md={8}>
            <Card className="bg-white rounded-xl shadow-lg p-6 mb-4">
              <Card.Body>
                <h2
                  className="h4 mb-6 secondary-color flex items-center"
                  style={{ fontFamily: "Poppins" }}
                >
                  <MapPin className="h-6 w-6 text-blue-500 me-2" />{" "}
                  {languagesType[selectedLanguage].personalDetails}
                </h2>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  {/* Photo Upload Section */}
                  <Row>
                    <Col md={12}>
                      <Form.Group controlId="formPhoto" className="mb-3">
                        <Form.Label>
                          {languagesType[selectedLanguage].form.photo}
                        </Form.Label>
                        <div className="position-relative">
                          {!photoPreview ? (
                            <div className="border rounded d-flex align-items-center justify-content-center p-4 bg-light">
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-secondary mx-auto mb-2" />
                                <p className="mb-2">
                                  {
                                    languagesType[selectedLanguage].form
                                      .uploadPhotoText
                                  }
                                </p>
                                <Form.Control
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePhotoChange}
                                  className="d-none"
                                  id="photo-upload"
                                />
                                <label
                                  htmlFor="photo-upload"
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: "#3399cc",
                                    color: "white",
                                    border: "none",
                                    padding: "0.375rem 0.75rem",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.5",
                                    borderRadius: "0.25rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {
                                    languagesType[selectedLanguage].form
                                      .chooseFile
                                  }
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="position-relative">
                              <Image
                                src={photoPreview}
                                alt="Preview"
                                rounded
                                className="img-thumbnail"
                                style={{ maxHeight: "200px" }}
                              />
                              <button
                                type="button"
                                className="position-absolute top-0 end-0 bg-danger text-white rounded-circle p-1 border border-white"
                                onClick={handleRemovePhoto}
                                style={{ transform: "translate(50%, -50%)" }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <Form.Control.Feedback
                            type="invalid"
                            className="d-block"
                          >
                            {errors.photo}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Rest of the form fields remain unchanged */}
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
                            {languagesType[selectedLanguage].form
                              .selectBloodGroup || "Select Blood Group"}
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
                          value={formData.mobile}
                          readOnly
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
                  </Row>
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
                        languagesType[selectedLanguage].form.placeholders.email
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

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
                <h2 className="h4 mb-4 mobile-heading" style={{ fontFamily: "Poppins" }}>
                  <Shield className="h-6 w-6 me-2" />{" "}
                  {languagesType[selectedLanguage].termsConditions}
                </h2>
                <ul className="list-unstyled">
                  {termsConditions.map((term, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-start mb-2"
                      style={{ fontFamily: "Poppins" }}
                    >
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="ms-4" style={{ fontFamily: "Poppins" }}>
                        {term}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: "#095D7E",
              }}
            >
              Confirm Logout
            </h3>
            <p>Are you sure you want to logout?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#dc3545",
                  color: "white",
                }}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#095D7E",
              }}
            >
              Welcome to VaidyaBandhu Family
            </h3>
            <p style={{ marginBottom: "25px", fontSize: "16px" }}>
              The complete healthcare solution.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  backgroundColor: "#007a7e",
                  color: "white",
                  fontSize: "16px",
                }}
                onClick={() => {
                  setShowWelcomeModal(false);
                  navigate("/myprofile");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      <Modal show={cropModalOpen} onHide={() => setCropModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crop Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: '500px', maxWidth: '100%' }}
                />
              </ReactCrop>
            )}
          </div>
          <canvas
            ref={previewCanvasRef}
            style={{ display: 'none' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setCropModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCropSave}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Upload Photo
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VaidyaBandhuForm;