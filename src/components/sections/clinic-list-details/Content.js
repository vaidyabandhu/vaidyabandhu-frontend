import React, { useState, useEffect, useCallback } from "react";
import { Phone, MapPin, Star, Calendar } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import ShowEnquireModal from "../clinic-list/showEnquireModal";
import { toast } from "sonner";

const DiagnosticCenterDetail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [centerDetail, setCenterDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const token = localStorage.getItem("token");
  const defaultImage =
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop";

  // Fetch center details
  const fetchCenterDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://admin.vaidyabandhu.com/api/diagnostic/list-center/${id}`
      );
      if (!response.ok) throw new Error("Error fetching center details");
      const data = await response.json();
      setCenterDetail(data.data);
    } catch (error) {
      setError("Failed to load center details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCenterDetail(id);
  }, [id, fetchCenterDetail]);

  const handleEnquire = () => {
    setShowEnquireModal(true); // Open the Enquire Modal
  };

  // Handle enquiry submission after form is submitted in the modal
  const handleEnquirySubmit = async (formData) => {
    setEnquiryLoading(true);
    try {
      const response = await fetch(
        "https://admin.vaidyabandhu.com/api/enquiry/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            ...formData,
            // Include center details if needed
            center_id: id,
            center_name: centerDetail?.name,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Enquiry submitted successfully!", {
          position: "top-center",
        });
        console.log("Enquiry response:", data);
        setShowEnquireModal(false); // Close modal on success
      } else {
        toast.error("Failed to submit enquiry. Please try again.", {
          position: "top-center",
        });
        console.error("Enquiry submission failed");
      }
    } catch (error) {
      toast.error("Error occurred while submitting enquiry.", {
        position: "top-center",
      });
      console.error("Enquiry error:", error);
    } finally {
      setEnquiryLoading(false);
    }
  };

  // const handleCall = () => {
  //   if (centerDetail?.contact_number) {
  //     window.open(`tel:${centerDetail.contact_number}`, "_self");
  //   }
  // };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center position-relative container-bg"
        style={{
          minHeight: "100vh",
        }}
      >
        <div
          className="text-center bg-white p-5 rounded-4 shadow-lg loading-card"
          style={{
            borderRadius: "10px",
          }}
        >
          <div className="loading-spinner-wrapper mb-4">
            <Spinner
              animation="border"
              variant="primary"
              className="loading-spinner"
            />
          </div>
          <h4 className="text-dark mb-2 secondary-color">
            Loading Center Details
          </h4>
          <p className="text-muted mb-0">
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center container-bg"
        style={{
          minHeight: "100vh",
        }}
      >
        <div
          className="text-center bg-white p-5 rounded-4 shadow-lg error-card"
          style={{ maxWidth: "450px" }}
        >
          <div className="error-icon-wrapper mb-4">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <h4 className="text-dark mb-3 secondary-color">
            Oops! Something went wrong
          </h4>
          <p className="text-danger mb-4">{error}</p>
          <button
            className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm modern-btn"
            onClick={() => fetchCenterDetail(id)}
          >
            <i className="fas fa-redo me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!centerDetail) {
    return (
      <div
        className="d-flex justify-content-center align-items-center container-bg"
        style={{
          minHeight: "100vh",
        }}
      >
        <div
          className="text-center bg-white p-5 rounded-4 shadow-lg not-found-card"
          style={{ maxWidth: "450px" }}
        >
          <div className="not-found-icon-wrapper mb-4">
            <div className="not-found-icon">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <h4 className="text-dark mb-3">Center Not Found</h4>
          <p className="text-muted mb-4">
            The diagnostic center you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            className="btn btn-secondary btn-lg rounded-pill px-5 shadow-sm modern-btn"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostic-detail-container container-bg">
      <div className="container-fluid px-4 py-5">
        {/* Header Section with Hero Design */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="hero-card">
              <div className="hero-image-wrapper">
                <img
                  src={centerDetail?.image || defaultImage}
                  alt={centerDetail?.name}
                  className="hero-image"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />

                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <div className="hero-badge mb-3">
                    <span className="badge-text">Premium Healthcare</span>
                  </div>
                  <h1 className="hero-title text-white">{centerDetail.name}</h1>
                  <div className="hero-info">
                    <div className="hero-rating">
                      <Star size={20} className="rating-star" />
                      <span className="rating-value">
                        {centerDetail.rating || "4.5"}
                      </span>
                      <span className="rating-reviews">
                        ({centerDetail.reviews || "150"} reviews)
                      </span>
                    </div>
                    <div className="hero-location">
                      <MapPin size={16} className="location-icon" />
                      <span className="location-text">
                        {centerDetail.address}, {centerDetail.city} -{" "}
                        {centerDetail.pincode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        {/* Info Cards */}
        <div className="row mb-5 justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="info-card contact-card">
              <div className="info-card-icon">
                <Phone size={24} />
              </div>
              <div className="info-card-content">
                <h5 className="info-card-title secondary-color">
                  Contact Information
                </h5>
                <p className="info-card-subtitle">Get in touch with us</p>
                <p className="info-card-value">
                  {centerDetail.contact_number || "No contact number available"}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="info-card hours-card">
              <div className="info-card-icon">
                <Calendar size={24} />
              </div>
              <div className="info-card-content">
                <h5 className="info-card-title secondary-color">
                  Operating Hours
                </h5>
                <p className="info-card-subtitle">When we're available</p>
                <p className="info-card-value">Mon - Sat: 8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Services Section */}
        <div className="services-section mb-5">
          <div className="services-header">
            <h2 className="services-title secondary-color">
              Available Services
            </h2>
            <p className="services-subtitle">
              Comprehensive diagnostic services with state-of-the-art equipment
            </p>
          </div>

          <div className="row">
            {centerDetail.category?.map((service) => (
              <div key={service.id} className="col-lg-4 col-md-6 mb-4">
                <div className="service-card">
                  <div className="service-card-header">
                    <div className="service-icon">
                      <i className="fas fa-stethoscope"></i>
                    </div>
                    <h5 className="service-title">{service.name}</h5>
                  </div>
                  <div className="service-list">
                    {service.sub_category?.map((subService) => (
                      <div key={subService.id} className="service-item">
                        <div className="service-bullet"></div>
                        <span className="service-name">{subService.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="action-section">
          <div className="action-header">
            <h3 className="action-title secondary-color">
              Ready to Get Started?
            </h3>
            <p className="action-subtitle">
              Book your appointment or call us directly for immediate assistance
            </p>
          </div>

          <div className="action-buttons">
            <button className="modern-btn" onClick={handleEnquire}>
              <Calendar size={20} className="btn-icon" />
              <span className="btn-text">Make Enquiry</span>
            </button>
            {/* <button className="" onClick={handleCall}>
              <Phone size={20} className="btn-icon" />
              <span className="btn-text">Call Now</span>
            </button> */}
          </div>
        </div>

        {/* ShowEnquireModal is used here */}
        <ShowEnquireModal
          show={showEnquireModal}
          onClose={() => setShowEnquireModal(false)}
          setShowSuccessMessage={(msg) => alert(msg)}
          token={token}
          onSubmit={handleEnquirySubmit}
          loading={enquiryLoading}
        />
      </div>

      <style jsx>{`
        .diagnostic-detail-container {
          min-height: 100vh;
          position: relative;
        }

        .diagnostic-detail-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          pointer-events: none;
        }

        .container-fluid {
          position: relative;
          z-index: 1;
        }

        /* Loading States */
        .loading-card {
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInScale 0.6s ease-out;
        }

        .loading-spinner-wrapper {
          position: relative;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border-width: 3px;
          animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
        }

        .error-card,
        .not-found-card {
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInScale 0.6s ease-out;
        }

        .error-icon-wrapper,
        .not-found-icon-wrapper {
          position: relative;
        }

        .error-icon,
        .not-found-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 2rem;
          animation: bounce 2s ease-in-out infinite;
        }

        .error-icon {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
        }

        .not-found-icon {
          background: linear-gradient(135deg, #a8edea, #fed6e3);
          color: #6c757d;
        }

        .modern-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          min-width: 180px;
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .modern-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .modern-btn:hover::before {
          left: 100%;
        }

        .modern-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .btn-icon {
          margin-right: 0.75rem;
        }

        .btn-text {
          font-weight: 600;
        }

        /* Hero Section */
        .hero-card {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-image-wrapper {
          position: relative;
          height: 500px;
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hero-image:hover {
          transform: scale(1.05);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          // backdrop-filter: blur(1px);
        }

        .hero-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2.5rem;
          color: black;
          animation: slideUpFade 1s ease-out 0.3s both;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }

        .hero-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
        }

        .hero-rating,
        .hero-location {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
        }

        .rating-star {
          color: #ffc107;
          margin-right: 0.5rem;
        }

        .rating-value {
          font-size: 1.1rem;
          margin-right: 0.5rem;
        }

        .rating-reviews {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .location-icon {
          margin-right: 0.5rem;
          opacity: 0.9;
        }

        .location-text {
          font-size: 0.9rem;
        }

        /* Info Cards */
        .info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.8s ease-out;
        }

        .info-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
        }

        .info-card-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .contact-card .info-card-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .rating-card .info-card-icon {
          background: linear-gradient(135deg, #11998e, #38ef7d);
          color: white;
        }

        .hours-card .info-card-icon {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
        }

        .info-card:hover .info-card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .info-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .info-card-subtitle {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .info-card-value {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .rating-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .rating-star-small {
          color: #ffc107;
        }

        .rating-number {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .rating-text {
          color: #718096;
          font-size: 0.9rem;
        }

        /* Services Section */
        .services-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .services-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .services-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .services-subtitle {
          font-size: 1.125rem;
          color: #718096;
          max-width: 600px;
          margin: 0 auto;
        }

        .service-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 2rem;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }

        .service-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .service-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          font-size: 1.25rem;
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .service-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        .service-list {
          space-y: 0.75rem;
        }

        .service-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .service-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .service-name {
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Action Section */
        .action-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .action-header {
          margin-bottom: 2.5rem;
        }

        .action-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .action-subtitle {
          font-size: 1.125rem;
          color: #718096;
          max-width: 500px;
          margin: 0 auto;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-content {
            padding: 1.5rem;
          }

          .hero-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .services-section,
          .action-section {
            padding: 2rem;
          }

          .services-title {
            font-size: 2rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .modern-btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .info-card {
            padding: 1.5rem;
          }

          .services-section,
          .action-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DiagnosticCenterDetail;
