import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Star,
  Clock,
  Shield,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  MapIcon,
  Building,
  Copy,
} from "lucide-react";
import { OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import ShowEnquireModal from "./showEnquireModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetch } from "../../hooks/usefetch";
import { isNotEmptyArray } from "../../utiles/utils";

const DiagnosticCentersApp = () => {
  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [currentPage, setCurrentPage] = useState(1);
  const [showEnquireModal, setShowEnquireModal] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();

  // Search state
  const [serviceSearch, setServiceSearch] = React.useState("");

  const token = localStorage.getItem("token");
  const itemsPerPage = 5;
  const defaultImage =
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop";

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Adjust delay (500ms) as needed

    return () => clearTimeout(timeoutId); // Cleanup on each keystroke
  }, [searchTerm]);

  // Using useFetch hook to fetch diagnostic categories
  const {
    data: services,
    loading: loadingServices,
    error: errorServices,
    refetch: fetchServices,
  } = useFetch({
    method: "GET",
    request: "diagnostic/diagnostic-category",
    params: {
      pagination: false,
    },
  });

  // Using useFetch for API call
  const {
    data: diagnosticCenters,
    loading: loadingCenters,
    error: errorCenters,
    refetch: refreshListApi,
  } = useFetch({
    method: "GET",
    request: "diagnostic/list-center",
    params: {
      page_count: itemsPerPage.toString(),
      page: currentPage.toString(),
      search: debouncedSearchTerm.trim() ?? "",
      // Updated: Changed 'address' to 'city' parameter
      city: selectedAddress,
      services: selectedServices.join(","),
      sub_services: selectedSubServices.join(","),
    },
  });

  // Fetch cities using the new API
  const {
    data: citiesData,
    loading: loadingAddresses,
    error: citiesError,
  } = useFetch({
    method: "GET",
    request: "https://admin.vaidyabandhu.com/api/city/",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  useEffect(() => {
    if (citiesData && citiesData.data) {
      // Transform the cities data to match the expected format with 'name' property
      const transformedCities = citiesData.data.map((city) => ({
        id: city.id,
        name: city.city_name,
      }));
      setAddresses(transformedCities);
    }
    if (citiesError) {
      console.error("Error fetching cities:", citiesError);
      setAddresses([
        { id: "Delhi", name: "Delhi" },
        { id: "Mumbai", name: "Mumbai" },
        { id: "Bangalore", name: "Bangalore" },
        { id: "Chennai", name: "Chennai" },
        { id: "Hyderabad", name: "Hyderabad" },
      ]);
    }
  }, [citiesData, citiesError]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Set the search term
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handlers
  const handleServiceToggle = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
    setSelectedSubServices([]);
    setCurrentPage(1);
  };

  const handleSubServiceToggle = (subService) => {
    setSelectedSubServices((prev) =>
      prev.includes(subService)
        ? prev.filter((s) => s !== subService)
        : [...prev, subService]
    );
    setCurrentPage(1);
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
    setCurrentPage(1);
  };

  const handleEnquire = async (center) => {
    const hasToken = token;
    console.log({ hasToken });

    if (hasToken) {
      // Call the enquiry API with the token
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
              full_name: "test",
              phone: "1234567898",
              email: "email@email.com",
              address: "Bangalore",
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          toast.success("Enquiry submitted successfully!", {
            position: "top-center",
          });
          console.log("Enquiry response:", data);
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
      }
    } else {
      // If no token found, show the enquiry modal
      setShowEnquireModal(true);
      console.log("No token found. Showing enquiry modal...");
    }
  };

  const handleCenterClick = (center) => {
    // Navigate to the center details page
    navigate(`/clinic-list-details?id=${center.id}`);
  };

  const clearFilters = () => {
    setSelectedAddress("");
    setSelectedServices([]);
    setSelectedSubServices([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Memoized values
  const totalPages = useMemo(
    () =>
      Math.ceil(
        (diagnosticCenters?.pagination_data?.total_count ||
          diagnosticCenters?.data?.length) / itemsPerPage
      ),
    [diagnosticCenters]
  );
  const hasActiveFilters = useMemo(
    () =>
      selectedAddress ||
      selectedServices.length > 0 ||
      selectedSubServices.length > 0 ||
      searchTerm,
    [selectedAddress, selectedServices, selectedSubServices, searchTerm]
  );

  // Loading component
  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" style={{ color: "#3b82f6" }} />
      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  );

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="text-center py-5">
      <AlertCircle className="mb-3" size={48} style={{ color: "#ef4444" }} />
      <h5 className="text-danger mb-3">Oops! Something went wrong</h5>
      <p className="text-muted mb-4">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-primary" onClick={onRetry}>
          <RefreshCw size={16} className="me-2" />
          Try Again
        </button>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-5">
      <Building className="mb-3" size={64} style={{ color: "#6b7280" }} />
      <h5 className="text-muted mb-3">No diagnostic centers found</h5>
      <p className="text-muted mb-4">
        Try adjusting your filters or search terms to find more results.
      </p>
      {hasActiveFilters && (
        <button className="btn btn-primary" onClick={clearFilters}>
          <X size={16} className="me-2" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  const handleCopy = (e, text) => {
    // Try copying the text to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text} has been copied.`, { position: "top-center" });
        // Reset the "Copied!" message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
    e.stopPropagation();
  };

  const filteredServices = isNotEmptyArray(services?.data)
    ? services.data.filter((service) =>
        service.name.toLowerCase().includes(serviceSearch.trim().toLowerCase())
      )
    : [];

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
      {/* Modern Header with Gradient */}
      <div
        className="py-5 mb-4"
        style={{
          background: "linear-gradient(135deg,#00b2b2  0%, #007a7e  100%)",
          borderRadius: "0 0 24px 24px",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="text-white mb-3 fw-bold">
                Find Diagnostic Centers
              </h1>
              <p className="text-white opacity-75 mb-4">
                Discover trusted diagnostic centers near you with advanced
                facilities and expert care.
              </p>

              {/* Enhanced Search Bar */}
              <div className="position-relative">
                <Search
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  size={20}
                />
                <input
                  type="text"
                  className="form-control form-control-lg ps-5 pe-4 border-0 shadow-sm"
                  placeholder="Search by center name or services..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    borderRadius: "16px",
                    fontSize: "16px",
                    padding: "12px 16px 12px 48px",
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4 text-end d-none d-lg-block">
              <div className="text-white">
                <div className="d-flex align-items-center justify-content-end mb-2">
                  <span>Verified Centers</span>
                  <CheckCircle className="ms-2" size={20} />
                </div>
                <div className="d-flex align-items-center justify-content-end mb-2">
                  <span>Accredited Labs</span>
                  <Shield className="ms-2" size={20} />
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <span>Quick Results</span>
                  <Clock className="ms-2" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Mobile Filter Toggle */}
          <div className="col-12 d-lg-none mb-4">
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{ borderRadius: "12px" }}
              >
                <Filter size={18} />
                Filters
                {hasActiveFilters && (
                  <span className="badge bg-light text-primary rounded-pill">
                    {(selectedAddress ? 1 : 0) +
                      selectedServices.length +
                      selectedSubServices.length}
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                  style={{ borderRadius: "12px" }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Mobile Filters Dropdown */}
            {showMobileFilters && (
              <div
                className="card border-0 shadow-sm mt-3"
                style={{ borderRadius: "16px" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="mb-0 fw-bold" style={{ color: "#00b2b2" }}>
                      Filters
                    </h5>
                    <button
                      className="btn-close"
                      onClick={() => setShowMobileFilters(false)}
                      aria-label="Close"
                    ></button>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-semibold d-flex align-items-center gap-2"
                      style={{ color: "#00b2b2" }}
                    >
                      <MapIcon size={18} />
                      City
                    </label>
                    {loadingAddresses ? (
                      <LoadingSpinner text="Loading cities..." />
                    ) : (
                      <select
                        className="form-select border-0 bg-light"
                        value={selectedAddress}
                        onChange={handleAddressChange}
                        style={{ borderRadius: "12px", padding: "12px 16px" }}
                      >
                        <option value="">All Cities</option>
                        {addresses.map((address) => (
                          <option key={address.id} value={address.id}>
                            {address.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Services Filter */}
                  <div>
                    <label
                      className="form-label fw-semibold d-flex align-items-center gap-2"
                      style={{ color: "#00b2b2" }}
                    >
                      <Shield size={18} />
                      Services
                    </label>
                    {loadingServices ? (
                      <LoadingSpinner text="Loading services..." />
                    ) : errorServices ? (
                      <ErrorMessage
                        message={errorServices}
                        onRetry={fetchServices}
                      />
                    ) : (
                      <div
                        className="border-0 bg-light p-3"
                        style={{
                          borderRadius: "12px",
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        {/* Search box */}
                        <input
                          type="text"
                          className="form-control mb-3"
                          placeholder="Search services..."
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          style={{ borderRadius: 8, maxWidth: 340 }}
                        />

                        {isNotEmptyArray(filteredServices) ? (
                          filteredServices.map((service) => (
                            <div
                              key={service.id}
                              className="mb-3 pb-2"
                              style={{ borderBottom: "1px solid #00000012" }}
                            >
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`mobile-service-${service.id}`}
                                  checked={selectedServices.includes(
                                    service.id
                                  )}
                                  onChange={() =>
                                    handleServiceToggle(service.id)
                                  }
                                />
                                <label
                                  className="form-check-label fw-medium"
                                  htmlFor={`mobile-service-${service.id}`}
                                >
                                  {service.name}
                                </label>
                              </div>
                              {/* Sub-services */}
                              {selectedServices.includes(service.id) &&
                                isNotEmptyArray(service.sub_category) && (
                                  <div className="ms-4 mt-2">
                                    {service.sub_category.map((subService) => (
                                      <div
                                        key={subService.id}
                                        className="form-check mb-1"
                                      >
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`mobile-sub-service-${subService.id}`}
                                          checked={selectedSubServices.includes(
                                            subService.id
                                          )}
                                          onChange={() =>
                                            handleSubServiceToggle(
                                              subService.id
                                            )
                                          }
                                        />
                                        <label
                                          className="form-check-label text-muted"
                                          htmlFor={`mobile-sub-service-${subService.id}`}
                                        >
                                          {subService.name}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted">
                            No services found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Filters Sidebar */}
          <div className="col-lg-4 d-none d-lg-block">
            <div
              className="card border-0 shadow-sm mb-4 position-sticky"
              style={{
                borderRadius: "16px",
                top: "2rem",
                maxHeight: "636px",
                overflowY: "auto",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="mb-0 fw-bold" style={{ color: "#00b2b2" }}>
                    Filters
                  </h5>
                  {hasActiveFilters && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      style={{ fontSize: "12px" }}
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Location Filter */}
                <div className="mb-4">
                  <label
                    className="form-label fw-semibold d-flex align-items-center gap-2"
                    style={{ color: "#00b2b2" }}
                  >
                    <MapIcon size={18} />
                    City
                  </label>
                  {loadingAddresses ? (
                    <LoadingSpinner text="Loading cities..." />
                  ) : (
                    <select
                      className="form-select border-0 bg-light"
                      value={selectedAddress}
                      onChange={handleAddressChange}
                      style={{ borderRadius: "12px", padding: "12px 16px" }}
                    >
                      <option value="">All Cities</option>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Services Filter */}
                <div className="flex-grow-1 d-flex flex-column">
                  <label
                    className="form-label fw-semibold d-flex align-items-center gap-2"
                    style={{ color: "#00b2b2" }}
                  >
                    <Shield size={18} />
                    Services
                  </label>
                  {loadingServices ? (
                    <LoadingSpinner text="Loading services..." />
                  ) : errorServices ? (
                    <ErrorMessage
                      message={errorServices}
                      onRetry={fetchServices}
                    />
                  ) : (
                    <div
                      className="border-0 bg-light p-3 flex-grow-1"
                      style={{
                        borderRadius: "12px",
                      }}
                    >
                      {/* Add the search box here */}
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search services..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        style={{ borderRadius: 8, maxWidth: 340 }}
                      />

                      {isNotEmptyArray(filteredServices) ? (
                        filteredServices.map((service) => (
                          <div
                            key={service.id}
                            className="mb-3"
                            style={{
                              borderBottom: "1px solid #00000012",
                            }}
                          >
                            <div className="form-check d-flex justify-content-between align-items-center">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`service-${service.id}`}
                                checked={selectedServices.includes(service.id)}
                                onChange={() => handleServiceToggle(service.id)}
                              />
                              <label
                                className="form-check-label fw-medium"
                                htmlFor={`service-${service.id}`}
                                style={{ wordBreak: "break-word" }}
                              >
                                {service.name}
                              </label>
                              <ChevronRight size={20} />
                            </div>

                            {/* Sub-services with Smooth Animation */}
                            {selectedServices.includes(service.id) &&
                              isNotEmptyArray(service.sub_category) && (
                                <div
                                  className="ms-4 mt-2"
                                  style={{
                                    animation: "slideDown 0.2s ease-out",
                                    transformOrigin: "top",
                                  }}
                                >
                                  {service.sub_category.map((subService) => (
                                    <div
                                      key={subService.id}
                                      className="form-check mb-2"
                                    >
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`sub-service-${subService.id}`}
                                        checked={selectedSubServices.includes(
                                          subService.id
                                        )}
                                        onChange={() =>
                                          handleSubServiceToggle(subService.id)
                                        }
                                      />
                                      <label
                                        className="form-check-label text-muted"
                                        htmlFor={`sub-service-${subService.id}`}
                                        style={{
                                          wordBreak: "break-word",
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {subService.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-4">
                          No services found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
                max-height: 0;
              }
              to {
                opacity: 1;
                transform: translateY(0);
                max-height: 200px;
              }
            }
          `}</style>

          {/* Results Section */}
          <div className="col-lg-8">
            {loadingCenters ? (
              <LoadingSpinner text="Finding diagnostic centers..." />
            ) : errorCenters ? (
              <ErrorMessage message={errorCenters} onRetry={refreshListApi} />
            ) : !isNotEmptyArray(diagnosticCenters?.data) ? (
              <EmptyState />
            ) : (
              <div>
                {/* Results Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-1" style={{ color: "#00b2b2" }}>
                      Diagnostic Centers
                    </h4>
                    <p className="text-muted mb-0">
                      {diagnosticCenters.data.length} centers found
                      {hasActiveFilters && " with your filters"}
                    </p>
                  </div>
                  <div className="text-muted small">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>

                {/* Enhanced Centers Grid */}
                <div className="row">
                  {diagnosticCenters.data.map((center) => (
                    <div key={center.id} className="col-12 mb-4">
                      <div
                        className="card border-0 shadow-sm h-100 position-relative overflow-hidden"
                        style={{
                          borderRadius: "20px",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 24px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px rgba(0,0,0,0.1)";
                        }}
                      >
                        <div className="row g-0">
                          <div className="col-md-4">
                            <div
                              className="position-relative"
                              style={{ height: "300px" }}
                            >
                              <img
                                src={center.image || defaultImage}
                                alt={center.name}
                                className="img-fluid w-100 h-100"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "20px 0 0 20px",
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-8">
                            <div className="card-body p-4 h-100 d-flex flex-column">
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <h5
                                    className="card-title mb-0 fw-bold"
                                    style={{ color: "#00b2b2" }}
                                  >
                                    {center.name}
                                  </h5>
                                  <div className="d-flex align-items-center">
                                    <Star
                                      size={16}
                                      className="text-warning me-1"
                                      fill="currentColor"
                                    />
                                    <span className="fw-bold">
                                      {center.rating}
                                    </span>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <div className="d-flex align-items-start text-muted mb-2">
                                    <MapPin
                                      size={16}
                                      className="me-2 mt-1 flex-shrink-0"
                                    />
                                    <span>
                                      {center.address}, {center.city} -{" "}
                                      {center.pincode}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center text-muted mb-2">
                                    <Phone size={16} className="me-2" />
                                    <span>{center.contact_number}</span>
                                    <Copy
                                      size={16}
                                      className="ms-2 cursor-pointer"
                                      onClick={(e) =>
                                        handleCopy(e, center.contact_number)
                                      }
                                    />
                                  </div>
                                </div>

                                {/* Services Tags */}
                                <DiagnosticCenterCategories
                                  categories={
                                    isNotEmptyArray(center?.sub_category)
                                      ? center.sub_category
                                      : []
                                  }
                                />

                                {/* Features */}
                                <div className="d-flex gap-3 mb-3">
                                  {center.opening_hours === "24/7" && (
                                    <div className="d-flex align-items-center text-info">
                                      <Clock size={16} className="me-1" />
                                      <small>24/7 Available</small>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="d-flex gap-2 mt-auto">
                                {/* <button
                                  className="btn btn-primary"
                                  style={{
                                    borderRadius: "8px",
                                    padding: "8px 36px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnquire(center);
                                  }}
                                >
                                  Enquiry
                                </button> */}
                                <button
                                  style={{
                                    borderRadius: "8px",
                                    padding: "8px 30px",
                                    background: "#727b85",
                                  }}
                                  onClick={() => handleCenterClick(center)}
                                >
                                  Veiw details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {/* <div className="d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination pagination-lg">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0 bg-transparent text-white"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          style={{ borderRadius: "12px 0 0 12px" }}
                        >
                          <ChevronLeft size={20} />
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0 bg-transparent text-white"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          style={{
                            borderRadius: "0 12px 12px 0",
                            marginLeft: "0px",
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showEnquireModal && (
        <ShowEnquireModal
          show={showEnquireModal}
          onClose={() => setShowEnquireModal(false)}
          setShowSuccessMessage={setShowSuccessMessage}
          token={token}
        />
      )}

      {/* Enhanced Success Message */}
      {showSuccessMessage && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-4"
          style={{ zIndex: 1050 }}
        >
          <div
            className="alert alert-success alert-dismissible fade show shadow-lg border-0"
            role="alert"
            style={{ borderRadius: "16px" }}
          >
            <div className="d-flex align-items-center">
              <CheckCircle className="me-3 me-2" size={24} />
              <div>
                <h6 className="mb-1 fw-bold">Booking Confirmed!</h6>
                <p className="mb-0 small">
                  Your appointment request has been submitted. The center will
                  contact you soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosticCenterCategories = ({ categories }) => {
  // Check if the category exists and get the first 6 items
  const visibleCategories = categories.slice(0, 6); // Show only the first 6
  const remainingCategories = categories.slice(6); // Get the remaining items

  const renderPopover = () => (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="d-flex flex-wrap gap-2">
          {remainingCategories.map((service) => (
            <span
              key={service.id}
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{ borderRadius: "20px" }}
            >
              {service.name}
            </span>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="mb-3">
      <div className="d-flex flex-wrap gap-2">
        {isNotEmptyArray(visibleCategories) &&
          visibleCategories.map((service) => (
            <span
              key={service.id}
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{ borderRadius: "20px" }}
            >
              {service.name}
            </span>
          ))}

        {/* Show Popover if there are more than 6 items */}
        {remainingCategories.length > 0 && (
          <OverlayTrigger
            trigger="hover"
            placement="top"
            overlay={renderPopover()}
          >
            <span
              className="badge bg-light text-dark border px-3 py-1 me-2 mb-2"
              style={{
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              +{remainingCategories.length} more
            </span>
          </OverlayTrigger>
        )}
      </div>
    </div>
  );
};

export default DiagnosticCentersApp;
